import express from "express";
import { createHmac, createHash, timingSafeEqual } from "crypto";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { departments, offices, serviceCategories, tasks, type ServiceCategory } from "../shared/campusData.js";
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
  type CampusSearchData,
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

type ContentType = "office" | "department" | "task" | "student_guide_section" | "service_category";
const contentTypes: ContentType[] = ["office", "department", "task", "student_guide_section", "service_category"];

function getContentCollection(type: ContentType) {
  if (type === "office") return offices;
  if (type === "department") return departments;
  if (type === "student_guide_section") return flattenStudentGuideSections().map((item) => item.data);
  if (type === "service_category") return serviceCategories;
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
    ["service_category", serviceCategories as unknown as Array<Record<string, unknown>>],
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

async function getMergedCampusContentData(): Promise<CampusSearchData> {
  const items = await getActiveContentItems();
  return {
    serviceCategories: items.filter((item) => item.type === "service_category").map((item) => item.data) as unknown as typeof serviceCategories,
    offices: items.filter((item) => item.type === "office").map((item) => item.data) as unknown as typeof offices,
    departments: items.filter((item) => item.type === "department").map((item) => item.data) as unknown as typeof departments,
    tasks: items.filter((item) => item.type === "task").map((item) => item.data) as unknown as typeof tasks,
  };
}

async function previewStaticContentItemsToDatabase() {
  const staticItems = staticContentItems();
  const changedByAdmin = await getManuallyChangedContentKeys();
  const result = {
    would_insert: 0,
    would_update: 0,
    unchanged: 0,
    skipped_manual: 0,
  };

  for (const item of staticItems) {
    const key = `${item.type}:${item.id}`;
    const current = await db.prepare(
      [
        "SELECT data_json, item_label, status",
        "FROM content_items",
        "WHERE content_type = ? AND item_id = ?",
        "LIMIT 1",
      ].join(" ")
    ).get<{ data_json: string; item_label: string; status: string }>(item.type, item.id);

    if (!current) {
      result.would_insert += 1;
      continue;
    }

    if (changedByAdmin.has(key)) {
      result.skipped_manual += 1;
      continue;
    }

    const nextJson = JSON.stringify(item.data);
    if (current.data_json === nextJson && current.item_label === item.label && current.status === "active") {
      result.unchanged += 1;
      continue;
    }

    result.would_update += 1;
  }

  return result;
}

function staticStudentGuideContentItems() {
  return staticContentItems().filter((item) => item.type === "student_guide_section");
}

const RESET_STUDENT_GUIDE_TO_STATIC_NOTE = "Reset student guide section to static data";

type ContentDraftMarker = {
  content_type: ContentType;
  item_id: string;
  status: string;
  note: string | null;
};

function isStaticResetDraft(row: Pick<ContentDraftMarker, "status" | "note">) {
  return row.status === "applied" && row.note === RESET_STUDENT_GUIDE_TO_STATIC_NOTE;
}

async function getManuallyChangedContentKeys(type?: ContentType) {
  const rows = type
    ? await db.prepare(
        [
          "SELECT content_type, item_id, status, note",
          "FROM content_drafts",
          "WHERE content_type = ?",
          "ORDER BY content_type, item_id, created_at, id",
        ].join(" ")
      ).all<ContentDraftMarker>(type)
    : await db.prepare(
        [
          "SELECT content_type, item_id, status, note",
          "FROM content_drafts",
          "ORDER BY content_type, item_id, created_at, id",
        ].join(" ")
      ).all<ContentDraftMarker>();

  const latestByItem = new Map<string, ContentDraftMarker>();
  for (const row of rows) {
    latestByItem.set(`${row.content_type}:${row.item_id}`, row);
  }

  return new Set(
    Array.from(latestByItem.entries())
      .filter(([, row]) => !isStaticResetDraft(row))
      .map(([key]) => key)
  );
}

async function getManuallyChangedStudentGuideSectionIds() {
  const keys = await getManuallyChangedContentKeys("student_guide_section");
  return new Set(Array.from(keys).map((key) => key.replace(/^student_guide_section:/, "")));
}

async function syncStaticStudentGuideSectionsToDatabase() {
  const staticItems = staticStudentGuideContentItems();
  const manuallyChangedIds = await getManuallyChangedStudentGuideSectionIds();
  const result = {
    inserted: 0,
    updated: 0,
    unchanged: 0,
    skipped_manual: 0,
  };

  for (const item of staticItems) {
    const current = await db.prepare(
      [
        "SELECT data_json, item_label, status",
        "FROM content_items",
        "WHERE content_type = 'student_guide_section' AND item_id = ?",
        "LIMIT 1",
      ].join(" ")
    ).get<{ data_json: string; item_label: string; status: string }>(item.id);

    if (!current) {
      await db.prepare(
        [
          "INSERT INTO content_items",
          "(content_type, item_id, item_label, data_json, status)",
          "VALUES ('student_guide_section', ?, ?, ?, 'active')",
        ].join(" ")
      ).run(item.id, item.label, JSON.stringify(item.data));
      result.inserted += 1;
      continue;
    }

    if (manuallyChangedIds.has(item.id)) {
      result.skipped_manual += 1;
      continue;
    }

    const nextJson = JSON.stringify(item.data);
    if (current.data_json === nextJson && current.item_label === item.label && current.status === "active") {
      result.unchanged += 1;
      continue;
    }

    await db.prepare(
      [
        "UPDATE content_items",
        "SET item_label = ?, data_json = ?, status = 'active', updated_at = CURRENT_TIMESTAMP",
        "WHERE content_type = 'student_guide_section' AND item_id = ?",
      ].join(" ")
    ).run(item.label, nextJson, item.id);
    result.updated += 1;
  }

  return result;
}

async function getStudentGuideSyncStatus() {
  const staticItems = staticStudentGuideContentItems();
  const manuallyChangedIds = await getManuallyChangedStudentGuideSectionIds();
  const rows = await db.prepare(
    [
      "SELECT item_id, data_json, status",
      "FROM content_items",
      "WHERE content_type = 'student_guide_section'",
      "ORDER BY item_id",
    ].join(" ")
  ).all<{ item_id: string; data_json: string; status: string }>();
  const dbItems = new Map(rows.map((row) => [row.item_id, row]));

  const staleIds: string[] = [];
  const missingIds: string[] = [];
  const manuallyChangedStaticIds: string[] = [];

  for (const item of staticItems) {
    const row = dbItems.get(item.id);
    if (manuallyChangedIds.has(item.id)) {
      manuallyChangedStaticIds.push(item.id);
      continue;
    }
    if (!row) {
      missingIds.push(item.id);
      continue;
    }
    if (row.status !== "active" || row.data_json !== JSON.stringify(item.data)) {
      staleIds.push(item.id);
    }
  }

  return {
    static_count: staticItems.length,
    db_count: rows.length,
    stale_count: staleIds.length,
    missing_count: missingIds.length,
    manually_changed_count: manuallyChangedStaticIds.length,
    sample_stale_ids: staleIds.slice(0, 20),
    sample_missing_ids: missingIds.slice(0, 20),
    sample_manually_changed_ids: manuallyChangedStaticIds.slice(0, 20),
  };
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

async function searchContentItems(query: string, typeFilter: "all" | ContentType = "all") {
  const q = normalizeQuery(query);
  const items = await getActiveContentItems();

  return items
      .filter((item) => {
        if (typeFilter !== "all" && item.type !== typeFilter) return false;
        if (!q) return true;
        return normalizeQuery([
          item.id,
          item.label,
          item.type,
          JSON.stringify(item.data),
        ].join(" ")).includes(q);
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

type StoredContentItemRow = {
  item_label: string;
  data_json: string;
  status: string;
};

async function getStoredContentItemRow(type: ContentType, id: string) {
  return await db.prepare(
    [
      "SELECT item_label, data_json, status",
      "FROM content_items",
      "WHERE content_type = ? AND item_id = ?",
      "LIMIT 1",
    ].join(" ")
  ).get<StoredContentItemRow>(type, id);
}

function contentStateFingerprint(row: Pick<StoredContentItemRow, "status" | "data_json"> | null) {
  const status = row?.status ?? "missing";
  const dataJson = row?.data_json ?? "";
  return createHash("sha256").update(`${status}\n${dataJson}`).digest("hex");
}

function readArray(value: unknown): unknown[] | null {
  return Array.isArray(value) ? value : null;
}

function requireStringField(data: Record<string, unknown>, key: string, errors: string[]) {
  if (typeof data[key] !== "string") errors.push(`${key} must be a string`);
}

function requireStringArrayField(data: Record<string, unknown>, key: string, errors: string[]) {
  const value = data[key];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    errors.push(`${key} must be a string array`);
  }
}

function validateOptionalStringArrayField(data: Record<string, unknown>, key: string, errors: string[]) {
  if (data[key] === undefined) return;
  requireStringArrayField(data, key, errors);
}

function validateOptionalArrayField(data: Record<string, unknown>, key: string, errors: string[]) {
  if (data[key] === undefined) return;
  if (!Array.isArray(data[key])) errors.push(`${key} must be an array`);
}

function requireArrayField(data: Record<string, unknown>, key: string, errors: string[]) {
  if (!Array.isArray(data[key])) errors.push(`${key} must be an array`);
}

function requireObjectArrayField(data: Record<string, unknown>, key: string, errors: string[]) {
  const value = data[key];
  if (!Array.isArray(value) || value.some((item) => !item || typeof item !== "object" || Array.isArray(item))) {
    errors.push(`${key} must be an array of objects`);
  }
}

function requireNumberField(data: Record<string, unknown>, key: string, errors: string[]) {
  if (typeof data[key] !== "number" || !Number.isFinite(data[key])) errors.push(`${key} must be a number`);
}

function requireBooleanField(data: Record<string, unknown>, key: string, errors: string[]) {
  if (typeof data[key] !== "boolean") errors.push(`${key} must be a boolean`);
}

function validateOptionalBooleanField(data: Record<string, unknown>, key: string, errors: string[]) {
  if (data[key] === undefined) return;
  requireBooleanField(data, key, errors);
}

function validateOptionalStringField(data: Record<string, unknown>, key: string, errors: string[]) {
  if (data[key] === undefined) return;
  requireStringField(data, key, errors);
}

function requireLiteralField(data: Record<string, unknown>, key: string, expected: string, errors: string[]) {
  if (data[key] !== expected) errors.push(`${key} must be ${expected}`);
}

function requireOneOfField(data: Record<string, unknown>, key: string, values: string[], errors: string[]) {
  if (typeof data[key] !== "string" || !values.includes(data[key])) {
    errors.push(`${key} must be ${values.join(" or ")}`);
  }
}

function validateContentData(type: ContentType, itemId: string, value: unknown, mode: "single" | "import" = "single") {
  const errors: string[] = [];
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false as const, errors: ["after_data must be an object"] };
  }

  const data = value as Record<string, unknown>;
  requireStringField(data, "id", errors);
  if (typeof data.id === "string" && data.id !== itemId) errors.push("after_data.id must match item_id");

  if (type === "service_category") {
    for (const key of ["name_zh", "name_en", "icon", "description_zh", "description_en"]) {
      requireStringField(data, key, errors);
    }
    requireStringArrayField(data, "keywords", errors);
  } else if (mode === "import") {
    if (type === "student_guide_section") {
      for (const key of ["title_en", "title_zh", "categoryId", "summary_en", "summary_zh"]) {
        requireStringField(data, key, errors);
      }
      requireStringArrayField(data, "tags_en", errors);
      requireStringArrayField(data, "tags_zh", errors);
      requireArrayField(data, "sourceReferences", errors);
      requireArrayField(data, "blocks", errors);
      validateOptionalStringArrayField(data, "relatedTaskIds", errors);
      if (data.order_index !== undefined) requireNumberField(data, "order_index", errors);
      if (data.guide_id !== undefined) requireOneOfField(data, "guide_id", ["degree", "exchange"], errors);
    } else if (type === "task") {
      for (const key of ["category_id", "task_name_en", "task_name_zh", "scenario_en", "scenario_zh", "target_unit_id"]) {
        requireStringField(data, key, errors);
      }
      requireStringArrayField(data, "required_documents_en", errors);
      requireStringArrayField(data, "required_documents_zh", errors);
      requireObjectArrayField(data, "steps", errors);
      requireOneOfField(data, "target_unit_type", ["office", "department"], errors);
    } else if (type === "office") {
      for (const key of [
        "name_zh",
        "name_en",
        "building_name_zh",
        "building_name_en",
        "floor",
        "indoor_location_note_zh",
        "indoor_location_note_en",
        "function_desc_zh",
        "function_desc_en",
        "service_scope_zh",
        "service_scope_en",
        "common_scenarios_zh",
        "common_scenarios_en",
        "office_hours",
        "phone",
        "email",
        "official_url",
        "google_maps_query",
        "source_url",
      ]) {
        requireStringField(data, key, errors);
      }
      requireLiteralField(data, "category", "office", errors);
      requireStringArrayField(data, "service_categories", errors);
      requireNumberField(data, "latitude", errors);
      requireNumberField(data, "longitude", errors);
      requireBooleanField(data, "needs_manual_review", errors);
      validateOptionalStringField(data, "room_zh", errors);
      validateOptionalStringField(data, "room_en", errors);
      validateOptionalStringField(data, "floor_plan_image", errors);
      validateOptionalStringField(data, "entrance_image", errors);
      validateOptionalStringField(data, "building_entrance_image", errors);
      validateOptionalBooleanField(data, "use_manual_coordinates", errors);
    } else if (type === "department") {
      for (const key of [
        "name_zh",
        "name_en",
        "college_zh",
        "college_en",
        "building_name_zh",
        "building_name_en",
        "floor",
        "indoor_location_note_zh",
        "indoor_location_note_en",
        "function_desc_zh",
        "function_desc_en",
        "service_scope_zh",
        "service_scope_en",
        "official_url",
        "google_maps_query",
        "source_url",
      ]) {
        requireStringField(data, key, errors);
      }
      requireLiteralField(data, "category", "department", errors);
      requireStringArrayField(data, "service_categories", errors);
      requireNumberField(data, "latitude", errors);
      requireNumberField(data, "longitude", errors);
      requireBooleanField(data, "needs_manual_review", errors);
      validateOptionalStringField(data, "room_zh", errors);
      validateOptionalStringField(data, "room_en", errors);
      validateOptionalStringField(data, "floor_plan_image", errors);
      validateOptionalStringField(data, "entrance_image", errors);
      validateOptionalStringField(data, "building_entrance_image", errors);
      validateOptionalBooleanField(data, "use_manual_coordinates", errors);
      validateOptionalBooleanField(data, "is_college_office", errors);
    } else {
      validateOptionalStringArrayField(data, "service_categories", errors);
      if (data.latitude !== undefined) requireNumberField(data, "latitude", errors);
      if (data.longitude !== undefined) requireNumberField(data, "longitude", errors);
      if (data.needs_manual_review !== undefined) requireBooleanField(data, "needs_manual_review", errors);
      if (type === "office" && data.category !== undefined && data.category !== "office") errors.push("category must be office");
      if (type === "department" && data.category !== undefined && data.category !== "department") errors.push("category must be department");
    }
  }

  return errors.length > 0
    ? { ok: false as const, errors }
    : { ok: true as const, data };
}

type ContentImportItem = {
  content_type: ContentType;
  item_id: string;
  action: "create" | "update";
  after_data: Record<string, unknown>;
  reason?: string;
};

type ValidatedImportPackage = {
  package_id: string;
  change_note: string | null;
  items: ContentImportItem[];
};

type ImportExpectedBefore = {
  content_type: ContentType;
  item_id: string;
  expected_before_fingerprint: string;
};

const adminBackupTables = [
  "content_items",
  "content_drafts",
  "sessions",
  "search_events",
  "search_click_events",
  "ccugpt_conversations",
  "ccugpt_messages",
  "ccugpt_requests",
  "mcp_tool_call_events",
  "feedback_events",
] as const;

function stableJsonStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJsonStringify).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, entry]) => entry !== undefined)
      .sort(([a], [b]) => a.localeCompare(b));
    return `{${entries.map(([key, entry]) => `${JSON.stringify(key)}:${stableJsonStringify(entry)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function packageFingerprint(value: unknown) {
  return createHash("sha256").update(stableJsonStringify(value)).digest("hex");
}

function parseContentImportPackage(value: unknown) {
  const errors: string[] = [];
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false as const, errors: ["Package must be a JSON object"] };
  }

  const input = value as Record<string, unknown>;
  const packageId = readString(input.package_id);
  if (!packageId) errors.push("package_id is required");
  if (!Array.isArray(input.items)) errors.push("items must be an array");

  const items: ContentImportItem[] = [];
  const seenItemKeys = new Set<string>();
  if (Array.isArray(input.items)) {
    input.items.forEach((rawItem, index) => {
      if (!rawItem || typeof rawItem !== "object" || Array.isArray(rawItem)) {
        errors.push(`items[${index}] must be an object`);
        return;
      }

      const item = rawItem as Record<string, unknown>;
      const type = readString(item.content_type) as ContentType | null;
      const itemId = readString(item.item_id);
      const action = readString(item.action);
      if (!type || !contentTypes.includes(type)) errors.push(`items[${index}].content_type is unsupported`);
      if (!itemId) errors.push(`items[${index}].item_id is required`);
      if (action !== "create" && action !== "update") {
        errors.push(`items[${index}].action must be create or update; delete is not supported`);
      }
      if (!type || !contentTypes.includes(type) || !itemId || (action !== "create" && action !== "update")) return;

      const itemKey = `${type}:${itemId}`;
      if (seenItemKeys.has(itemKey)) {
        errors.push(`items[${index}] duplicates content package item key ${itemKey}`);
        return;
      }
      seenItemKeys.add(itemKey);

      const validation = validateContentData(type, itemId, item.after_data, "import");
      if (!validation.ok) {
        validation.errors.forEach((error) => errors.push(`items[${index}].${error}`));
        return;
      }

      items.push({
        content_type: type,
        item_id: itemId,
        action,
        after_data: validation.data,
        reason: readString(item.reason) ?? undefined,
      });
    });
  }

  return errors.length > 0 || !packageId
    ? { ok: false as const, errors }
    : { ok: true as const, package: { package_id: packageId, change_note: readString(input.change_note), items } };
}

async function previewContentImportPackage(value: unknown) {
  const parsed = parseContentImportPackage(value);
  if (!parsed.ok) return parsed;

  const errors: string[] = [];
  const changes: Array<{
    content_type: ContentType;
    item_id: string;
    action: "create" | "update";
    item_label: string;
    reason?: string;
    changed_fields: string[];
    before_data: Record<string, unknown> | null;
    after_data: Record<string, unknown>;
    expected_before_fingerprint: string;
  }> = [];
  const skipped_unchanged: Array<{ content_type: ContentType; item_id: string; item_label: string; expected_before_fingerprint: string }> = [];

  for (const item of parsed.package.items) {
    const current = await getStoredContentItemRow(item.content_type, item.item_id);
    const expectedBeforeFingerprint = contentStateFingerprint(current ?? null);
    if (current?.status === "deleted") {
      errors.push(`${item.content_type}:${item.item_id} is deleted; restore it separately before importing`);
      continue;
    }
    if (item.action === "update" && current?.status !== "active") {
      errors.push(`${item.content_type}:${item.item_id} update target is missing`);
      continue;
    }
    if (item.action === "create" && current?.status === "active") {
      errors.push(`${item.content_type}:${item.item_id} create target already exists`);
      continue;
    }

    let original: Record<string, unknown> | null = null;
    if (current?.status === "active") {
      original = parseJsonObject(current.data_json);
      if (!original) {
        errors.push(`${item.content_type}:${item.item_id} current data_json is invalid`);
        continue;
      }
    }

    const itemLabel = contentLabel(item.content_type, item.after_data);
    const changedFields = original ? diffObjectFields(original, item.after_data) : Object.keys(item.after_data);

    if (original && changedFields.length === 0) {
      skipped_unchanged.push({
        content_type: item.content_type,
        item_id: item.item_id,
        item_label: itemLabel,
        expected_before_fingerprint: expectedBeforeFingerprint,
      });
      continue;
    }

    changes.push({
      content_type: item.content_type,
      item_id: item.item_id,
      action: item.action,
      item_label: itemLabel,
      reason: item.reason,
      changed_fields: changedFields,
      before_data: original,
      after_data: item.after_data,
      expected_before_fingerprint: expectedBeforeFingerprint,
    });
  }

  if (errors.length > 0) return { ok: false as const, errors };

  return {
    ok: true as const,
    package_id: parsed.package.package_id,
    package_fingerprint: packageFingerprint(value),
    change_note: parsed.package.change_note,
    changes,
    skipped_unchanged,
    summary: {
      changes: changes.length,
      skipped_unchanged: skipped_unchanged.length,
    },
    package: parsed.package,
  };
}

function diffObjectFields(before: Record<string, unknown>, after: Record<string, unknown>) {
  return Object.keys({ ...before, ...after }).filter((key) => JSON.stringify(before[key]) !== JSON.stringify(after[key]));
}

type ServiceCategoryReference = {
  content_type: ContentType;
  item_id: string;
  field: string;
  label: string;
};

async function findServiceCategoryReferences(categoryId: string) {
  const items = await getActiveContentItems();
  return items.flatMap<ServiceCategoryReference>((item) => {
    if (item.type === "task" && (item.data as { category_id?: unknown }).category_id === categoryId) {
      return [{ content_type: item.type, item_id: item.id, field: "category_id", label: item.label }];
    }
    if ((item.type === "office" || item.type === "department") && Array.isArray((item.data as { service_categories?: unknown }).service_categories)) {
      const categories = (item.data as { service_categories: unknown[] }).service_categories;
      if (categories.includes(categoryId)) {
        return [{ content_type: item.type, item_id: item.id, field: "service_categories", label: item.label }];
      }
    }
    return [];
  });
}

function readExpectedBeforeFingerprints(value: unknown): Map<string, string> | null {
  if (!Array.isArray(value)) return null;
  const result = new Map<string, string>();
  for (const entry of value) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
    const record = entry as Record<string, unknown>;
    const type = readString(record.content_type) as ContentType | null;
    const itemId = readString(record.item_id);
    const fingerprint = readString(record.expected_before_fingerprint);
    if (!type || !contentTypes.includes(type) || !itemId || !fingerprint) return null;
    result.set(`${type}:${itemId}`, fingerprint);
  }
  return result;
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function normalizeQuery(query: string) {
  return query.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
}

class ContentImportConflictError extends Error {
  constructor(readonly conflicts: string[]) {
    super("Content import conflict");
  }
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
    if (err instanceof ContentImportConflictError) {
      res.status(409).json({ error: err.message, conflicts: err.conflicts });
      return;
    }
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

function guideSectionText(section: StudentGuideSection) {
  return normalizeQuery(JSON.stringify(section));
}

function formatStudentGuideSection(guide: StudentGuide, section: StudentGuideSection, language: McpLanguage = "auto") {
  return {
    type: "student_guide_section",
    guide_id: guide.id,
    guide_title_en: guide.title_en,
    guide_title_zh: guide.title_zh,
    id: section.id,
    title_en: section.title_en,
    title_zh: section.title_zh,
    category_id: section.categoryId,
    tags_en: section.tags_en,
    tags_zh: section.tags_zh,
    summary_en: section.summary_en,
    summary_zh: section.summary_zh,
    source_references: section.sourceReferences ?? [],
    related_task_ids: section.relatedTaskIds ?? [],
    blocks: section.blocks,
    suggested_answer_language: language,
  };
}

async function searchStudentGuideSections(query: string, language: McpLanguage = "auto") {
  const q = normalizeQuery(query);
  const guides = await getStudentGuidesFromContentItems();
  const results = guides.flatMap((guide) =>
    guide.sections
      .map((section) => {
        const titleText = normalizeQuery(`${section.title_en} ${section.title_zh}`);
        const summaryText = normalizeQuery(`${section.summary_en} ${section.summary_zh}`);
        const tagText = normalizeQuery([...section.tags_en, ...section.tags_zh].join(" "));
        const fullText = guideSectionText(section);
        const score =
          titleText.includes(q) ? 90 :
          tagText.includes(q) ? 75 :
          summaryText.includes(q) ? 65 :
          fullText.includes(q) ? 45 :
          0;

        return {
          guide,
          section,
          score,
        };
      })
      .filter((result) => !q || result.score > 0)
  )
    .sort((a, b) => b.score - a.score)
    .slice(0, q ? 10 : 12);

  return {
    query,
    language,
    total: results.length,
    sections: results.map((result) => ({
      score: result.score,
      ...formatStudentGuideSection(result.guide, result.section, language),
    })),
  };
}

async function resolveStudentGuideSection(sectionIdOrQuery: string, language: McpLanguage = "auto") {
  const guides = await getStudentGuidesFromContentItems();
  const q = normalizeQuery(sectionIdOrQuery);
  for (const guide of guides) {
    const section = guide.sections.find((item) => item.id === sectionIdOrQuery || normalizeQuery(item.id) === q);
    if (section) return formatStudentGuideSection(guide, section, language);
  }

  const search = await searchStudentGuideSections(sectionIdOrQuery, language);
  return search.sections[0] ?? null;
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
    async ({ query, language }) => {
      const data = await getMergedCampusContentData();
      return textResponse(searchCampusServices(query, (language ?? "auto") as McpLanguage, data));
    }
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
      const data = await getMergedCampusContentData();
      const result = resolveOffice(lookup, data);
      return textResponse(result ? formatOfficeResult(result, (language ?? "auto") as McpLanguage) : makeNotFoundPayload(lookup, "office", data));
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
      const data = await getMergedCampusContentData();
      const result = resolveDepartment(lookup, data);
      return textResponse(result ? formatDepartmentResult(result, (language ?? "auto") as McpLanguage) : makeNotFoundPayload(lookup, "department", data));
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
      const data = await getMergedCampusContentData();
      const result = resolveTask(lookup, data);
      return textResponse(result ? formatTaskResult(result, (language ?? "auto") as McpLanguage, data) : makeNotFoundPayload(lookup, "task", data));
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
      const data = await getMergedCampusContentData();
      const result = searchCampusServices(query, (language ?? "auto") as McpLanguage, data);
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
      const data = await getMergedCampusContentData();
      const result = searchCampusServices(query, (language ?? "auto") as McpLanguage, data);
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
    "search_student_guides",
    [
      "Search New Student Guide sections for degree-seeking students, exchange students, arrival, registration, visa, ARC, housing, health check, course selection, safety, and handbook content.",
      "Use this when the user asks about new student handbook content or guide sections, not only administrative tasks.",
      "Returns ranked guide sections from the same Neon-backed content source used by the website.",
    ].join(" "),
    {
      query: z.string().describe("Natural language question or keyword, e.g. arrival checklist, exchange course selection, ARC for new students."),
      language: languageSchema,
    },
    async ({ query, language }) => textResponse(await searchStudentGuideSections(query, (language ?? "auto") as McpLanguage))
  );

  server.tool(
    "get_student_guide_section",
    [
      "Get one New Student Guide section by id or keyword.",
      "Use this when the user needs the detailed blocks in a degree-seeking or exchange student guide section.",
    ].join(" "),
    {
      section_id: z.string().optional().describe("Optional section id, e.g. degree_arc_application_extension or exchange_course_selection."),
      query: z.string().optional().describe("Section title, keyword, or natural language question."),
      language: languageSchema,
    },
    async ({ section_id, query, language }) => {
      const lookup = firstNonEmpty(query, section_id);
      if (!lookup) return textResponse({ status: "missing_input", message: "Provide a student guide section id, title, or keyword." });
      const result = await resolveStudentGuideSection(lookup, (language ?? "auto") as McpLanguage);
      return textResponse(result ?? { status: "not_found", type: "student_guide_section", query: lookup });
    }
  );

  server.tool(
    "list_service_categories",
    "List available CCU service categories. Use only when the user wants to browse broad categories.",
    {
      language: languageSchema,
    },
    async ({ language }) => {
      const data = await getMergedCampusContentData();
      return textResponse({
        language: language ?? "auto",
        categories: data.serviceCategories.map((category) => ({
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
    const contentData = await getMergedCampusContentData();
    return {
      serviceCategories: contentData.serviceCategories,
      offices: contentData.offices,
      departments: contentData.departments,
      tasks: contentData.tasks,
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

  app.get("/api/admin/records-backup-export", (_req, res) => void adminJson(res, async () => {
    const exportedAt = new Date().toISOString();
    const tableCounts: Record<string, number> = {};
    const tables: Record<string, unknown[]> = {};

    for (const table of adminBackupTables) {
      const rows = await db.prepare(`SELECT * FROM ${table}`).all<Record<string, unknown>>();
      tables[table] = rows;
      tableCounts[table] = rows.length;
    }

    res.setHeader("Content-Disposition", `attachment; filename="ccu-intl-guide-full-backup-${exportedAt.replace(/[:.]/g, "-")}.json"`);
    return {
      format_version: 1,
      exported_at: exportedAt,
      source: "ccu-intl-guide-admin-full-backup",
      table_counts: tableCounts,
      tables,
    };
  }));

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

  app.delete("/api/admin/records/content-drafts", (req, res) => void adminJson(res, async () => {
    const force = readString(req.query.force) === "true";
    const before = {
      drafts: ((await db.prepare("SELECT COUNT(*) as n FROM content_drafts").get()) as { n: number }).n,
      preservedStudentGuideDrafts: force
        ? 0
        : ((await db.prepare(
            "SELECT COUNT(*) as n FROM content_drafts WHERE content_type = 'student_guide_section'"
          ).get()) as { n: number }).n,
    };

    if (force) {
      await db.prepare("DELETE FROM content_drafts").run();
    } else {
      await db.prepare("DELETE FROM content_drafts WHERE content_type <> 'student_guide_section'").run();
    }

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

  app.post("/api/admin/maintenance/sync-static-content", (_req, res) => void adminJson(res, async () => {
    return {
      ok: true,
      mode: "preview_only",
      message: "Static content sync is preview-only. Use reviewed content import to apply audited changes.",
      result: await previewStaticContentItemsToDatabase(),
    };
  }));

  app.get("/api/admin/student-guide-sync-status", (_req, res) => void adminJson(res, async () => {
    return await getStudentGuideSyncStatus();
  }));

  // ── Duplicate report ────────────────────────────────────────────────────────
  // Scans the *actual* blocks returned by /api/student-guides (DB overrides applied)
  // and reports per-section duplicate blocks, URLs, checklist items, timeline items, and contacts.
  app.get("/api/admin/student-guide-duplicate-report", (_req, res) => void adminJson(res, async () => {
    function normalizeDuplicateText(value: string) {
      return value.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
    }

    function addDuplicateCount(map: Map<string, number>, key: string) {
      const normalizedKey = key.trim();
      if (!normalizedKey || !normalizedKey.replace(/\|/g, "").trim()) return;
      map.set(normalizedKey, (map.get(normalizedKey) ?? 0) + 1);
    }

    function duplicateKeys(map: Map<string, number>) {
      return Array.from(map.entries())
        .filter(([, count]) => count > 1)
        .map(([key]) => key);
    }

    function duplicateCount(map: Map<string, number>) {
      return Array.from(map.values()).reduce((sum, count) => sum + Math.max(0, count - 1), 0);
    }

    function duplicateUrlKey(url: string) {
      return url.trim().replace(/\/$/, "");
    }

    function serverBlockDedupeKey(block: StudentGuideSection["blocks"][number]): string {
      switch (block.type) {
        case "contact":
          return `contact:${block.name_zh || block.name_en}:${block.phone ?? block.email ?? block.location_zh ?? block.location_en ?? ""}`;
        case "links":
          return `links:${[...block.links].map((l: { url: string }) => l.url).sort().join("|")}`;
        case "note":
          return `note:${(block as { tone?: string }).tone ?? ""}:${block.content_zh || block.content_en}`;
        case "paragraph":
          return `paragraph:${block.content_zh || block.content_en}`;
        case "table":
          return `table:${(block as { columns: Array<{ key: string }> }).columns.map((c) => c.key).join(",")}:${JSON.stringify((block as { rows: unknown[] }).rows).slice(0, 300)}`;
        case "checklist":
          return `checklist:${(block as { items: Array<{ zh?: string; en: string }> }).items.map((i) => (i.zh || i.en).toLowerCase().trim()).join("|").slice(0, 500)}`;
        case "timeline":
          return `timeline:${(block as { items: Array<{ date: string; event_zh?: string; event_en: string }> }).items.map((i) => `${i.date}:${(i.event_zh || i.event_en).toLowerCase().trim()}`).join("|").slice(0, 500)}`;
        default:
          return JSON.stringify(block).slice(0, 200);
      }
    }

    const guides = await getStudentGuidesFromContentItems();
    const report: Array<{
      section_id: string;
      guide_id: string;
      duplicate_block_keys: string[];
      duplicate_urls: string[];
      duplicate_checklist_items: string[];
      duplicate_timeline_items: string[];
      duplicate_contacts: string[];
      duplicate_count: number;
    }> = [];

    for (const guide of guides) {
      for (const section of guide.sections) {
        const blockKeys = new Map<string, number>();
        const urls = new Map<string, number>();
        const checklistItems = new Map<string, number>();
        const timelineItems = new Map<string, number>();
        const contacts = new Map<string, number>();

        for (const block of section.blocks) {
          addDuplicateCount(blockKeys, serverBlockDedupeKey(block));

          if (block.type === "links") {
            for (const link of block.links) {
              addDuplicateCount(urls, duplicateUrlKey(link.url));
            }
          } else if (block.type === "contact") {
            addDuplicateCount(
              contacts,
              [
                normalizeDuplicateText(block.name_en ?? ""),
                normalizeDuplicateText(block.name_zh ?? ""),
                normalizeDuplicateText(block.email ?? ""),
                normalizeDuplicateText(block.phone ?? ""),
              ].join("|"),
            );
            for (const link of block.links ?? []) {
              addDuplicateCount(urls, duplicateUrlKey(link.url));
            }
          } else if (block.type === "checklist") {
            for (const item of block.items) {
              addDuplicateCount(
                checklistItems,
                `${normalizeDuplicateText(item.en)}|${normalizeDuplicateText(item.zh)}`,
              );
            }
          } else if (block.type === "timeline") {
            for (const item of block.items) {
              addDuplicateCount(
                timelineItems,
                [
                  normalizeDuplicateText(item.date),
                  normalizeDuplicateText(item.event_en),
                  normalizeDuplicateText(item.event_zh),
                ].join("|"),
              );
            }
          }
        }

        const duplicateBlockKeys = duplicateKeys(blockKeys);
        const duplicateUrls = duplicateKeys(urls);
        const duplicateChecklistItems = duplicateKeys(checklistItems);
        const duplicateTimelineItems = duplicateKeys(timelineItems);
        const duplicateContacts = duplicateKeys(contacts);
        const totalDuplicateCount =
          duplicateCount(blockKeys) +
          duplicateCount(urls) +
          duplicateCount(checklistItems) +
          duplicateCount(timelineItems) +
          duplicateCount(contacts);

        if (totalDuplicateCount > 0) {
          report.push({
            section_id: section.id,
            guide_id: guide.id,
            duplicate_block_keys: duplicateBlockKeys,
            duplicate_urls: duplicateUrls,
            duplicate_checklist_items: duplicateChecklistItems,
            duplicate_timeline_items: duplicateTimelineItems,
            duplicate_contacts: duplicateContacts,
            duplicate_count: totalDuplicateCount,
          });
        }
      }
    }

    return {
      total_sections_checked: guides.reduce((sum, g) => sum + g.sections.length, 0),
      sections_with_duplicates: report.length,
      report,
    };
  }));

  // ── Reset student guide section to static data ──────────────────────────────
  // Reset-to-static is disabled because active DB content is authoritative.
  app.post("/api/admin/student-guide-sections/:id/reset-to-static", (_req, res) => void adminJson(res, async () => {
    res.status(410);
    return {
      ok: false,
      error: "Reset-to-static is disabled. Use Content Package preview/apply for reviewed updates.",
    };
  }));

  app.get("/api/admin/content-items", (req, res) => void adminJson(res, async () => {
    const query = readString(req.query.query) ?? "";
    const requestedType = readString(req.query.type);
    const typeFilter: "all" | ContentType = requestedType && contentTypes.includes(requestedType as ContentType)
      ? requestedType as ContentType
      : "all";
    return await searchContentItems(query, typeFilter);
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

    if (type === "service_category") {
      const references = await findServiceCategoryReferences(req.params.id);
      if (references.length > 0) {
        res.status(409);
        return {
          error: "Service category is still referenced. Reassign those records before deleting it.",
          references: references.slice(0, 20),
          reference_count: references.length,
        };
      }
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

  app.get("/api/admin/content-drafts", (req, res) => void adminJson(res, async () => {
    const q = req.query as Record<string, string>;
    const queryStr = (q.query ?? "").trim();
    const typeFilter = q.type ?? "all";
    const sourceFilter = q.source ?? "all";
    const statusFilter = q.status ?? "all";
    const dateFrom = (q.date_from ?? "").trim();
    const dateTo = (q.date_to ?? "").trim();
    const page = Math.max(1, parseInt(q.page ?? "1", 10) || 1);
    const pageSize = Math.min(100, Math.max(10, parseInt(q.page_size ?? "50", 10) || 50));

    const conditions: string[] = [];
    const params: (string | number | null)[] = [];

    if (queryStr) {
      const needle = `%${queryStr}%`;
      conditions.push("(item_label LIKE ? OR item_id LIKE ? OR content_type LIKE ? OR note LIKE ? OR before_json LIKE ? OR after_json LIKE ?)");
      params.push(needle, needle, needle, needle, needle, needle);
    }

    const allowedTypes = ["task", "student_guide_section", "office", "department", "service_category"];
    if (typeFilter !== "all" && allowedTypes.includes(typeFilter)) {
      conditions.push("content_type = ?");
      params.push(typeFilter);
    }

    if (sourceFilter === "cowork") {
      conditions.push("note LIKE ?");
      params.push("Cowork import:%");
    } else if (sourceFilter === "manual") {
      conditions.push("(status = ? AND (note IS NULL OR note NOT LIKE ?))");
      params.push("applied", "Cowork import:%");
    } else if (sourceFilter === "deleted") {
      conditions.push("status = ?");
      params.push("deleted");
    }

    const allowedStatuses = ["applied", "deleted"];
    if (statusFilter !== "all" && allowedStatuses.includes(statusFilter)) {
      conditions.push("status = ?");
      params.push(statusFilter);
    }

    if (dateFrom) {
      conditions.push("created_at >= ?");
      params.push(dateFrom);
    }
    if (dateTo) {
      const d = new Date(dateTo);
      if (!isNaN(d.getTime())) {
        d.setUTCDate(d.getUTCDate() + 1);
        conditions.push("created_at < ?");
        params.push(d.toISOString().slice(0, 10));
      }
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const selectFields = "SELECT id, created_at, updated_at, content_type, item_id, item_label, before_json, after_json, status, note";

    const countRow = await db
      .prepare(`SELECT COUNT(*) as count FROM content_drafts ${where}`)
      .get<{ count: number }>(...params);
    const total = countRow?.count ?? 0;
    const offset = (page - 1) * pageSize;

    const items = await db
      .prepare(`${selectFields} FROM content_drafts ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
      .all(...params, pageSize, offset);

    return { total, page, page_size: pageSize, items };
  }));

  app.get("/api/admin/content-export", (_req, res) => void adminJson(res, async () => {
    const items = await getActiveContentItems();
    return {
      package_id: `content-export-${new Date().toISOString().replace(/[:.]/g, "-")}`,
      created_at: new Date().toISOString(),
      change_note: "Current active editable published content export.",
      items: contentTypes.flatMap((type) =>
        items
          .filter((item) => item.type === type)
          .map((item) => ({
            content_type: item.type,
            item_id: item.id,
            action: "update",
            after_data: item.data,
            reason: "Exported active content",
          }))
      ),
    };
  }));

  app.post("/api/admin/content-import/preview", express.json({ limit: "10mb" }), (req, res) => void adminJson(res, async () => {
    const preview = await previewContentImportPackage(req.body);
    if (!preview.ok) {
      res.status(400);
      return { error: "Invalid content import package", details: preview.errors };
    }
    const { package: _validatedPackage, ...safePreview } = preview;
    return safePreview;
  }));

  app.post("/api/admin/content-import/apply", express.json({ limit: "10mb" }), (req, res) => void adminJson(res, async () => {
    const body = req.body as Record<string, unknown>;
    if (body.confirm !== true) {
      res.status(400);
      return { error: "Explicit confirmation is required" };
    }

    const parsed = parseContentImportPackage(body.package);
    if (!parsed.ok) {
      res.status(400);
      return { error: "Invalid content import package", details: parsed.errors };
    }

    const previewPackageFingerprint = readString(body.package_fingerprint);
    const currentPackageFingerprint = packageFingerprint(body.package);
    if (!previewPackageFingerprint) {
      res.status(400);
      return { error: "package_fingerprint from preview is required" };
    }
    if (previewPackageFingerprint !== currentPackageFingerprint) {
      res.status(409);
      return { error: "Package changed after preview. Run preview again before applying." };
    }

    const expectedBefore = readExpectedBeforeFingerprints(body.expected_before_fingerprints);
    if (!expectedBefore) {
      res.status(400);
      return { error: "expected_before_fingerprints from preview are required" };
    }

    let applied = 0;
    let skippedUnchanged = 0;

    await runDbTransaction(async () => {
      const changes: Array<{
        item: ContentImportItem;
        original: Record<string, unknown> | null;
        item_label: string;
        next_json: string;
      }> = [];
      const conflicts: string[] = [];

      for (const item of parsed.package.items) {
        const key = `${item.content_type}:${item.item_id}`;
        const current = await getStoredContentItemRow(item.content_type, item.item_id);
        const currentFingerprint = contentStateFingerprint(current ?? null);
        if (current?.status === "deleted") {
          conflicts.push(`${key} is deleted; restore it separately before importing`);
          continue;
        }
        if (item.action === "update" && current?.status !== "active") {
          conflicts.push(`${key} update target is missing`);
          continue;
        }
        if (item.action === "create" && current?.status === "active") {
          conflicts.push(`${key} create target already exists`);
          continue;
        }

        let original: Record<string, unknown> | null = null;
        if (current?.status === "active") {
          original = parseJsonObject(current.data_json);
          if (!original) {
            conflicts.push(`${key} current data_json is invalid`);
            continue;
          }
        }

        const changedFields = original ? diffObjectFields(original, item.after_data) : Object.keys(item.after_data);
        if (original && changedFields.length === 0) {
          skippedUnchanged += 1;
          continue;
        }

        const expected = expectedBefore.get(key);
        if (!expected) {
          conflicts.push(`${key} is missing an expected-before fingerprint`);
          continue;
        }
        if (currentFingerprint !== expected) {
          conflicts.push(`${key} changed after preview; run preview again before applying`);
          continue;
        }

        changes.push({
          item,
          original,
          item_label: contentLabel(item.content_type, item.after_data),
          next_json: JSON.stringify(item.after_data),
        });
      }

      if (conflicts.length > 0) {
        throw new ContentImportConflictError(conflicts);
      }

      for (const change of changes) {
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
        ).run(change.item.content_type, change.item.item_id, change.item_label, change.next_json);

        await db.prepare(
          [
            "INSERT INTO content_drafts",
            "(content_type, item_id, item_label, before_json, after_json, status, note)",
            "VALUES (?, ?, ?, ?, ?, 'applied', ?)",
          ].join(" ")
        ).run(
          change.item.content_type,
          change.item.item_id,
          change.item_label,
          JSON.stringify(change.original ?? {}),
          change.next_json,
          `Cowork import: ${parsed.package.package_id}`
        );
        applied += 1;
      }
    });

    return {
      ok: true,
      package_id: parsed.package.package_id,
      applied,
      skipped_unchanged: skippedUnchanged,
    };
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
    const validation = validateContentData(type, itemId, afterData);
    if (!validation.ok) {
      res.status(400);
      return { error: "Invalid content item", details: validation.errors };
    }
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
