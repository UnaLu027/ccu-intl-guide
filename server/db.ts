import { DatabaseSync } from "node:sqlite";
import { mkdirSync, readFileSync } from "fs";
import { createRequire } from "module";
import path from "path";
import type { Pool as PgPool, PoolClient } from "pg";

const _require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _pgMod = _require("pg") as any;
const Pool = _pgMod.Pool as new (opts: { connectionString: string }) => PgPool;
const pgTypes = _pgMod.types as {
  setTypeParser: (oid: number, parseFn: (value: string) => unknown) => void;
};

type QueryParam = string | number | null;

export interface DatabaseAdapter {
  readonly dialect: "sqlite" | "postgres";
  init(): Promise<void>;
  prepare(sql: string): Statement;
  exec(sql: string): void | Promise<void>;
  transaction(action: () => Promise<void>): Promise<void>;
}

type DbRunResult = {
  changes?: number;
  lastInsertRowid?: number | string;
};

type Statement = {
  get<T = unknown>(...params: QueryParam[]): Promise<T | undefined>;
  all<T = unknown>(...params: QueryParam[]): Promise<T[]>;
  run(...params: QueryParam[]): Promise<DbRunResult>;
};

const DB_PATH =
  process.env.DATABASE_PATH ??
  path.join(process.cwd(), "data", "ccu-guide.sqlite");

const DATABASE_URL = process.env.DATABASE_URL;

function toPostgresSql(sql: string) {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
}

function withReturningId(sql: string) {
  if (!/^\s*insert\s+into\s+/i.test(sql) || /\breturning\b/i.test(sql)) {
    return sql;
  }
  return `${sql} RETURNING id`;
}

class SqliteDatabaseAdapter {
  readonly dialect = "sqlite";
  private readonly sqlite: DatabaseSync;

  constructor() {
    mkdirSync(path.dirname(DB_PATH), { recursive: true });
    this.sqlite = new DatabaseSync(DB_PATH);
  }

  async init() {
    this.exec(readFileSync(path.join(process.cwd(), "database", "schema.sql"), "utf-8"));
    console.log(`[db] Initialized SQLite: ${DB_PATH}`);
  }

  prepare(sql: string): Statement {
    const statement = this.sqlite.prepare(sql);
    return {
      get: async <T = unknown>(...params: QueryParam[]) => statement.get(...params) as T | undefined,
      all: async <T = unknown>(...params: QueryParam[]) => statement.all(...params) as T[],
      run: async (...params: QueryParam[]) => statement.run(...params) as DbRunResult,
    };
  }

  exec(sql: string): void {
    this.sqlite.exec(sql);
  }

  async transaction(action: () => Promise<void>) {
    this.exec("BEGIN IMMEDIATE");
    try {
      await action();
      this.exec("COMMIT");
    } catch (err) {
      this.exec("ROLLBACK");
      throw err;
    }
  }
}

class PostgresDatabaseAdapter {
  readonly dialect = "postgres";
  private readonly pool: PgPool;
  private activeClient: PoolClient | null = null;

  constructor(connectionString: string) {
    pgTypes.setTypeParser(20, (value: string) => Number(value));
    this.pool = new Pool({ connectionString });
  }

  async init() {
    await this.exec(readFileSync(path.join(process.cwd(), "database", "schema.postgres.sql"), "utf-8"));
    console.log("[db] Initialized PostgreSQL from DATABASE_URL");
  }

  prepare(sql: string): Statement {
    const query = (querySql: string, params: QueryParam[]) =>
      this.activeClient
        ? this.activeClient.query(querySql, params)
        : this.pool.query(querySql, params);

    return {
      get: async <T = unknown>(...params: QueryParam[]) => {
        const result = await query(toPostgresSql(sql), params);
        return result.rows[0] as T | undefined;
      },
      all: async <T = unknown>(...params: QueryParam[]) => {
        const result = await query(toPostgresSql(sql), params);
        return result.rows as T[];
      },
      run: async (...params: QueryParam[]) => {
        const result = await query(toPostgresSql(withReturningId(sql)), params);
        return {
          changes: result.rowCount ?? 0,
          lastInsertRowid: result.rows[0]?.id,
        };
      },
    };
  }

  async exec(sql: string) {
    await this.pool.query(sql);
  }

  async transaction(action: () => Promise<void>) {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");
      this.activeClient = client;
      await action();
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      this.activeClient = null;
      client.release();
    }
  }
}

export const db: DatabaseAdapter = DATABASE_URL
  ? new PostgresDatabaseAdapter(DATABASE_URL)
  : new SqliteDatabaseAdapter();

export function initDb(): Promise<void> {
  return db.init();
}
