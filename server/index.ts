import express from "express";
import { createHmac, createHash, timingSafeEqual } from "crypto";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { departments, offices, serviceCategories, tasks } from "../shared/campusData.js";
import { studentGuides, type StudentGuide, type StudentGuideSection } from "../shared/studentGuideData.js";
import {
  searchCampusServices,
  resolveOffice,
  resolveDepartment,
  resolveTask,
  formatOfficeResult,
  formatDepartmentResult,
  formatTaskResult,
  makeNotFoundPayload,
  type McpLanguage,
} from "../shared/mcpSearch.js";
import { db, initDb } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type AnalyticsSessionInput = {
  sessionId?: unknown;
  language?: unknown;
  pagePath?: unknown;
  referrer?: unknown;
  userAgent?: unknown;
};

type ContentType = "office" | "department" | "task" | "student_guide_section";
const contentTypes: ContentType[] = ["office", "department", "task", "student_guide_section"];

function getContentCollection(type: ContentType) {
  if (type === "office") return offices;
  if (type === "department") return departments;
  if (type === "student_guide_section") return flattenStudentGuideSections().map((item) => item.data);
  return tasks;
}

function flattenStudentGuideSections() {
  return studentGuides.flatMap((guide) =>
    guide.sections.map((section, index) => {
      const data = {
        ...section,
        guide_id: guide.id,
        order_index: index,
      } as Record<string, unknown>;

      return {
        type: "student_guide_section" as const,
        id: String(section.id),
        label: contentLabel("student_guide_section", data),
        data,
      };
    })
  );
}

function staticContentItems() {
  const collections: Array<[ContentType, Array<Record<string, unknown>>]> = [
    ["office", offices as unknown as Array<Record<string, unknown>>],
    ["department", departments as unknown as Array<Record<string, unknown>>],
    ["task", tasks as unknown as Array<Record<string, unknown>>],
  ];

  const campusItems = collections.flatMap(([type, items]) =>
    items.map((item) => ({
      type,
      id: String(item.id),
      label: contentLabel(type, item),
      data: item,
    }))
  );

  return [...campusItems, ...flattenStudentGuideSections()];
}

function contentLabel(type: ContentType, item: Record<string, unknown>) {
  if (type === "student_guide_section") {
    return `${readString(item.title_zh) ?? item.id} / ${readString(item.title_en) ?? ""}`;
  }
  if (type === "task") {
    return `${readString(item.task_name_zh) ?? item.id} / ${readString(item.task_name_en) ?? ""}`;
  }
  return `${readString(item.name_zh) ?? item.id} / ${readString(item.name_en) ?? ""}`;
}

function parseJsonObject(value: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(value) as unknown;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed as Record<string, unknown>
      : null;
  } catch {
    return null;
  }
}

async function getStoredContentItems() {
  const rows = await db.prepare(
    [
      "SELECT content_type, item_id, item_label, data_json",
      "FROM content_items",
      "WHERE status = 'active'",
      "ORDER BY content_type, item_id",
    ].join(" ")
  ).all<{ content_type: ContentType; item_id: string; item_label: string; data_json: string }>();

  return rows.flatMap((row) => {
    const data = parseJsonObject(row.data_json);
    if (!data) return [];
    return {
      type: row.content_type,
      id: row.item_id,
      label: row.item_label,
      data,
    };
  });
}

async function hasContentItems() {
  const row = await db.prepare(
    "SELECT COUNT(*) AS count FROM content_items"
  ).get<{ count: number }>();
  return Number(row?.count ?? 0) > 0;
}

async function getActiveContentItems() {
  const stored = await getStoredContentItems();
  if (stored.length > 0) return stored;
  return (await hasContentItems()) ? [] : staticContentItems();
}

function cloneStudentGuides() {
  return JSON.parse(JSON.stringify(studentGuides)) as StudentGuide[];
}

function readGuideId(value: unknown): "degree" | "exchange" | null {
  return value === "degree" || value === "exchange" ? value : null;
}

function readOrderIndex(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

async function getStudentGuidesFromContentItems() {
  const rows = await db.prepare(
    [
      "SELECT item_id, data_json, status",
      "FROM content_items",
      "WHERE content_type = 'student_guide_section'",
      "ORDER BY item_id",
    ].join(" ")
  ).all<{ item_id: string; data_json: string; status: string }>();

  if (rows.length === 0) return cloneStudentGuides();

  const guides = cloneStudentGuides();
  const guideMap = new Map(guides.map((guide) => [guide.id, guide]));
  const staticGuideBySectionId = new Map<string, "degree" | "exchange">();
  const originalOrder = new Map<string, number>();

  for (const guide of guides) {
    guide.sections.forEach((section, index) => {
      staticGuideBySectionId.set(section.id, guide.id);
      originalOrder.set(`${guide.id}:${section.id}`, index);
    });
  }

  for (const row of rows) {
    const parsed = parseJsonObject(row.data_json);
    const guideId = readGuideId(parsed?.guide_id) ?? staticGuideBySectionId.get(row.item_id) ?? null;
    if (!guideId) continue;

    const guide = guideMap.get(guideId);
    if (!guide) continue;

    if (row.status === "deleted") {
      guide.sections = guide.sections.filter((section) => section.id !== row.item_id);
      continue;
    }

    if (row.status !== "active" || !parsed) continue;

    const { guide_id: _guideId, order_index: _orderIndex, ...sectionData } = parsed;
    const nextSection = {
      ...sectionData,
      id: row.item_id,
    } as unknown as StudentGuideSection;

    const existingIndex = guide.sections.findIndex((section) => section.id === row.item_id);
    if (existingIndex >= 0) {
      guide.sections[existingIndex] = nextSection;
    } else {
      guide.sections.push(nextSection);
    }
  }

  for (const guide of guides) {
    guide.sections.sort((a, b) => {
      const aSource = rows.find((row) => row.item_id === a.id && row.status === "active");
      const bSource = rows.find((row) => row.item_id === b.id && row.status === "active");
      const aData = aSource ? parseJsonObject(aSource.data_json) : null;
      const bData = bSource ? parseJsonObject(bSource.data_json) : null;
      const aOrder = readOrderIndex(aData?.order_index, originalOrder.get(`${guide.id}:${a.id}`) ?? 999);
      const bOrder = readOrderIndex(bData?.order_index, originalOrder.get(`${guide.id}:${b.id}`) ?? 999);
      return aOrder - bOrder;
    });
  }

  return guides;
}

async function seedContentItems() {
  for (const item of staticContentItems()) {
    await db.prepare(
      [
        "INSERT INTO content_items",
        "(content_type, item_id, item_label, data_json, status)",
        "VALUES (?, ?, ?, ?, 'active')",
        "ON CONFLICT(content_type, item_id) DO NOTHING",
      ].join(" ")
    ).run(item.type, item.id, item.label, JSON.stringify(item.data));
  }
}

async function ensureContentItemsSchema() {
  try {
    await db.exec("ALTER TABLE content_items ADD COLUMN status TEXT NOT NULL DEFAULT 'active'");
  } catch (err) {
    const message = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
    if (!message.includes("duplicate column") && !message.includes("already exists")) {
      throw err;
    }
  }
  await db.exec("CREATE INDEX IF NOT EXISTS idx_content_items_status ON content_items(status)");
}

const knownContentTextReplacements: Array<[string, string]> = [
  [
    "同步完成後，前往 eCourse2，使用「Non-CCU Faculty/Student Login」登入。",
    "同步完成後，前往 eCourse2（https://ecourse2.ccu.edu.tw/），使用「Non-CCU Faculty/Student Login」登入。",
  ],
  [
    "Log in to eCourse2 via the \"Non-CCU Faculty/Student Login\" portal. Username: ccu + your student ID (e.g., ccu123456789). Password: your newly updated password.",
    "Go to https://ecourse2.ccu.edu.tw/ and log in via the \"Non-CCU Faculty/Student Login\" portal. Username: ccu + your student ID (e.g., ccu123456789). Password: your newly updated password.",
  ],
  [
    "https://it.ccu.edu.tw/p/426100930.php",
    "https://it.ccu.edu.tw/p/426-1009-36.php?Lang=zh-tw",
  ],
  [
    "https://it.ccu.edu.tw/p/426-1009-30.php?Lang=zh-tw",
    "https://it.ccu.edu.tw/p/426-1009-36.php?Lang=zh-tw",
  ],
  [
    "https://it.ccu.edu.tw/p/426100918.php",
    "https://it.ccu.edu.tw/p/426-1009-18.php?Lang=zh-tw",
  ],
  [
    "https://servicestation.immigration.gov.tw/5880/#",
    "https://servicestation.immigration.gov.tw/5880/",
  ],
  [
    "https://reurl.cc/M2M8GW",
    "https://www.google.com/maps/search/?api=1&query=%E7%A7%BB%E6%B0%91%E7%BD%B2%E5%98%89%E7%BE%A9%E5%B8%82%E6%9C%8D%E5%8B%99%E7%AB%99",
  ],
  [
    "https://www.boca.gov.tw/fp-9-185-35222-1.html",
    "https://visawebapp.boca.gov.tw",
  ],
  [
    "https://www.boca.gov.tw/cp-402-186-c060a-1.html",
    "https://visawebapp.boca.gov.tw",
  ],
  [
    "https://www.boca.gov.tw/cp-400-4336-94cdb-1.html",
    "https://visawebapp.boca.gov.tw",
  ],
  [
    "Fill out the application form online, then print and sign it: https://www.boca.gov.tw/cp-158-4342-a78b4-2.html",
    "Fill out the application form online, then print and sign it: https://visawebapp.boca.gov.tw",
  ],
  [
    "application fees: https://www.boca.gov.tw/cp-158-4342-a78b4-2.html",
    "Application fees: https://www.boca.gov.tw/cp-396-32-4a369-1.html",
  ],
  [
    "https://www026182.ccu.edu.tw/hZhUp6Fqyr8lLbHHA",
    "https://portal.ccu.edu.tw/",
  ],
  [
    "https://www.lib.ccu.edu.tw/",
    "https://lib.ccu.edu.tw/",
  ],
  [
    "https://lc.ccu.edu.tw/",
    "https://cls.ccu.edu.tw/",
  ],
  [
    "https://studentlife.ccu.edu.tw/p/404103420790.php?Lang=zhtw",
    "https://studentlife.ccu.edu.tw/p/404-1034-20790.php?Lang=zh-tw",
  ],
  [
    "https://studentlife.ccu.edu.tw/p/404103420791.php?Lang=zhtw",
    "https://studentlife.ccu.edu.tw/p/404-1034-20791.php?Lang=zh-tw",
  ],
  [
    "Oncampus emergency aid",
    "On-campus emergency aid",
  ],
  [
    "Offcampus emergency aid",
    "Off-campus emergency aid",
  ],
  [
    "https://chiayiibus.cyhg.gov.tw/DynamicBusQuery",
    "https://taiwanhelper.com/bus/CYI",
  ],
  [
    "https://oga.ccu.edu.tw/p/404100611703.php?Lang=zhtw",
    "https://oga.ccu.edu.tw/p/404-1006-11703.php?Lang=zh-tw",
  ],
  [
    "https://career.ccu.edu.tw/p/40310384787.php?Lang=zhtw",
    "https://career.ccu.edu.tw/p/412-1038-244.php?Lang=zh-tw",
  ],
  [
    "https://www.ccu.edu.tw/p/404100025665.php?Lang=zhtw",
    "https://www.ccu.edu.tw/p/404-1000-25665.php?Lang=zh-tw",
  ],
];

const structuredTaskStepSyncIds = new Set([
  "registration",
  "arc_visitor_visa",
  "arc_extension",
  "go_to_nia",
  "resident_visa_degree",
  "resident_visa_exchange_year",
  "visitor_visa_exchange_semester",
  "scholarship",
  "suspension",
  "exchange_ecourse_account",
  "default_password",
  "licensed_software",
  "graduation_gown",
  "work_permit",
  "off_campus_internship",
  "emergency_aid",
  "mcp_chinese_language_learning_support",
  "mcp_reserve_sports_facilities",
  "mcp_sports_center_opening_hours",
  "mcp_check_bus_schedules",
]);

function applyKnownContentTextReplacements(value: unknown): unknown {
  if (typeof value === "string") {
    return knownContentTextReplacements.reduce(
      (current, [from, to]) => current.split(from).join(to),
      value
    );
  }

  if (Array.isArray(value)) {
    return value.map(applyKnownContentTextReplacements);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        applyKnownContentTextReplacements(entry),
      ])
    );
  }

  return value;
}

async function applyKnownContentFixes() {
  const rows = await db.prepare(
    [
      "SELECT item_id, data_json",
      "FROM content_items",
      "WHERE content_type = 'task' AND status = 'active'",
    ].join(" ")
  ).all<{ item_id: string; data_json: string }>();

  for (const row of rows) {
    const data = parseJsonObject(row.data_json);
    if (!data) continue;

    const nextData = applyKnownContentTextReplacements(data) as Record<string, unknown>;
    if (structuredTaskStepSyncIds.has(row.item_id)) {
      const staticTask = tasks.find((task) => task.id === row.item_id);
      if (staticTask) {
        nextData.steps = staticTask.steps;
      }
    }
    const nextJson = JSON.stringify(nextData);
    if (nextJson === row.data_json) continue;

    await db.prepare(
      [
        "UPDATE content_items",
        "SET item_label = ?, data_json = ?, updated_at = CURRENT_TIMESTAMP",
        "WHERE content_type = 'task' AND item_id = ?",
      ].join(" ")
    ).run(contentLabel("task", nextData), nextJson, row.item_id);
  }
}

async function searchContentItems(query: string) {
  const q = normalizeQuery(query);
  const items = await getActiveContentItems();

  return items
      .filter((item) => {
        if (!q) return true;
        return normalizeQuery(JSON.stringify(item.data)).includes(q);
      })
      .slice(0, q ? 50 : 15)
      .map((item) => ({
        type: item.type,
        id: item.id,
        label: item.label,
        data: item.data,
      }));
}

async function findContentItem(type: ContentType, id: string) {
  const stored = await db.prepare(
    [
      "SELECT item_label, data_json, status",
      "FROM content_items",
      "WHERE content_type = ? AND item_id = ?",
      "LIMIT 1",
    ].join(" ")
  ).get<{ item_label: string; data_json: string; status: string }>(type, id);

  if (stored) {
    if (stored.status !== "active") return null;
    const data = parseJsonObject(stored.data_json);
    if (data) {
      return {
        type,
        id,
        label: stored.item_label,
        data,
      };
    }
  }

  const item = (getContentCollection(type) as Array<{ id: string }>).find((entry) => entry.id === id);
  if (!item) return null;
  return {
    type,
    id,
    label: contentLabel(type, item as unknown as Record<string, unknown>),
    data: item,
  };
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function normalizeQuery(query: string) {
  return query.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
}

async function ensureSession(input: AnalyticsSessionInput, fallbackUserAgent?: string): Promise<string | null> {
  const sessionId = readString(input.sessionId);
  if (!sessionId) return null;

  const language = readString(input.language);
  const pagePath = readString(input.pagePath);
  const referrer = readString(input.referrer);
  const userAgent = readString(input.userAgent) ?? fallbackUserAgent ?? null;

  await db.prepare(
    [
      "INSERT INTO sessions (id, language, user_agent, first_page_path, referrer)",
      "VALUES (?, ?, ?, ?, ?)",
      "ON CONFLICT(id) DO UPDATE SET",
      "last_seen_at = CURRENT_TIMESTAMP,",
      "language = COALESCE(excluded.language, sessions.language),",
      "user_agent = COALESCE(excluded.user_agent, sessions.user_agent)",
    ].join(" ")
  ).run(sessionId, language, userAgent, pagePath, referrer);

  return sessionId;
}

async function adminJson(res: express.Response, action: () => unknown | Promise<unknown>) {
  try {
    const payload = await action();
    if (!res.headersSent) res.json(payload);
  } catch (err) {
    console.error("Admin API error:", err);
    res.status(500).json({ error: "Admin API failed" });
  }
}

async function runDbTransaction(action: () => Promise<void>) {
  await db.transaction(action);
}

const ADMIN_COOKIE_NAME = "ccu_admin_session";
const ADMIN_SESSION_TTL_SECONDS = 8 * 60 * 60;

type AdminTokenPayload = {
  role: "admin";
  exp: number;
};

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? (process.env.NODE_ENV === "production" ? null : "admin");
}

function getAdminSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "ccu-guide-dev-admin-secret";
}

function safeEqual(a: string, b: string) {
  const aHash = createHash("sha256").update(a).digest();
  const bHash = createHash("sha256").update(b).digest();
  return timingSafeEqual(aHash, bHash);
}

function signAdminToken(payload: AdminTokenPayload) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", getAdminSecret()).update(data).digest("base64url");
  return `${data}.${signature}`;
}

function verifyAdminToken(token: string | null): AdminTokenPayload | null {
  if (!token) return null;

  const [data, signature] = token.split(".");
  if (!data || !signature) return null;

  const expected = createHmac("sha256", getAdminSecret()).update(data).digest("base64url");
  if (!safeEqual(signature, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as AdminTokenPayload;
    if (payload.role !== "admin" || typeof payload.exp !== "number" || payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function parseCookies(header: string | undefined) {
  const cookies = new Map<string, string>();
  if (!header) return cookies;

  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (key) cookies.set(key, decodeURIComponent(value));
  }

  return cookies;
}

function getAdminPayload(req: express.Request) {
  return verifyAdminToken(parseCookies(req.headers.cookie).get(ADMIN_COOKIE_NAME) ?? null);
}

function adminCookieAttributes(maxAge: number) {
  return [
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
    process.env.NODE_ENV === "production" ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

function setAdminCookie(res: express.Response) {
  const token = signAdminToken({
    role: "admin",
    exp: Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000,
  });
  res.setHeader(
    "Set-Cookie",
    `${ADMIN_COOKIE_NAME}=${encodeURIComponent(token)}; ${adminCookieAttributes(ADMIN_SESSION_TTL_SECONDS)}`
  );
}

function clearAdminCookie(res: express.Response) {
  res.setHeader("Set-Cookie", `${ADMIN_COOKIE_NAME}=; ${adminCookieAttributes(0)}`);
}

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (getAdminPayload(req)) {
    next();
    return;
  }
  res.status(401).json({ error: "Admin login required" });
}

function textResponse(payload: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: typeof payload === "string" ? payload : JSON.stringify(payload, null, 2),
      },
    ],
  };
}

function firstNonEmpty(...values: Array<string | undefined>) {
  return values.find((value) => value && value.trim().length > 0)?.trim() ?? "";
}

const languageSchema = z.enum(["auto", "en", "zh-TW"]).optional().describe(
  'Response language for this tool result. Pass "en" if the user wrote in English, "zh-TW" if the user wrote in Chinese. Use "auto" only when the user language is genuinely unknown.'
);

function registerTools(server: McpServer) {
  server.tool(
    "search_campus_service",
    [
      "Search CCU campus services, offices, departments, locations, contacts, and student tasks by natural language.",
      "Use this when the user does not know the exact office id or task id.",
      "Returns a small ranked JSON result, not the full database.",
    ].join(" "),
    {
      query: z.string().describe("Natural language question or keyword, e.g. lost student ID, language center, OIA, course selection."),
      language: languageSchema,
    },
    async ({ query, language }) => textResponse(searchCampusServices(query, (language ?? "auto") as McpLanguage))
  );

  server.tool(
    "get_office_info",
    [
      "Get detailed information about one CCU administrative office or service unit.",
      "Use this for office services, location, office hours, phone, email, and official website.",
      "Input may be id, English name, Chinese name, abbreviation, alias, or keyword.",
    ].join(" "),
    {
      office_id: z.string().optional().describe("Optional office id, e.g. oia or oaa."),
      query: z.string().optional().describe("Office name, alias, Chinese name, English name, abbreviation, or keyword."),
      language: languageSchema,
    },
    async ({ office_id, query, language }) => {
      const lookup = firstNonEmpty(query, office_id);
      if (!lookup) return textResponse({ status: "missing_input", message: "Provide an office id, name, alias, or keyword." });
      const result = resolveOffice(lookup);
      return textResponse(result ? formatOfficeResult(result, (language ?? "auto") as McpLanguage) : makeNotFoundPayload(lookup, "office"));
    }
  );

  server.tool(
    "get_department_info",
    [
      "Get detailed information about one CCU academic department, institute, or college office.",
      "Use this for department location, college, building, floor, room, service scope, and official website.",
      "Input may be id, English name, Chinese name, abbreviation, college name, or keyword.",
    ].join(" "),
    {
      dept_id: z.string().optional().describe("Optional department id, e.g. mis."),
      query: z.string().optional().describe("Department name, college name, Chinese name, English name, abbreviation, or keyword."),
      language: languageSchema,
    },
    async ({ dept_id, query, language }) => {
      const lookup = firstNonEmpty(query, dept_id);
      if (!lookup) return textResponse({ status: "missing_input", message: "Provide a department id, name, college name, or keyword." });
      const result = resolveDepartment(lookup);
      return textResponse(result ? formatDepartmentResult(result, (language ?? "auto") as McpLanguage) : makeNotFoundPayload(lookup, "department"));
    }
  );

  server.tool(
    "get_task_guide",
    [
      "Get step-by-step administrative guidance for a student task or problem.",
      "Use this when the user asks how to handle something, what documents are needed, where to go, or what steps to follow.",
      "Input may be a task id, task name, scenario, keyword, or natural language question.",
    ].join(" "),
    {
      task_keyword: z.string().optional().describe("Optional task keyword or id."),
      query: z.string().optional().describe("Natural language task question or keyword."),
      language: languageSchema,
    },
    async ({ task_keyword, query, language }) => {
      const lookup = firstNonEmpty(query, task_keyword);
      if (!lookup) return textResponse({ status: "missing_input", message: "Provide a task keyword, id, scenario, or question." });
      const result = resolveTask(lookup);
      return textResponse(result ? formatTaskResult(result, (language ?? "auto") as McpLanguage) : makeNotFoundPayload(lookup, "task"));
    }
  );

  server.tool(
    "get_location_info",
    [
      "Find location information for a CCU office, department, center, building, floor, or room.",
      "Use this when the user asks where something is or how to find a unit.",
    ].join(" "),
    {
      query: z.string().describe("Location query, e.g. where is OIA, language center, administration building."),
      language: languageSchema,
    },
    async ({ query, language }) => {
      const result = searchCampusServices(query, (language ?? "auto") as McpLanguage);
      return textResponse({
        query,
        language: language ?? "auto",
        intent: "location_lookup",
        offices: result.offices.map((office) => ({
          type: office.type,
          id: office.id,
          confidence: office.confidence,
          name_en: office.name_en,
          name_zh: office.name_zh,
          location: office.location,
          needs_manual_review: office.needs_manual_review,
        })),
        departments: result.departments.map((department) => ({
          type: department.type,
          id: department.id,
          confidence: department.confidence,
          name_en: department.name_en,
          name_zh: department.name_zh,
          college_en: department.college_en,
          college_zh: department.college_zh,
          location: department.location,
          needs_manual_review: department.needs_manual_review,
        })),
      });
    }
  );

  server.tool(
    "get_contact_info",
    [
      "Find contact information for a CCU administrative office or service unit.",
      "Use this when the user asks for phone number, extension, email, office hours, official website, or contact window.",
    ].join(" "),
    {
      query: z.string().describe("Contact query, e.g. phone extension of OIA, academic affairs email."),
      language: languageSchema,
    },
    async ({ query, language }) => {
      const result = searchCampusServices(query, (language ?? "auto") as McpLanguage);
      return textResponse({
        query,
        language: language ?? "auto",
        intent: "contact_lookup",
        offices: result.offices.map((office) => ({
          type: office.type,
          id: office.id,
          confidence: office.confidence,
          name_en: office.name_en,
          name_zh: office.name_zh,
          contact: office.contact,
          location: office.location,
          services_en: office.services_en,
          services_zh: office.services_zh,
          needs_manual_review: office.needs_manual_review,
        })),
      });
    }
  );

  server.tool(
    "list_service_categories",
    "List available CCU service categories. Use only when the user wants to browse broad categories.",
    {
      language: languageSchema,
    },
    async ({ language }) => {
      return textResponse({
        language: language ?? "auto",
        categories: serviceCategories.map((category) => ({
          id: category.id,
          name_en: category.name_en,
          name_zh: category.name_zh,
          description_en: category.description_en,
          description_zh: category.description_zh,
          keywords: category.keywords,
        })),
      });
    }
  );
}

async function startServer() {
  await initDb();
  await ensureContentItemsSchema();
  await seedContentItems();
  await applyKnownContentFixes();

  const app = express();
  const server = createServer(app);

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, mcp-session-id");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  app.post("/mcp", express.json(), async (req, res) => {
    try {
      const mcpServer = new McpServer({ name: "ccu-intl-guide", version: "1.0.0" });
      registerTools(mcpServer);
      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
      await mcpServer.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (err) {
      console.error("MCP error:", err);
      if (!res.headersSent) res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/mcp", async (_req, res) => {
    res.status(405).json({ error: "Method not allowed. Use POST." });
  });

  app.post("/api/analytics/search-event", express.json(), async (req, res) => {
    try {
      const startedAt = Date.now();
      const body = req.body as Record<string, unknown>;
      const query = readString(body.query);

      if (!query) {
        res.status(400).json({ error: "query is required" });
        return;
      }

      const sessionId = await ensureSession(
        {
          sessionId: body.session_id,
          language: body.language,
          pagePath: body.page_path,
          referrer: body.referrer,
        },
        req.get("user-agent")
      );

      const resultTypesValue = body.result_types;
      const resultTypes = Array.isArray(resultTypesValue)
        ? resultTypesValue.filter((item) => typeof item === "string").join(",")
        : readString(resultTypesValue);

      await db.prepare(
        [
          "INSERT INTO search_events",
          "(session_id, query, normalized_query, language, page_path, result_count, result_types, response_time_ms)",
          "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        ].join(" ")
      ).run(
        sessionId,
        query,
        normalizeQuery(query),
        readString(body.language),
        readString(body.page_path),
        typeof body.result_count === "number" ? body.result_count : 0,
        resultTypes,
        Date.now() - startedAt
      );

      res.json({ ok: true });
    } catch (err) {
      console.error("Search analytics error:", err);
      res.status(500).json({ error: "Failed to record search event" });
    }
  });

  app.get("/api/content-data", (_req, res) => void adminJson(res, async () => {
    const items = await getActiveContentItems();
    return {
      serviceCategories,
      offices: items.filter((item) => item.type === "office").map((item) => item.data),
      departments: items.filter((item) => item.type === "department").map((item) => item.data),
      tasks: items.filter((item) => item.type === "task").map((item) => item.data),
    };
  }));

  app.get("/api/student-guides", (_req, res) => void adminJson(res, async () => {
    return {
      studentGuides: await getStudentGuidesFromContentItems(),
    };
  }));

  app.post("/api/chat", express.json(), async (req, res) => {
    let conversationId: number | null = null;
    let sessionId: string | null = null;
    const startedAt = Date.now();

    try {
      const body = req.body as Record<string, unknown>;
      const analytics = (body.analytics && typeof body.analytics === "object"
        ? body.analytics
        : {}) as Record<string, unknown>;
      const messages = Array.isArray(body.messages) ? body.messages : [];
      const userMessage = messages
        .slice()
        .reverse()
        .find((message): message is { role: string; content: string } =>
          Boolean(
            message &&
              typeof message === "object" &&
              (message as { role?: unknown }).role === "user" &&
              typeof (message as { content?: unknown }).content === "string"
          )
        );

      sessionId = await ensureSession(
        {
          sessionId: analytics.session_id,
          language: analytics.language,
          pagePath: analytics.page_path,
          referrer: analytics.referrer,
        },
        req.get("user-agent")
      );

      const conversationKey = readString(analytics.conversation_key);
      if (conversationKey) {
        const existing = await db
          .prepare("SELECT id FROM ccugpt_conversations WHERE conversation_key = ? LIMIT 1")
          .get(conversationKey) as { id: number } | undefined;

        if (existing) {
          conversationId = existing.id;
          await db.prepare(
            "UPDATE ccugpt_conversations SET updated_at = CURRENT_TIMESTAMP, language = COALESCE(?, language), model = COALESCE(?, model), page_path = COALESCE(?, page_path), status = 'active' WHERE id = ?"
          ).run(readString(analytics.language), readString(body.model), readString(analytics.page_path), conversationId);
        } else {
          const result = await db.prepare(
            [
              "INSERT INTO ccugpt_conversations",
              "(session_id, conversation_key, page_path, language, model, status)",
              "VALUES (?, ?, ?, ?, ?, 'active')",
            ].join(" ")
          ).run(sessionId, conversationKey, readString(analytics.page_path), readString(analytics.language), readString(body.model));
          conversationId = Number(result.lastInsertRowid);
        }
      }

      if (conversationId && userMessage) {
        await db.prepare(
          "INSERT INTO ccugpt_messages (conversation_id, session_id, role, content, language, page_path) VALUES (?, ?, 'user', ?, ?, ?)"
        ).run(conversationId, sessionId, userMessage.content, readString(analytics.language), readString(analytics.page_path));
      }

      const forwardedBody = { ...body };
      delete forwardedBody.analytics;

      const response = await fetch("https://ccugpt.ccu.edu.tw/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer mcp-demo-2026",
        },
        body: JSON.stringify(forwardedBody),
      });
      const data = await response.json();

      const assistantMessage = data?.choices?.[0]?.message?.content;
      if (conversationId && typeof assistantMessage === "string") {
        await db.prepare(
          "INSERT INTO ccugpt_messages (conversation_id, session_id, role, content, language, page_path) VALUES (?, ?, 'assistant', ?, ?, ?)"
        ).run(conversationId, sessionId, assistantMessage, readString(analytics.language), readString(analytics.page_path));
        await db.prepare("UPDATE ccugpt_conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(conversationId);
      }

      if (conversationId && userMessage) {
        await db.prepare(
          [
            "INSERT INTO ccugpt_requests",
            "(conversation_id, session_id, user_message, assistant_message, model, success, status_code, latency_ms, error_message, raw_response_json)",
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          ].join(" ")
        ).run(
          conversationId,
          sessionId,
          userMessage.content,
          typeof assistantMessage === "string" ? assistantMessage : null,
          readString(body.model),
          response.ok ? 1 : 0,
          response.status,
          Date.now() - startedAt,
          response.ok ? null : `CCUGPT API error ${response.status}`,
          JSON.stringify(data).slice(0, 20000)
        );
      }

      res.status(response.status).json(data);
    } catch (err) {
      console.error("CCU GPT proxy error:", err);
      if (conversationId) {
        await db.prepare(
          [
            "INSERT INTO ccugpt_requests",
            "(conversation_id, session_id, user_message, model, success, latency_ms, error_message)",
            "VALUES (?, ?, ?, ?, 0, ?, ?)",
          ].join(" ")
        ).run(conversationId, sessionId, "", null, Date.now() - startedAt, err instanceof Error ? err.message : String(err));
      }
      res.status(502).json({ error: "Failed to reach CCU GPT service" });
    }
  });

  // ── Admin Auth / API ─────────────────────────────────────────────────────────
  app.post("/api/admin/login", express.json(), (req, res) => {
    const configuredPassword = getAdminPassword();
    const password = readString((req.body as { password?: unknown }).password);

    if (!configuredPassword) {
      res.status(503).json({ error: "ADMIN_PASSWORD is not configured" });
      return;
    }

    if (!password || !safeEqual(password, configuredPassword)) {
      res.status(401).json({ error: "Invalid admin password" });
      return;
    }

    setAdminCookie(res);
    res.json({ ok: true });
  });

  app.post("/api/admin/logout", (_req, res) => {
    clearAdminCookie(res);
    res.json({ ok: true });
  });

  app.get("/api/admin/me", (req, res) => {
    res.json({
      authenticated: Boolean(getAdminPayload(req)),
      passwordConfigured: Boolean(getAdminPassword()),
    });
  });

  app.use("/api/admin", requireAdmin);

  app.get("/api/admin/stats", (_req, res) => void adminJson(res, async () => {
    const totalSearches = ((await db.prepare("SELECT COUNT(*) as n FROM search_events").get()) as { n: number }).n;
    const totalConversations = ((await db.prepare("SELECT COUNT(*) as n FROM ccugpt_conversations").get()) as { n: number }).n;
    const totalMessages = ((await db.prepare("SELECT COUNT(*) as n FROM ccugpt_messages").get()) as { n: number }).n;
    const totalSessions = ((await db.prepare("SELECT COUNT(*) as n FROM sessions").get()) as { n: number }).n;
    const topQueries = await db.prepare(
      "SELECT MIN(query) as query, COUNT(*) as count FROM search_events GROUP BY normalized_query ORDER BY count DESC, MAX(created_at) DESC LIMIT 10"
    ).all();
    const recentActivity = await db.prepare(
      [
        "SELECT 'search' as type, created_at, query as label, page_path FROM search_events",
        "UNION ALL",
        "SELECT 'ccugpt' as type, created_at, substr(content, 1, 120) as label, page_path FROM ccugpt_messages WHERE role = 'user'",
        "ORDER BY created_at DESC LIMIT 12",
      ].join(" ")
    ).all();
    return { totalSearches, totalConversations, totalMessages, totalSessions, topQueries, recentActivity };
  }));

  app.get("/api/admin/search-events", (_req, res) => void adminJson(res, async () => {
    const events = await db.prepare(
      "SELECT id, created_at, query, language, result_count, result_types, response_time_ms, page_path FROM search_events ORDER BY created_at DESC LIMIT 200"
    ).all();
    return events;
  }));

  app.get("/api/admin/ccugpt-conversations", (_req, res) => void adminJson(res, async () => {
    const conversations = await db.prepare(
      "SELECT id, created_at, updated_at, language, model, status, page_path FROM ccugpt_conversations ORDER BY created_at DESC LIMIT 100"
    ).all() as { id: number }[];

    const result = await Promise.all(conversations.map(async (conv) => {
      const messages = await db.prepare(
        "SELECT role, content, created_at FROM ccugpt_messages WHERE conversation_id = ? ORDER BY created_at ASC"
      ).all(conv.id);
      return { ...conv, messages };
    }));
    return result;
  }));

  app.delete("/api/admin/records/search-events", (_req, res) => void adminJson(res, async () => {
    const before = {
      searchEvents: ((await db.prepare("SELECT COUNT(*) as n FROM search_events").get()) as { n: number }).n,
      searchClicks: ((await db.prepare("SELECT COUNT(*) as n FROM search_click_events").get()) as { n: number }).n,
    };

    await runDbTransaction(async () => {
      await db.prepare("DELETE FROM search_click_events").run();
      await db.prepare("DELETE FROM search_events").run();
    });

    return { ok: true, deleted: before };
  }));

  app.delete("/api/admin/records/ccugpt", (_req, res) => void adminJson(res, async () => {
    const before = {
      conversations: ((await db.prepare("SELECT COUNT(*) as n FROM ccugpt_conversations").get()) as { n: number }).n,
      messages: ((await db.prepare("SELECT COUNT(*) as n FROM ccugpt_messages").get()) as { n: number }).n,
      requests: ((await db.prepare("SELECT COUNT(*) as n FROM ccugpt_requests").get()) as { n: number }).n,
      toolCalls: ((await db.prepare("SELECT COUNT(*) as n FROM mcp_tool_call_events").get()) as { n: number }).n,
    };

    await runDbTransaction(async () => {
      await db.prepare("DELETE FROM mcp_tool_call_events").run();
      await db.prepare("DELETE FROM ccugpt_requests").run();
      await db.prepare("DELETE FROM ccugpt_messages").run();
      await db.prepare("DELETE FROM ccugpt_conversations").run();
    });

    return { ok: true, deleted: before };
  }));

  app.delete("/api/admin/records/content-drafts", (_req, res) => void adminJson(res, async () => {
    const before = {
      drafts: ((await db.prepare("SELECT COUNT(*) as n FROM content_drafts").get()) as { n: number }).n,
    };

    await db.prepare("DELETE FROM content_drafts").run();

    return { ok: true, deleted: before };
  }));

  app.delete("/api/admin/records/all-usage", (_req, res) => void adminJson(res, async () => {
    const before = {
      sessions: ((await db.prepare("SELECT COUNT(*) as n FROM sessions").get()) as { n: number }).n,
      searchEvents: ((await db.prepare("SELECT COUNT(*) as n FROM search_events").get()) as { n: number }).n,
      searchClicks: ((await db.prepare("SELECT COUNT(*) as n FROM search_click_events").get()) as { n: number }).n,
      conversations: ((await db.prepare("SELECT COUNT(*) as n FROM ccugpt_conversations").get()) as { n: number }).n,
      messages: ((await db.prepare("SELECT COUNT(*) as n FROM ccugpt_messages").get()) as { n: number }).n,
      requests: ((await db.prepare("SELECT COUNT(*) as n FROM ccugpt_requests").get()) as { n: number }).n,
      toolCalls: ((await db.prepare("SELECT COUNT(*) as n FROM mcp_tool_call_events").get()) as { n: number }).n,
      feedback: ((await db.prepare("SELECT COUNT(*) as n FROM feedback_events").get()) as { n: number }).n,
    };

    await runDbTransaction(async () => {
      await db.prepare("DELETE FROM mcp_tool_call_events").run();
      await db.prepare("DELETE FROM ccugpt_requests").run();
      await db.prepare("DELETE FROM ccugpt_messages").run();
      await db.prepare("DELETE FROM ccugpt_conversations").run();
      await db.prepare("DELETE FROM search_click_events").run();
      await db.prepare("DELETE FROM search_events").run();
      await db.prepare("DELETE FROM feedback_events").run();
      await db.prepare("DELETE FROM sessions").run();
    });

    return { ok: true, deleted: before };
  }));

  app.post("/api/admin/maintenance/compact", (_req, res) => void adminJson(res, async () => {
    if (db.dialect === "sqlite") {
      await db.exec("PRAGMA wal_checkpoint(TRUNCATE)");
    }
    await db.exec("VACUUM");
    return { ok: true };
  }));

  app.get("/api/admin/content-items", (req, res) => void adminJson(res, async () => {
    const query = readString(req.query.query) ?? "";
    return await searchContentItems(query);
  }));

  app.get("/api/admin/content-items/:type/:id", (req, res) => void adminJson(res, async () => {
    const type = req.params.type as ContentType;
    if (!contentTypes.includes(type)) {
      res.status(400);
      return { error: "Invalid content type" };
    }

    const item = await findContentItem(type, req.params.id);
    if (!item) {
      res.status(404);
      return { error: "Content item not found" };
    }

    return item;
  }));

  app.delete("/api/admin/content-items/:type/:id", (req, res) => void adminJson(res, async () => {
    const type = req.params.type as ContentType;
    if (!contentTypes.includes(type)) {
      res.status(400);
      return { error: "Invalid content type" };
    }

    const item = await findContentItem(type, req.params.id);
    if (!item) {
      res.status(404);
      return { error: "Content item not found" };
    }

    await runDbTransaction(async () => {
      await db.prepare(
        [
          "INSERT INTO content_items",
          "(content_type, item_id, item_label, data_json, status)",
          "VALUES (?, ?, ?, ?, 'deleted')",
          "ON CONFLICT(content_type, item_id) DO UPDATE SET",
          "item_label = excluded.item_label,",
          "data_json = excluded.data_json,",
          "status = 'deleted',",
          "updated_at = CURRENT_TIMESTAMP",
        ].join(" ")
      ).run(type, item.id, item.label, JSON.stringify(item.data));

      await db.prepare(
        [
          "INSERT INTO content_drafts",
          "(content_type, item_id, item_label, before_json, after_json, status, note)",
          "VALUES (?, ?, ?, ?, ?, 'deleted', ?)",
        ].join(" ")
      ).run(
        type,
        item.id,
        item.label,
        JSON.stringify(item.data),
        JSON.stringify({}),
        "Deleted from admin content maintenance"
      );
    });

    return { ok: true };
  }));

  app.get("/api/admin/content-drafts", (_req, res) => void adminJson(res, async () => {
    return await db.prepare(
      [
        "SELECT id, created_at, updated_at, content_type, item_id, item_label, before_json, after_json, status, note",
        "FROM content_drafts ORDER BY created_at DESC LIMIT 100",
      ].join(" ")
    ).all();
  }));

  app.post("/api/admin/content-drafts", express.json({ limit: "2mb" }), (req, res) => void adminJson(res, async () => {
    const body = req.body as Record<string, unknown>;
    const type = readString(body.content_type) as ContentType | null;
    const itemId = readString(body.item_id);
    const note = readString(body.note);
    const isNew = body.is_new === true;

    if (!type || !contentTypes.includes(type) || !itemId) {
      res.status(400);
      return { error: "content_type and item_id are required" };
    }

    const after = body.after_data;
    if (!after || typeof after !== "object") {
      res.status(400);
      return { error: "after_data is required" };
    }

    const afterData = { ...(after as Record<string, unknown>), id: itemId };
    const original = await findContentItem(type, itemId);

    if (isNew && original) {
      res.status(409);
      return { error: "Content item id already exists" };
    }

    if (!isNew && !original) {
      res.status(404);
      return { error: "Content item not found" };
    }

    const updatedLabel = contentLabel(type, afterData);

    await runDbTransaction(async () => {
      await db.prepare(
        [
          "INSERT INTO content_items",
          "(content_type, item_id, item_label, data_json, status)",
          "VALUES (?, ?, ?, ?, 'active')",
          "ON CONFLICT(content_type, item_id) DO UPDATE SET",
          "item_label = excluded.item_label,",
          "data_json = excluded.data_json,",
          "status = 'active',",
          "updated_at = CURRENT_TIMESTAMP",
        ].join(" ")
      ).run(type, itemId, updatedLabel, JSON.stringify(afterData));

      await db.prepare(
        [
          "INSERT INTO content_drafts",
          "(content_type, item_id, item_label, before_json, after_json, status, note)",
          "VALUES (?, ?, ?, ?, ?, 'applied', ?)",
        ].join(" ")
      ).run(
        type,
        itemId,
        updatedLabel,
        JSON.stringify(original?.data ?? {}),
        JSON.stringify(afterData),
        note
      );
    });

    return { ok: true };
  }));

  // ── Static / SPA ─────────────────────────────────────────────────────────────
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  // Keep Render from sleeping
  const SELF_URL = process.env.RENDER_EXTERNAL_URL || "https://ccu-intl-guide.onrender.com";
  setInterval(async () => {
    try {
      await fetch(`${SELF_URL}/mcp`, { method: "GET" });
    } catch {}
  }, 13 * 60 * 1000);

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`MCP endpoint: http://localhost:${port}/mcp`);
  });
}

startServer().catch(console.error);
