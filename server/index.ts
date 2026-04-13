import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import {
  serviceCategories,
  offices,
  tasks,
  campusResources,
  searchByNeed,
} from "../shared/campusData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function registerTools(server: McpServer) {
  server.tool(
    "search_campus_service",
    "Search for CCU campus services, offices, departments, and tasks by keyword or student need description.",
    { query: z.string().describe("Student's question or keyword, e.g. 'lost student ID', 'dormitory', 'visa'") },
    async ({ query }) => {
      const result = searchByNeed(query, "en");
      const lines: string[] = [];
      if (result.offices.length > 0) {
        lines.push("**Offices:**");
        result.offices.forEach((o) => {
          lines.push(`- ${o.name_en} (${o.name_zh}) — ${o.building_name_en}, ${o.floor} | ${o.office_hours} | ${o.phone}`);
        });
      }
      if (result.departments.length > 0) {
        lines.push("\n**Departments:**");
        result.departments.forEach((d) => {
          lines.push(`- ${d.name_en} — ${d.building_name_en}, ${d.floor}`);
        });
      }
      if (result.tasks.length > 0) {
        lines.push("\n**Suggested Tasks:**");
        result.tasks.forEach((t) => {
          lines.push(`- ${t.task_name_en}: ${t.scenario_en}`);
        });
      }
      if (lines.length === 0) {
        return { content: [{ type: "text", text: "No results found. Try: registration, dormitory, student ID, international support, library, transcript, health." }] };
      }
      return { content: [{ type: "text", text: lines.join("\n") }] };
    }
  );

  server.tool(
    "get_office_info",
    "Get detailed information about a specific CCU administrative office including location, hours, phone, and services.",
    { office_id: z.string().describe("Office ID, e.g. 'oia', 'oaa_reg', 'osa_dorm', 'library', 'health_center'") },
    async ({ office_id }) => {
      const office = offices.find((o) => o.id === office_id);
      if (!office) {
        const list = offices.map((o) => `${o.id} (${o.name_en})`).join(", ");
        return { content: [{ type: "text", text: `Office not found. Available IDs: ${list}` }] };
      }
      const text = [
        `**${office.name_en}** (${office.name_zh})`,
        `📍 Location: ${office.building_name_en}, ${office.floor} — ${office.indoor_location_note_en}`,
        `🕐 Hours: ${office.office_hours}`,
        `📞 Phone: ${office.phone}`,
        `📧 Email: ${office.email || "N/A"}`,
        `🔗 Website: ${office.official_url}`,
        `\n📋 Services: ${office.service_scope_en}`,
        `💡 Common scenarios: ${office.common_scenarios_en}`,
      ].join("\n");
      return { content: [{ type: "text", text }] };
    }
  );

  server.tool(
    "get_task_guide",
    "Get step-by-step guidance for common student tasks like replacing student ID, applying for dormitory, etc.",
    { task_keyword: z.string().describe("Task keyword, e.g. 'replace student ID', 'dormitory', 'transcript', 'registration'") },
    async ({ task_keyword }) => {
      const q = task_keyword.toLowerCase();
      const task = tasks.find(
        (t) =>
          t.task_name_en.toLowerCase().includes(q) ||
          t.task_name_zh.includes(q) ||
          t.scenario_en.toLowerCase().includes(q)
      );
      if (!task) {
        const list = tasks.map((t) => t.task_name_en).join(", ");
        return { content: [{ type: "text", text: `Task not found. Available tasks: ${list}` }] };
      }
      const steps = task.steps.map((s, i) => `${i + 1}. ${s.en}`).join("\n");
      const text = [
        `**${task.task_name_en}**`,
        `📌 Scenario: ${task.scenario_en}`,
        `\n🗺️ Steps:\n${steps}`,
      ].join("\n");
      return { content: [{ type: "text", text }] };
    }
  );

  server.tool(
    "get_campus_resource",
    "Get location info about campus resources like cafeteria, ATM, 7-ELEVEN, sports center.",
    { keyword: z.string().describe("Resource keyword, e.g. 'cafeteria', 'ATM', '7-eleven', 'gym'") },
    async ({ keyword }) => {
      const q = keyword.toLowerCase();
      const resource = campusResources.find(
        (r) =>
          r.name_en.toLowerCase().includes(q) ||
          r.name_zh.includes(q) ||
          r.id.includes(q)
      );
      if (!resource) {
        const list = campusResources.map((r) => r.name_en).join(", ");
        return { content: [{ type: "text", text: `Resource not found. Available: ${list}` }] };
      }
      const text = [
        `**${resource.name_en}** (${resource.name_zh})`,
        `📍 Location: ${resource.building_name_en}, ${resource.floor}`,
        `🗺️ ${resource.indoor_location_note_en}`,
      ].join("\n");
      return { content: [{ type: "text", text }] };
    }
  );

  server.tool(
    "list_service_categories",
    "List all available service categories at CCU campus.",
    {},
    async () => {
      const text = serviceCategories
        .map((c) => `- **${c.name_en}** (${c.name_zh}): ${c.description_en}`)
        .join("\n");
      return { content: [{ type: "text", text }] };
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
      const mcpServer = new McpServer({
        name: "ccu-intl-guide",
        version: "1.0.0",
      });
      registerTools(mcpServer);
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
      });
      await mcpServer.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (err) {
      console.error("MCP error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.get("/mcp", async (_req, res) => {
    res.status(405).json({ error: "Method not allowed. Use POST." });
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
    console.log(`✅ Server running on http://localhost:${port}/`);
    console.log(`🔌 MCP endpoint: http://localhost:${port}/mcp`);
  });
}

startServer().catch(console.error);