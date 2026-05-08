import { DatabaseSync } from "node:sqlite";
import { readFileSync, mkdirSync } from "fs";
import path from "path";

const DB_PATH =
  process.env.DATABASE_PATH ??
  path.join(process.cwd(), "data", "ccu-guide.sqlite");

mkdirSync(path.dirname(DB_PATH), { recursive: true });

export const db = new DatabaseSync(DB_PATH);

export function initDb(): void {
  db.exec(
    readFileSync(path.join(process.cwd(), "database", "schema.sql"), "utf-8")
  );
  console.log(`[db] Initialized: ${DB_PATH}`);
}
