import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { serviceCategories } from "../shared/campusData.js";
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const languageSchema = z.enum(["auto", "en", "zh-TW"]).optional().describe("Preferred answer language. Use auto by default.");

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
  const app = express();
  const server = createServer(app);

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
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

  app.post("/api/chat", express.json(), async (req, res) => {
    try {
      const response = await fetch("https://ccugpt.ccu.edu.tw/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer mcp-demo-2026",
        },
        body: JSON.stringify(req.body),
      });
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (err) {
      console.error("CCU GPT proxy error:", err);
      res.status(502).json({ error: "Failed to reach CCU GPT service" });
    }
  });

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`MCP endpoint: http://localhost:${port}/mcp`);
  });
}

startServer().catch(console.error);
