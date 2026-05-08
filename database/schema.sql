PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ─── 1. sessions ─────────────────────────────────────────────────────────────
-- 記錄匿名使用者 session
CREATE TABLE IF NOT EXISTS sessions (
  id               TEXT PRIMARY KEY,
  created_at       TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at     TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  language         TEXT,
  user_agent       TEXT,
  first_page_path  TEXT,
  referrer         TEXT
);

-- ─── 2. search_events ─────────────────────────────────────────────────────────
-- 記錄搜尋引擎使用資料
CREATE TABLE IF NOT EXISTS search_events (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at       TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  session_id       TEXT,
  query            TEXT    NOT NULL,
  normalized_query TEXT,
  language         TEXT,
  page_path        TEXT,
  result_count     INTEGER DEFAULT 0,
  result_types     TEXT,
  response_time_ms INTEGER,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- ─── 3. search_click_events ───────────────────────────────────────────────────
-- 記錄使用者從搜尋結果點擊的項目
CREATE TABLE IF NOT EXISTS search_click_events (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at       TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  session_id       TEXT,
  search_event_id  INTEGER,
  clicked_type     TEXT,
  clicked_id       TEXT,
  clicked_label    TEXT,
  destination_path TEXT,
  FOREIGN KEY (session_id)      REFERENCES sessions(id),
  FOREIGN KEY (search_event_id) REFERENCES search_events(id)
);

-- ─── 4. ccugpt_conversations ──────────────────────────────────────────────────
-- 記錄 ASKCCUGPT 對話 session
CREATE TABLE IF NOT EXISTS ccugpt_conversations (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at       TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  session_id       TEXT,
  conversation_key TEXT,
  page_path        TEXT,
  language         TEXT,
  model            TEXT,
  status           TEXT NOT NULL DEFAULT 'active',
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- ─── 5. ccugpt_messages ───────────────────────────────────────────────────────
-- 記錄 ASKCCUGPT 的 user / assistant 訊息
CREATE TABLE IF NOT EXISTS ccugpt_messages (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id INTEGER,
  session_id      TEXT,
  created_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  role            TEXT NOT NULL,
  content         TEXT NOT NULL,
  language        TEXT,
  page_path       TEXT,
  FOREIGN KEY (conversation_id) REFERENCES ccugpt_conversations(id),
  FOREIGN KEY (session_id)      REFERENCES sessions(id)
);

-- ─── 6. ccugpt_requests ───────────────────────────────────────────────────────
-- 記錄每次呼叫 CCUGPT API 的結果與效能
CREATE TABLE IF NOT EXISTS ccugpt_requests (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at        TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  conversation_id   INTEGER,
  session_id        TEXT,
  user_message      TEXT    NOT NULL,
  assistant_message TEXT,
  model             TEXT,
  success           INTEGER NOT NULL DEFAULT 0,
  status_code       INTEGER,
  latency_ms        INTEGER,
  error_message     TEXT,
  raw_response_json TEXT,
  FOREIGN KEY (conversation_id) REFERENCES ccugpt_conversations(id),
  FOREIGN KEY (session_id)      REFERENCES sessions(id)
);

-- ─── 7. mcp_tool_call_events ──────────────────────────────────────────────────
-- 記錄 MCP tool 呼叫狀況
CREATE TABLE IF NOT EXISTS mcp_tool_call_events (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at          TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  conversation_id     INTEGER,
  session_id          TEXT,
  tool_name           TEXT,
  tool_input_json     TEXT,
  tool_result_summary TEXT,
  success             INTEGER,
  latency_ms          INTEGER,
  FOREIGN KEY (conversation_id) REFERENCES ccugpt_conversations(id),
  FOREIGN KEY (session_id)      REFERENCES sessions(id)
);

-- ─── 8. feedback_events ───────────────────────────────────────────────────────
-- 記錄使用者對搜尋結果或 CCUGPT 回覆的回饋
CREATE TABLE IF NOT EXISTS feedback_events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  session_id  TEXT,
  source_type TEXT NOT NULL,
  source_id   INTEGER,
  rating      INTEGER,
  comment     TEXT,
  page_path   TEXT,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_search_events_created_at       ON search_events(created_at);
CREATE INDEX IF NOT EXISTS idx_search_events_query            ON search_events(query);
CREATE INDEX IF NOT EXISTS idx_search_events_normalized_query ON search_events(normalized_query);
CREATE INDEX IF NOT EXISTS idx_search_events_session_id       ON search_events(session_id);
CREATE INDEX IF NOT EXISTS idx_search_click_search_event_id   ON search_click_events(search_event_id);
CREATE INDEX IF NOT EXISTS idx_ccugpt_conv_session_id         ON ccugpt_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_ccugpt_msg_session_id          ON ccugpt_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_ccugpt_msg_conversation_id     ON ccugpt_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ccugpt_req_session_id          ON ccugpt_requests(session_id);
CREATE INDEX IF NOT EXISTS idx_ccugpt_req_created_at          ON ccugpt_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_mcp_tool_conversation_id       ON mcp_tool_call_events(conversation_id);
CREATE INDEX IF NOT EXISTS idx_feedback_session_id            ON feedback_events(session_id);
