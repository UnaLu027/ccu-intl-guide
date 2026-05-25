CREATE TABLE IF NOT EXISTS sessions (
  id               TEXT PRIMARY KEY,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  language         TEXT,
  user_agent       TEXT,
  first_page_path  TEXT,
  referrer         TEXT
);

CREATE TABLE IF NOT EXISTS search_events (
  id               SERIAL PRIMARY KEY,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  session_id       TEXT,
  query            TEXT NOT NULL,
  normalized_query TEXT,
  language         TEXT,
  page_path        TEXT,
  result_count     INTEGER DEFAULT 0,
  result_types     TEXT,
  response_time_ms INTEGER,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

CREATE TABLE IF NOT EXISTS search_click_events (
  id               SERIAL PRIMARY KEY,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  session_id       TEXT,
  search_event_id  INTEGER,
  clicked_type     TEXT,
  clicked_id       TEXT,
  clicked_label    TEXT,
  destination_path TEXT,
  FOREIGN KEY (session_id)      REFERENCES sessions(id),
  FOREIGN KEY (search_event_id) REFERENCES search_events(id)
);

CREATE TABLE IF NOT EXISTS ccugpt_conversations (
  id               SERIAL PRIMARY KEY,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  session_id       TEXT,
  conversation_key TEXT,
  page_path        TEXT,
  language         TEXT,
  model            TEXT,
  status           TEXT NOT NULL DEFAULT 'active',
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

CREATE TABLE IF NOT EXISTS ccugpt_messages (
  id              SERIAL PRIMARY KEY,
  conversation_id INTEGER,
  session_id      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  role            TEXT NOT NULL,
  content         TEXT NOT NULL,
  language        TEXT,
  page_path       TEXT,
  FOREIGN KEY (conversation_id) REFERENCES ccugpt_conversations(id),
  FOREIGN KEY (session_id)      REFERENCES sessions(id)
);

CREATE TABLE IF NOT EXISTS ccugpt_requests (
  id                SERIAL PRIMARY KEY,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  conversation_id   INTEGER,
  session_id        TEXT,
  user_message      TEXT NOT NULL,
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

CREATE TABLE IF NOT EXISTS mcp_tool_call_events (
  id                  SERIAL PRIMARY KEY,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

CREATE TABLE IF NOT EXISTS feedback_events (
  id          SERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  session_id  TEXT,
  source_type TEXT NOT NULL,
  source_id   INTEGER,
  rating      INTEGER,
  comment     TEXT,
  page_path   TEXT,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

CREATE TABLE IF NOT EXISTS content_drafts (
  id           SERIAL PRIMARY KEY,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  content_type TEXT NOT NULL,
  item_id      TEXT NOT NULL,
  item_label   TEXT NOT NULL,
  before_json  TEXT NOT NULL,
  after_json   TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'draft',
  note         TEXT
);

CREATE TABLE IF NOT EXISTS content_items (
  id           SERIAL PRIMARY KEY,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  content_type TEXT NOT NULL,
  item_id      TEXT NOT NULL,
  item_label   TEXT NOT NULL,
  data_json    TEXT NOT NULL,
  UNIQUE(content_type, item_id)
);

CREATE INDEX IF NOT EXISTS idx_search_events_created_at       ON search_events(created_at);
CREATE INDEX IF NOT EXISTS idx_search_events_query            ON search_events(query);
CREATE INDEX IF NOT EXISTS idx_search_events_normalized_query ON search_events(normalized_query);
CREATE INDEX IF NOT EXISTS idx_search_events_session_id       ON search_events(session_id);
CREATE INDEX IF NOT EXISTS idx_search_click_search_event_id   ON search_click_events(search_event_id);
CREATE INDEX IF NOT EXISTS idx_ccugpt_conv_session_id         ON ccugpt_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_ccugpt_conv_conversation_key   ON ccugpt_conversations(conversation_key);
CREATE INDEX IF NOT EXISTS idx_ccugpt_msg_session_id          ON ccugpt_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_ccugpt_msg_conversation_id     ON ccugpt_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ccugpt_req_session_id          ON ccugpt_requests(session_id);
CREATE INDEX IF NOT EXISTS idx_ccugpt_req_created_at          ON ccugpt_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_mcp_tool_conversation_id       ON mcp_tool_call_events(conversation_id);
CREATE INDEX IF NOT EXISTS idx_feedback_session_id            ON feedback_events(session_id);
CREATE INDEX IF NOT EXISTS idx_content_drafts_created_at      ON content_drafts(created_at);
CREATE INDEX IF NOT EXISTS idx_content_drafts_item            ON content_drafts(content_type, item_id);
CREATE INDEX IF NOT EXISTS idx_content_items_item             ON content_items(content_type, item_id);
