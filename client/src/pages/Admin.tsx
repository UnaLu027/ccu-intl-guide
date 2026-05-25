import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  Database,
  LockKeyhole,
  LogOut,
  MessageSquare,
  RefreshCw,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Stats {
  totalSearches: number;
  totalConversations: number;
  totalMessages: number;
  totalSessions: number;
  topQueries: { query: string; count: number }[];
  recentActivity?: {
    type: "search" | "ccugpt";
    created_at: string;
    label: string;
    page_path: string | null;
  }[];
}

interface SearchEvent {
  id: number;
  created_at: string;
  query: string;
  language: string | null;
  result_count: number;
  result_types: string | null;
  response_time_ms: number | null;
  page_path: string | null;
}

interface Message {
  role: string;
  content: string;
  created_at: string;
}

interface Conversation {
  id: number;
  created_at: string;
  updated_at: string;
  language: string | null;
  model: string | null;
  status: string;
  page_path: string | null;
  messages: Message[];
}

interface AdminData {
  stats: Stats;
  searchEvents: SearchEvent[];
  conversations: Conversation[];
  drafts: ContentDraft[];
}

interface AuthStatus {
  authenticated: boolean;
  passwordConfigured: boolean;
}

type ContentType = "office" | "department" | "task";

interface ContentItem {
  type: ContentType;
  id: string;
  label: string;
  data: Record<string, unknown>;
  isNew?: boolean;
}

interface ContentDraft {
  id: number;
  created_at: string;
  updated_at: string;
  content_type: ContentType;
  item_id: string;
  item_label: string;
  before_json: string;
  after_json: string;
  status: string;
  note: string | null;
}

type ApiError = Error & { status?: number };

interface MaintenanceResult {
  ok: boolean;
  deleted?: Record<string, number>;
}

function fmt(ts: string) {
  return new Date(ts).toLocaleString("zh-TW", { hour12: false });
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: "same-origin",
    ...init,
    headers: {
      ...(init?.headers ?? {}),
    },
  });
  const contentType = res.headers.get("content-type") ?? "";

  if (!res.ok) {
    const error = new Error(`${url} returned ${res.status}`) as ApiError;
    error.status = res.status;
    throw error;
  }

  if (!contentType.includes("application/json")) {
    throw new Error(`${url} did not return JSON. Make sure the Express backend is running.`);
  }

  return res.json() as Promise<T>;
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <AlertCircle className="mb-3 h-8 w-8 text-muted-foreground" />
      <p className="font-semibold">{title}</p>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Search;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value.toLocaleString()}</p>
      </CardContent>
    </Card>
  );
}

function LoginForm({
  passwordConfigured,
  onLogin,
}: {
  passwordConfigured: boolean;
  onLogin: (password: string) => Promise<void>;
}) {
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await onLogin(password);
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "登入失敗");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-md bg-navy text-white">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <CardTitle className="text-xl">管理後台登入</CardTitle>
          <p className="text-sm text-muted-foreground">請輸入管理員密碼以查看使用紀錄與 CCUGPT 對話。</p>
        </CardHeader>
        <CardContent>
          {!passwordConfigured && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              production 尚未設定 ADMIN_PASSWORD，後台登入已停用。
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="admin-password">
                管理員密碼
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={!passwordConfigured || submitting}
                className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-navy/30 disabled:opacity-60"
                autoComplete="current-password"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={!passwordConfigured || submitting || password.trim().length === 0}
              className="w-full rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "登入中..." : "登入"}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function OverviewTab({ stats }: { stats: Stats }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Search} label="搜尋總次數" value={stats.totalSearches} />
        <StatCard icon={MessageSquare} label="CCUGPT 對話數" value={stats.totalConversations} />
        <StatCard icon={MessageSquare} label="CCUGPT 訊息數" value={stats.totalMessages} />
        <StatCard icon={Users} label="Session 數" value={stats.totalSessions} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">熱門搜尋 Top 10</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topQueries.length === 0 ? (
              <EmptyState title="目前尚無搜尋資料" description="使用者從首頁搜尋後，資料會自動寫入這裡。" />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-4">#</th>
                    <th className="pb-2 pr-4">關鍵字</th>
                    <th className="pb-2 text-right">次數</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topQueries.map((q, i) => (
                    <tr key={`${q.query}-${i}`} className="border-b last:border-0">
                      <td className="py-2 pr-4 text-muted-foreground">{i + 1}</td>
                      <td className="py-2 pr-4 font-medium">{q.query}</td>
                      <td className="py-2 text-right">{q.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">最近活動</CardTitle>
          </CardHeader>
          <CardContent>
            {!stats.recentActivity || stats.recentActivity.length === 0 ? (
              <EmptyState title="目前尚無活動" description="搜尋與 CCUGPT 使用紀錄會依時間出現在這裡。" />
            ) : (
              <div className="space-y-3">
                {stats.recentActivity.map((item, i) => (
                  <div key={`${item.type}-${item.created_at}-${i}`} className="rounded border p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <Badge variant={item.type === "search" ? "default" : "secondary"}>
                        {item.type === "search" ? "搜尋" : "CCUGPT"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{fmt(item.created_at)}</span>
                    </div>
                    <p className="line-clamp-2 text-sm">{item.label}</p>
                    {item.page_path && <p className="mt-1 text-xs text-muted-foreground">{item.page_path}</p>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SearchTab({ events }: { events: SearchEvent[] }) {
  if (events.length === 0) {
    return <EmptyState title="目前尚無搜尋紀錄" description="進入 /search?q=... 的查詢會自動寫入 search_events。" />;
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-muted-foreground">
                <th className="px-4 py-2">時間</th>
                <th className="px-4 py-2">查詢</th>
                <th className="px-4 py-2">語言</th>
                <th className="px-4 py-2">類型</th>
                <th className="px-4 py-2 text-right">結果數</th>
                <th className="px-4 py-2 text-right">耗時</th>
                <th className="px-4 py-2">頁面</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="whitespace-nowrap px-4 py-2 text-muted-foreground">{fmt(event.created_at)}</td>
                  <td className="max-w-xs truncate px-4 py-2 font-medium">{event.query}</td>
                  <td className="px-4 py-2">{event.language && <Badge variant="outline">{event.language}</Badge>}</td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">{event.result_types || "-"}</td>
                  <td className="px-4 py-2 text-right">{event.result_count}</td>
                  <td className="px-4 py-2 text-right">{event.response_time_ms ?? "-"} ms</td>
                  <td className="max-w-[180px] truncate px-4 py-2 text-xs text-muted-foreground">{event.page_path ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function roleColor(role: string) {
  return role === "user" ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-gray-50";
}

function ConversationRow({ conversation }: { conversation: Conversation }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr className="cursor-pointer border-b hover:bg-muted/30" onClick={() => setOpen((value) => !value)}>
        <td className="whitespace-nowrap px-4 py-2 text-muted-foreground">{fmt(conversation.created_at)}</td>
        <td className="px-4 py-2">{conversation.messages.length} 則</td>
        <td className="px-4 py-2">{conversation.language && <Badge variant="outline">{conversation.language}</Badge>}</td>
        <td className="px-4 py-2 text-xs text-muted-foreground">{conversation.model ?? "-"}</td>
        <td className="px-4 py-2">
          <Badge variant={conversation.status === "active" ? "default" : "secondary"}>{conversation.status}</Badge>
        </td>
        <td className="max-w-[180px] truncate px-4 py-2 text-xs text-muted-foreground">{conversation.page_path ?? "-"}</td>
        <td className="px-4 py-2 text-muted-foreground">{open ? "收合" : "展開"}</td>
      </tr>
      {open && (
        <tr>
          <td colSpan={7} className="bg-muted/10 px-6 py-4">
            <div className="space-y-2">
              {conversation.messages.map((message, i) => (
                <div key={`${message.created_at}-${i}`} className={`rounded border p-3 text-sm ${roleColor(message.role)}`}>
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {message.role}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{fmt(message.created_at)}</span>
                  </div>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function CCUGPTTab({ conversations }: { conversations: Conversation[] }) {
  if (conversations.length === 0) {
    return <EmptyState title="目前尚無 CCUGPT 對話" description="使用者送出 CCUGPT 訊息後，user 與 assistant 訊息都會寫入資料庫。" />;
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-muted-foreground">
                <th className="px-4 py-2">時間</th>
                <th className="px-4 py-2">訊息數</th>
                <th className="px-4 py-2">語言</th>
                <th className="px-4 py-2">模型</th>
                <th className="px-4 py-2">狀態</th>
                <th className="px-4 py-2">頁面</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {conversations.map((conversation) => (
                <ConversationRow key={conversation.id} conversation={conversation} />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

const FIELD_LABELS: Record<string, string> = {
  id: "系統代號",
  name_zh: "中文名稱",
  name_en: "英文名稱",
  task_name_zh: "中文任務名稱",
  task_name_en: "英文任務名稱",
  scenario_zh: "中文情境描述",
  scenario_en: "英文情境描述",
  category: "資料類型",
  category_id: "服務分類代號",
  service_categories: "服務分類",
  target_unit_type: "負責單位類型",
  target_unit_id: "負責單位代號",
  college_zh: "中文學院",
  college_en: "英文學院/系所",
  building_name_zh: "中文建築物名稱",
  building_name_en: "英文建築物名稱",
  floor: "樓層",
  room_zh: "中文辦公室/教室號碼",
  room_en: "英文辦公室/教室號碼",
  indoor_location_note_zh: "中文室內位置說明",
  indoor_location_note_en: "英文室內位置說明",
  function_desc_zh: "中文功能描述",
  function_desc_en: "英文功能描述",
  service_scope_zh: "中文服務範圍",
  service_scope_en: "英文服務範圍",
  common_scenarios_zh: "中文常見情境",
  common_scenarios_en: "英文常見情境",
  office_hours: "辦公時間",
  phone: "電話",
  email: "Email",
  official_url: "官方網站",
  source_url: "資料來源網址",
  google_maps_query: "Google Maps 查詢字",
  latitude: "緯度",
  longitude: "經度",
  use_manual_coordinates: "是否使用手動座標",
  needs_manual_review: "是否需要人工確認",
  is_college_office: "是否為學院辦公室",
  floor_plan_image: "平面圖圖片",
  entrance_image: "入口圖片",
  building_entrance_image: "建築入口圖片",
  required_documents_zh: "中文所需文件",
  required_documents_en: "英文所需文件",
  steps: "處理步驟",
};

function fieldLabel(key: string) {
  return FIELD_LABELS[key] ?? "其他欄位";
}

function typeLabel(type: ContentType) {
  if (type === "office") return "行政單位";
  if (type === "department") return "系所單位";
  return "任務流程";
}

function makeContentTemplate(type: ContentType, id: string): Record<string, unknown> {
  if (type === "task") {
    return {
      id,
      task_name_zh: "",
      task_name_en: "",
      scenario_zh: "",
      scenario_en: "",
      target_unit_type: "office",
      target_unit_id: "",
      category_id: "",
      required_documents_zh: [""],
      required_documents_en: [""],
      steps: [{ zh: "", en: "" }],
    };
  }

  const common = {
    id,
    name_zh: "",
    name_en: "",
    category: type,
    service_categories: [""],
    building_name_zh: "",
    building_name_en: "",
    floor: "",
    room_zh: "",
    room_en: "",
    indoor_location_note_zh: "",
    indoor_location_note_en: "",
    function_desc_zh: "",
    function_desc_en: "",
    service_scope_zh: "",
    service_scope_en: "",
    official_url: "",
    google_maps_query: "",
    latitude: 0,
    longitude: 0,
    use_manual_coordinates: false,
    source_url: "",
    needs_manual_review: true,
    entrance_image: "",
    floor_plan_image: "",
    building_entrance_image: "",
  };

  if (type === "department") {
    return {
      ...common,
      college_zh: "",
      college_en: "",
      is_college_office: false,
    };
  }

  return {
    ...common,
    office_hours: "",
    phone: "",
    email: "",
    common_scenarios_zh: "",
    common_scenarios_en: "",
  };
}

function valueToText(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (isZhEnObject(item)) return `中文：${item.zh}\nEnglish：${item.en}`;
        return typeof item === "object" && item !== null ? JSON.stringify(item, null, 2) : String(item);
      })
      .join("\n\n");
  }
  if (typeof value === "object" && value !== null) return JSON.stringify(value, null, 2);
  return value == null ? "" : String(value);
}

function textToValue(original: unknown, value: string) {
  if (Array.isArray(original)) return value.split("\n").map((line) => line.trim()).filter(Boolean);
  if (typeof original === "number") return Number(value);
  if (typeof original === "boolean") return value === "true";
  if (typeof original === "object" && original !== null) {
    try {
      return JSON.parse(value);
    } catch {
      return original;
    }
  }
  return value;
}

function isZhEnObject(value: unknown): value is { zh: string; en: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { zh?: unknown }).zh === "string" &&
    typeof (value as { en?: unknown }).en === "string"
  );
}

function isZhEnArray(value: unknown): value is { zh: string; en: string }[] {
  return Array.isArray(value) && value.every(isZhEnObject);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function diffFields(before: Record<string, unknown>, after: Record<string, unknown>) {
  return Object.keys({ ...before, ...after }).filter(
    (key) => JSON.stringify(before[key]) !== JSON.stringify(after[key])
  );
}

function FieldTitle({ name }: { name: string }) {
  return (
    <span className="mb-1 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
      <span>{fieldLabel(name)}</span>
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">{name}</code>
    </span>
  );
}

function ZhEnArrayEditor({
  name,
  value,
  onChange,
}: {
  name: string;
  value: unknown;
  onChange: (next: { zh: string; en: string }[]) => void;
}) {
  const items = isZhEnArray(value) ? value : [];

  const updateItem = (index: number, lang: "zh" | "en", nextValue: string) => {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, [lang]: nextValue } : item)));
  };

  return (
    <div className="space-y-3 rounded-md border p-3 md:col-span-2">
      <FieldTitle name={name} />
      <p className="text-xs text-muted-foreground">每一項會拆成中文與英文，不需要編輯 JSON。</p>
      {items.map((item, index) => (
        <div key={index} className="rounded-md border bg-muted/20 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold">第 {index + 1} 項</span>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
              className="text-xs text-red-600 hover:underline"
            >
              刪除
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <label>
              <span className="mb-1 block text-xs font-medium text-muted-foreground">中文 zh</span>
              <textarea
                value={item.zh}
                onChange={(event) => updateItem(index, "zh", event.target.value)}
                rows={3}
                className="w-full rounded-md border bg-white px-3 py-2 text-sm"
              />
            </label>
            <label>
              <span className="mb-1 block text-xs font-medium text-muted-foreground">English en</span>
              <textarea
                value={item.en}
                onChange={(event) => updateItem(index, "en", event.target.value)}
                rows={3}
                className="w-full rounded-md border bg-white px-3 py-2 text-sm"
              />
            </label>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { zh: "", en: "" }])}
        className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
      >
        新增一項
      </button>
    </div>
  );
}

function StringArrayEditor({
  name,
  value,
  onChange,
}: {
  name: string;
  value: unknown;
  onChange: (next: string[]) => void;
}) {
  const items = isStringArray(value) ? value : [];

  return (
    <label className="block">
      <FieldTitle name={name} />
      <textarea
        value={items.join("\n")}
        onChange={(event) => onChange(event.target.value.split("\n").map((line) => line.trim()).filter(Boolean))}
        rows={5}
        className="w-full rounded-md border px-3 py-2 text-sm"
      />
      <span className="mt-1 block text-xs text-muted-foreground">每行一項</span>
    </label>
  );
}

function FieldEditor({
  name,
  original,
  value,
  onChange,
}: {
  name: string;
  original: unknown;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  if (isZhEnArray(value) || isZhEnArray(original)) {
    return <ZhEnArrayEditor name={name} value={value} onChange={onChange} />;
  }

  if (isStringArray(value) || isStringArray(original)) {
    return <StringArrayEditor name={name} value={value} onChange={onChange} />;
  }

  if (typeof original === "object" && original !== null) {
    return (
      <label className="block md:col-span-2">
        <FieldTitle name={name} />
        <textarea
          value={valueToText(value)}
          onChange={(event) => onChange(textToValue(original, event.target.value))}
          rows={6}
          className="w-full rounded-md border px-3 py-2 font-mono text-sm"
        />
        <span className="mt-1 block text-xs text-muted-foreground">進階欄位，以 JSON 格式編輯</span>
      </label>
    );
  }

  return (
    <label className="block">
      <FieldTitle name={name} />
      <input
        value={valueToText(value)}
        onChange={(event) => onChange(textToValue(original, event.target.value))}
        className="w-full rounded-md border px-3 py-2 text-sm"
      />
    </label>
  );
}

function ContentMaintenanceTab({ onSaved }: { onSaved: () => Promise<void> }) {
  const [contentMode, setContentMode] = useState<"edit" | "create">("edit");
  const [query, setQuery] = useState("");
  const [newType, setNewType] = useState<ContentType>("task");
  const [newId, setNewId] = useState("");
  const [items, setItems] = useState<ContentItem[]>([]);
  const [selected, setSelected] = useState<ContentItem | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [note, setNote] = useState("");
  const [loadingItems, setLoadingItems] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const searchItems = async () => {
    setLoadingItems(true);
    setMessage(null);
    try {
      const result = await fetchJson<ContentItem[]>(`/api/admin/content-items?query=${encodeURIComponent(query)}`);
      setItems(result);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "搜尋失敗");
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    void searchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const choose = (item: ContentItem) => {
    setContentMode("edit");
    setSelected(item);
    setFormData(item.data);
    setNote("");
    setMessage(null);
  };

  const startNewItem = () => {
    const id = newId.trim();
    if (!id) {
      setMessage("請先輸入新資料的 id。");
      return;
    }

    const data = makeContentTemplate(newType, id);
    setSelected({
      type: newType,
      id,
      label: `新增 ${typeLabel(newType)} / ${id}`,
      data,
      isNew: true,
    });
    setFormData(data);
    setNote("");
    setMessage(null);
  };

  const changedFields = selected ? (selected.isNew ? Object.keys(formData) : diffFields(selected.data, formData)) : [];

  const applyContentUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    setMessage(null);
    try {
      await fetchJson<{ ok: true }>("/api/admin/content-drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_type: selected.type,
          item_id: selected.id,
          after_data: formData,
          note,
          is_new: selected.isNew === true,
        }),
      });
      setMessage(selected.isNew ? "已新增正式內容，網站重新整理後會讀取 Neon 中的新資料。" : "已更新正式內容，網站重新整理後會讀取 Neon 中的新資料。");
      await onSaved();
      await searchItems();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "內容更新失敗");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Tabs
      value={contentMode}
      onValueChange={(value) => {
        const nextMode = value as "edit" | "create";
        setContentMode(nextMode);
        setSelected(null);
        setFormData({});
        setNote("");
        setMessage(null);
      }}
      className="space-y-4"
    >
      <TabsList>
        <TabsTrigger value="edit">修改資料</TabsTrigger>
        <TabsTrigger value="create">新增資料</TabsTrigger>
      </TabsList>

    <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{contentMode === "create" ? "新增資料" : "搜尋要修改的內容"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className={`rounded-md border bg-muted/20 p-3 ${contentMode === "create" ? "" : "hidden"}`}>
            <div className="mb-2 text-sm font-semibold">新增資料</div>
            <div className="grid gap-2">
              <select
                value={newType}
                onChange={(event) => setNewType(event.target.value as ContentType)}
                className="rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="task">任務流程 Task</option>
                <option value="office">行政單位 Office</option>
                <option value="department">系所單位 Department</option>
              </select>
              <input
                value={newId}
                onChange={(event) => setNewId(event.target.value)}
                placeholder="new_unique_id"
                className="rounded-md border px-3 py-2 text-sm font-mono"
              />
              <button
                type="button"
                onClick={startNewItem}
                className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                建立新增表單
              </button>
            </div>
          </div>

          <form
            className={`flex gap-2 ${contentMode === "edit" ? "" : "hidden"}`}
            onSubmit={(event) => {
              event.preventDefault();
              void searchItems();
            }}
          >
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="國際處 / 學生證 / 財金系辦"
              className="min-w-0 flex-1 rounded-md border px-3 py-2 text-sm"
            />
            <button type="submit" className="rounded-md border px-3 py-2 text-sm font-medium">
              {loadingItems ? "搜尋中" : "搜尋"}
            </button>
          </form>

          <div className={`max-h-[560px] space-y-2 overflow-y-auto ${contentMode === "edit" ? "" : "hidden"}`}>
            {items.map((item) => (
              <button
                key={`${item.type}-${item.id}`}
                type="button"
                onClick={() => choose(item)}
                className="w-full rounded-md border p-3 text-left text-sm hover:bg-muted"
              >
                <div className="mb-1 flex items-center gap-2">
                  <Badge variant="outline">{typeLabel(item.type)}</Badge>
                  <span className="font-mono text-xs text-muted-foreground">{item.id}</span>
                </div>
                <div className="font-medium">{item.label}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{selected ? `${selected.isNew ? "新增" : "編輯"}：${selected.label}` : contentMode === "create" ? "尚未建立新增表單" : "尚未選擇資料"}</CardTitle>
        </CardHeader>
        <CardContent>
          {!selected ? (
            <EmptyState
              title={contentMode === "create" ? "請先建立新增表單" : "請先選擇一筆資料"}
              description={contentMode === "create" ? "左側選擇資料類型並輸入唯一 id 後，這裡會產生新增表單欄位。" : "左側搜尋並選取行政單位、系所或任務流程後，這裡會產生表單欄位。"}
            />
          ) : (
            <div className="space-y-5">
              <div className="grid gap-3 md:grid-cols-2">
                {Object.entries(selected.data).map(([key, original]) => (
                  <FieldEditor
                    key={key}
                    name={key}
                    original={original}
                    value={formData[key]}
                    onChange={(next) =>
                      setFormData((current) => ({
                        ...current,
                        [key]: next,
                      }))
                    }
                  />
                ))}
              </div>

              <div className="rounded-md border p-4">
                <div className="mb-3 font-semibold">修改前後對照</div>
                {changedFields.length === 0 ? (
                  <p className="text-sm text-muted-foreground">尚未修改任何欄位。</p>
                ) : (
                  <div className="space-y-3">
                    {changedFields.map((key) => (
                      <div key={key} className="grid gap-2 md:grid-cols-2">
                        <div className="rounded bg-red-50 p-3">
                          <div className="mb-1 text-xs font-semibold text-red-700">
                            原本：{fieldLabel(key)} <code>{key}</code>
                          </div>
                          <pre className="whitespace-pre-wrap text-xs">{valueToText(selected.data[key])}</pre>
                        </div>
                        <div className="rounded bg-green-50 p-3">
                          <div className="mb-1 text-xs font-semibold text-green-700">
                            修改後：{fieldLabel(key)} <code>{key}</code>
                          </div>
                          <pre className="whitespace-pre-wrap text-xs">{valueToText(formData[key])}</pre>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <label className="block">
                <span className="mb-1 block text-sm font-medium">修改備註</span>
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={3}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  placeholder="例如：更新國際處辦公時間與分機"
                />
              </label>

              {message && <p className="text-sm text-muted-foreground">{message}</p>}

              <button
                type="button"
                onClick={() => void applyContentUpdate()}
                disabled={saving || changedFields.length === 0}
                className="rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "處理中..." : selected.isNew ? "新增正式內容" : "更新正式內容"}
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </Tabs>
  );
}

function DraftsTab({ drafts }: { drafts: ContentDraft[] }) {
  if (drafts.length === 0) {
    return <EmptyState title="目前尚無修改紀錄" description="內容維護更新正式內容後，修改前後 JSON 會保留在這裡。" />;
  }

  return (
    <div className="space-y-3">
      {drafts.map((draft) => (
        <Card key={draft.id}>
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center gap-2 text-base">
              <Badge variant="outline">{draft.content_type}</Badge>
              {draft.item_label}
              <span className="text-xs font-normal text-muted-foreground">{fmt(draft.created_at)}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {draft.note && <p className="text-sm text-muted-foreground">{draft.note}</p>}
            <div className="grid gap-3 md:grid-cols-2">
              <pre className="max-h-72 overflow-auto rounded bg-red-50 p-3 text-xs">{JSON.stringify(JSON.parse(draft.before_json), null, 2)}</pre>
              <pre className="max-h-72 overflow-auto rounded bg-green-50 p-3 text-xs">{JSON.stringify(JSON.parse(draft.after_json), null, 2)}</pre>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function MaintenanceTab({ onChanged }: { onChanged: () => Promise<void> }) {
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const actions = [
    {
      key: "search",
      title: "清除搜尋紀錄",
      description: "刪除 search_events 與搜尋點擊紀錄，CCUGPT 對話與內容草稿會保留。",
      endpoint: "/api/admin/records/search-events",
      method: "DELETE",
      confirmText: "確定要永久清除所有搜尋紀錄嗎？這個動作不能復原。",
      danger: true,
    },
    {
      key: "ccugpt",
      title: "清除 CCUGPT 使用紀錄",
      description: "刪除對話、訊息、請求與工具呼叫紀錄，搜尋紀錄與內容草稿會保留。",
      endpoint: "/api/admin/records/ccugpt",
      method: "DELETE",
      confirmText: "確定要永久清除所有 CCUGPT 使用紀錄嗎？這個動作不能復原。",
      danger: true,
    },
    {
      key: "drafts",
      title: "清除內容修改草稿",
      description: "刪除後台內容維護產生的草稿與修改前後對照，不會影響正式網站資料。",
      endpoint: "/api/admin/records/content-drafts",
      method: "DELETE",
      confirmText: "確定要永久清除所有內容修改草稿嗎？這個動作不能復原。",
      danger: true,
    },
    {
      key: "all",
      title: "清除所有使用紀錄",
      description: "刪除 sessions、搜尋、CCUGPT、回饋等使用紀錄；內容修改草稿會保留。",
      endpoint: "/api/admin/records/all-usage",
      method: "DELETE",
      confirmText: "確定要永久清除所有使用紀錄嗎？內容草稿會保留，但使用分析資料不能復原。",
      danger: true,
    },
    {
      key: "compact",
      title: "壓縮整理資料庫",
      description: "執行 SQLite checkpoint 與 VACUUM，適合大量清除資料後釋放資料庫檔案空間。",
      endpoint: "/api/admin/maintenance/compact",
      method: "POST",
      confirmText: "確定要壓縮整理資料庫嗎？大型資料庫可能需要一些時間。",
      danger: false,
    },
  ];

  const runAction = async (action: (typeof actions)[number]) => {
    if (!window.confirm(action.confirmText)) return;

    setBusyKey(action.key);
    setMessage(null);
    setError(null);

    try {
      const result = await fetchJson<MaintenanceResult>(action.endpoint, { method: action.method });
      const deletedText = result.deleted
        ? Object.entries(result.deleted)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")
        : "已完成";
      setMessage(`${action.title}完成。${deletedText}`);
      await onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失敗");
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Database className="h-4 w-4" />
            資料保存與清除
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            搜尋與 CCUGPT 紀錄會寫入 SQLite，不會因為前端刷新而消失。此區提供管理者定期清除或壓縮資料庫使用。
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {message && <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{message}</div>}
          {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

          <div className="grid gap-3 md:grid-cols-2">
            {actions.map((action) => (
              <div key={action.key} className="rounded-lg border p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  {action.danger ? <Trash2 className="mt-1 h-4 w-4 text-red-500" /> : <Database className="mt-1 h-4 w-4 text-muted-foreground" />}
                </div>
                <button
                  type="button"
                  onClick={() => void runAction(action)}
                  disabled={busyKey !== null}
                  className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${
                    action.danger
                      ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                      : "border bg-background hover:bg-muted"
                  }`}
                >
                  {busyKey === action.key ? "處理中..." : action.title}
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Admin() {
  const [auth, setAuth] = useState<AuthStatus | null>(null);
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const [stats, searchEvents, conversations, drafts] = await Promise.all([
        fetchJson<Stats>("/api/admin/stats"),
        fetchJson<SearchEvent[]>("/api/admin/search-events"),
        fetchJson<Conversation[]>("/api/admin/ccugpt-conversations"),
        fetchJson<ContentDraft[]>("/api/admin/content-drafts"),
      ]);
      setData({ stats, searchEvents, conversations, drafts });
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.status === 401) {
        setAuth((current) => ({ authenticated: false, passwordConfigured: current?.passwordConfigured ?? true }));
      }
      setError(err instanceof Error ? err.message : "後台資料載入失敗");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    setCheckingAuth(true);
    try {
      const status = await fetchJson<AuthStatus>("/api/admin/me");
      setAuth(status);
      if (status.authenticated) {
        await load();
      }
    } catch {
      setAuth({ authenticated: false, passwordConfigured: false });
    } finally {
      setCheckingAuth(false);
    }
  }, [load]);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  const login = async (password: string) => {
    await fetchJson<{ ok: true }>("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setAuth({ authenticated: true, passwordConfigured: true });
    await load();
  };

  const logout = async () => {
    await fetchJson<{ ok: true }>("/api/admin/logout", { method: "POST" });
    setData(null);
    setAuth((current) => ({ authenticated: false, passwordConfigured: current?.passwordConfigured ?? true }));
  };

  if (checkingAuth) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">檢查登入狀態中...</div>;
  }

  if (!auth?.authenticated) {
    return <LoginForm passwordConfigured={auth?.passwordConfigured ?? false} onLogin={login} />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">管理後台</h1>
          <p className="mt-1 text-sm text-muted-foreground">搜尋紀錄、CCUGPT 對話與使用概況</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void load(true)}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            重新整理
          </button>
          <button
            type="button"
            onClick={() => void logout()}
            className="inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <LogOut className="h-4 w-4" />
            登出
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && !data ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">載入中...</div>
      ) : data ? (
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">總覽</TabsTrigger>
            <TabsTrigger value="search">搜尋紀錄 ({data.searchEvents.length})</TabsTrigger>
            <TabsTrigger value="ccugpt">CCUGPT 對話 ({data.conversations.length})</TabsTrigger>
            <TabsTrigger value="content">內容維護</TabsTrigger>
            <TabsTrigger value="drafts">修改紀錄 ({data.drafts.length})</TabsTrigger>
            <TabsTrigger value="maintenance">資料管理</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab stats={data.stats} />
          </TabsContent>

          <TabsContent value="search">
            <SearchTab events={data.searchEvents} />
          </TabsContent>

          <TabsContent value="ccugpt">
            <CCUGPTTab conversations={data.conversations} />
          </TabsContent>

          <TabsContent value="content">
            <ContentMaintenanceTab onSaved={() => load(true)} />
          </TabsContent>

          <TabsContent value="drafts">
            <DraftsTab drafts={data.drafts} />
          </TabsContent>

          <TabsContent value="maintenance">
            <MaintenanceTab onChanged={() => load(true)} />
          </TabsContent>
        </Tabs>
      ) : (
        <EmptyState title="後台資料無法載入" description="請確認 Express 後端已啟動，且 /api/admin/* 沒有被 Vite fallback 成 index.html。" />
      )}
    </div>
  );
}
