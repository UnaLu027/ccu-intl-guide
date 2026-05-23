const SESSION_KEY = "ccu-guide-session-id";
const CONVERSATION_KEY = "ccu-guide-ccugpt-conversation-key";

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function getStoredId(storage: Storage, key: string, prefix: string) {
  try {
    const existing = storage.getItem(key);
    if (existing) return existing;

    const next = makeId(prefix);
    storage.setItem(key, next);
    return next;
  } catch {
    return makeId(prefix);
  }
}

export function getSessionId() {
  return getStoredId(localStorage, SESSION_KEY, "session");
}

export function getConversationKey() {
  return getStoredId(sessionStorage, CONVERSATION_KEY, "conversation");
}

export function getPageMetadata() {
  return {
    session_id: getSessionId(),
    page_path: `${window.location.pathname}${window.location.search}`,
    referrer: document.referrer || null,
  };
}
