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

type ContentType = "office" | "department" | "task" | "student_guide_section";

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
  result?: Record<string, number>;
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
  guide_id: "指南類型",
  title_zh: "中文章節標題",
  title_en: "英文章節標題",
  categoryId: "章節分類",
  tags_zh: "中文標籤",
  tags_en: "英文標籤",
  summary_zh: "中文摘要",
  summary_en: "英文摘要",
  sourceReferences: "資料來源",
  relatedTaskIds: "相關任務指引",
  blocks: "章節內容區塊",
  order_index: "顯示順序",
};

function fieldLabel(key: string) {
  return FIELD_LABELS[key] ?? "其他欄位";
}

function typeLabel(type: ContentType) {
  if (type === "office") return "行政單位";
  if (type === "department") return "系所單位";
  if (type === "student_guide_section") return "新生指南章節";
  return "任務流程";
}

const CONTENT_TYPE_FILTERS: Array<{ value: "all" | ContentType; label: string }> = [
  { value: "all", label: "全部資料類型" },
  { value: "task", label: "任務流程 Task" },
  { value: "department", label: "系所單位 Department" },
  { value: "office", label: "行政單位 Office" },
  { value: "student_guide_section", label: "新生指南章節 Student Guide Section" },
];

function makeContentTemplate(type: ContentType, id: string): Record<string, unknown> {
  if (type === "student_guide_section") {
    return {
      id,
      guide_id: "degree",
      title_zh: "",
      title_en: "",
      categoryId: "before_arrival",
      tags_zh: [""],
      tags_en: [""],
      summary_zh: "",
      summary_en: "",
      sourceReferences: [],
      relatedTaskIds: [],
      blocks: [
        {
          type: "paragraph",
          content_zh: "",
          content_en: "",
        },
      ],
      order_index: 999,
    };
  }

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

type GuideBlock = Record<string, unknown>;
type GuideBlockType = "paragraph" | "note" | "checklist" | "timeline" | "table" | "links" | "contact";

const guideCategoryOptions = [
  { id: "before_arrival", label: "抵達前 / Before Arrival" },
  { id: "before_departure", label: "出發前 / Before Departure" },
  { id: "visa_arc", label: "簽證與 ARC / Visa & ARC" },
  { id: "visa_insurance", label: "簽證與保險 / Visa & Insurance" },
  { id: "registration", label: "註冊 / Registration" },
  { id: "payment_fees", label: "繳費與費用 / Payment & Fees" },
  { id: "accommodation", label: "住宿 / Accommodation" },
  { id: "health_insurance", label: "健康與保險 / Health & Insurance" },
  { id: "campus_life", label: "校園生活 / Campus Life" },
  { id: "postal_account", label: "郵局帳戶 / Postal Savings Account" },
  { id: "safety_regulations", label: "安全與法規 / Safety & Regulations" },
  { id: "anti_fraud", label: "防詐騙 / Anti-Fraud" },
  { id: "anti_sexual_harassment", label: "反性騷擾 / Anti-Sexual Harassment" },
  { id: "orientation", label: "報到與說明會 / Orientation" },
  { id: "course_selection", label: "選課 / Course Selection" },
  { id: "arc", label: "ARC" },
  { id: "end_exchange", label: "離校程序 / End of Exchange" },
];

function readAdminString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function readAdminNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function readRecordArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null && !Array.isArray(item)) : [];
}

function readStringList(value: unknown) {
  return Array.isArray(value) ? value.map((item) => String(item ?? "")) : [];
}

function updateRecordListItem(
  items: Record<string, unknown>[],
  index: number,
  key: string,
  value: unknown
) {
  return items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item));
}

function moveArrayItem<T>(items: T[], index: number, direction: -1 | 1) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(index, 1);
  next.splice(nextIndex, 0, item);
  return next;
}

function FieldInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border px-3 py-2 text-sm"
      />
    </label>
  );
}

function FieldTextarea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-muted-foreground">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="w-full rounded-md border px-3 py-2 text-sm"
      />
    </label>
  );
}

function StringListEditor({
  title,
  placeholder,
  value,
  onChange,
}: {
  title: string;
  placeholder?: string;
  value: unknown;
  onChange: (next: string[]) => void;
}) {
  const items = readStringList(value);
  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold">{title}</div>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            value={item}
            placeholder={placeholder}
            onChange={(event) => onChange(items.map((entry, itemIndex) => (itemIndex === index ? event.target.value : entry)))}
            className="min-w-0 flex-1 rounded-md border px-3 py-2 text-sm"
          />
          <button type="button" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} className="rounded-md border px-3 py-2 text-sm text-red-700 hover:bg-red-50">
            刪除
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, ""])} className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted">
        新增
      </button>
    </div>
  );
}

function SourceReferencesEditor({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (next: Record<string, unknown>[]) => void;
}) {
  const items = readRecordArray(value);
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="rounded-md border bg-muted/20 p-3">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold">來源 {index + 1}</span>
            <button type="button" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} className="text-xs font-semibold text-red-700 hover:underline">
              刪除來源
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <FieldInput label="中文文件名稱" value={readAdminString(item.documentTitle_zh)} onChange={(next) => onChange(updateRecordListItem(items, index, "documentTitle_zh", next))} />
            <FieldInput label="英文文件名稱" value={readAdminString(item.documentTitle_en)} onChange={(next) => onChange(updateRecordListItem(items, index, "documentTitle_en", next))} />
            <FieldInput label="頁數" value={readAdminString(item.pages)} placeholder="p.19-p.20" onChange={(next) => onChange(updateRecordListItem(items, index, "pages", next))} />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { documentTitle_zh: "國際學生手冊", documentTitle_en: "International Students Handbook", pages: "" }])}
        className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
      >
        新增來源
      </button>
    </div>
  );
}

function createBlock(type: GuideBlockType): GuideBlock {
  if (type === "note") return { type, tone: "info", content_zh: "", content_en: "" };
  if (type === "checklist") return { type, items: [{ zh: "", en: "" }] };
  if (type === "timeline") return { type, items: [{ date: "", event_zh: "", event_en: "" }] };
  if (type === "table") {
    return {
      type,
      columns: [
        { key: "item", label_zh: "項目", label_en: "Item" },
        { key: "detail", label_zh: "說明", label_en: "Detail" },
      ],
      rows: [{ item: { zh: "", en: "" }, detail: { zh: "", en: "" } }],
    };
  }
  if (type === "links") return { type, links: [{ url: "", label_zh: "", label_en: "" }] };
  if (type === "contact") return { type, name_zh: "", name_en: "", email: "", phone: "", location_zh: "", location_en: "", links: [] };
  return { type: "paragraph", content_zh: "", content_en: "" };
}

function LinksListEditor({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (next: Record<string, unknown>[]) => void;
}) {
  const links = readRecordArray(value);
  return (
    <div className="space-y-3">
      {links.map((link, index) => (
        <div key={index} className="rounded-md border bg-white p-3">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold">連結 {index + 1}</span>
            <button type="button" onClick={() => onChange(links.filter((_, itemIndex) => itemIndex !== index))} className="text-xs font-semibold text-red-700 hover:underline">
              刪除連結
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <FieldInput label="URL" value={readAdminString(link.url)} onChange={(next) => onChange(updateRecordListItem(links, index, "url", next))} />
            <FieldInput label="中文按鈕名稱" value={readAdminString(link.label_zh)} onChange={(next) => onChange(updateRecordListItem(links, index, "label_zh", next))} />
            <FieldInput label="英文按鈕名稱" value={readAdminString(link.label_en)} onChange={(next) => onChange(updateRecordListItem(links, index, "label_en", next))} />
          </div>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...links, { url: "", label_zh: "", label_en: "" }])} className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted">
        新增連結
      </button>
    </div>
  );
}

function JsonTextareaField({
  label,
  value,
  onApply,
  rows = 6,
}: {
  label: string;
  value: unknown;
  onApply: (next: unknown) => void;
  rows?: number;
}) {
  const [text, setText] = useState(() => JSON.stringify(value ?? [], null, 2));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setText(JSON.stringify(value ?? [], null, 2));
  }, [value]);

  return (
    <div className="space-y-2">
      <FieldTextarea label={label} value={text} onChange={setText} rows={rows} />
      {error && <p className="text-xs text-red-700">{error}</p>}
      <button
        type="button"
        onClick={() => {
          try {
            onApply(JSON.parse(text));
            setError(null);
          } catch (err) {
            setError(err instanceof Error ? err.message : "JSON 格式錯誤");
          }
        }}
        className="rounded-md border px-3 py-2 text-xs font-medium hover:bg-muted"
      >
        套用 {label}
      </button>
    </div>
  );
}

function BlockEditor({
  block,
  onChange,
}: {
  block: GuideBlock;
  onChange: (next: GuideBlock) => void;
}) {
  const type = readAdminString(block.type) as GuideBlockType;

  if (type === "note") {
    return (
      <div className="space-y-3">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-muted-foreground">提醒層級</span>
          <select value={readAdminString(block.tone) || "info"} onChange={(event) => onChange({ ...block, tone: event.target.value })} className="w-full rounded-md border px-3 py-2 text-sm">
            <option value="info">info</option>
            <option value="warning">warning</option>
            <option value="danger">danger</option>
          </select>
        </label>
        <FieldTextarea label="中文提醒" value={readAdminString(block.content_zh)} onChange={(next) => onChange({ ...block, content_zh: next })} />
        <FieldTextarea label="英文提醒" value={readAdminString(block.content_en)} onChange={(next) => onChange({ ...block, content_en: next })} />
      </div>
    );
  }

  if (type === "checklist") {
    const items = readRecordArray(block.items);
    return (
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-md border bg-white p-3">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold">項目 {index + 1}</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => onChange({ ...block, items: moveArrayItem(items, index, -1) })} className="text-xs hover:underline">上移</button>
                <button type="button" onClick={() => onChange({ ...block, items: moveArrayItem(items, index, 1) })} className="text-xs hover:underline">下移</button>
                <button type="button" onClick={() => onChange({ ...block, items: items.filter((_, itemIndex) => itemIndex !== index) })} className="text-xs text-red-700 hover:underline">刪除</button>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <FieldTextarea label="中文項目" value={readAdminString(item.zh)} onChange={(next) => onChange({ ...block, items: updateRecordListItem(items, index, "zh", next) })} rows={2} />
              <FieldTextarea label="英文項目" value={readAdminString(item.en)} onChange={(next) => onChange({ ...block, items: updateRecordListItem(items, index, "en", next) })} rows={2} />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => onChange({ ...block, items: [...items, { zh: "", en: "" }] })} className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted">新增項目</button>
      </div>
    );
  }

  if (type === "timeline") {
    const items = readRecordArray(block.items);
    return (
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-md border bg-white p-3">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold">事件 {index + 1}</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => onChange({ ...block, items: moveArrayItem(items, index, -1) })} className="text-xs hover:underline">上移</button>
                <button type="button" onClick={() => onChange({ ...block, items: moveArrayItem(items, index, 1) })} className="text-xs hover:underline">下移</button>
                <button type="button" onClick={() => onChange({ ...block, items: items.filter((_, itemIndex) => itemIndex !== index) })} className="text-xs text-red-700 hover:underline">刪除</button>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-[180px_1fr_1fr]">
              <FieldInput label="日期" value={readAdminString(item.date)} onChange={(next) => onChange({ ...block, items: updateRecordListItem(items, index, "date", next) })} />
              <FieldTextarea label="中文事件" value={readAdminString(item.event_zh)} onChange={(next) => onChange({ ...block, items: updateRecordListItem(items, index, "event_zh", next) })} rows={2} />
              <FieldTextarea label="英文事件" value={readAdminString(item.event_en)} onChange={(next) => onChange({ ...block, items: updateRecordListItem(items, index, "event_en", next) })} rows={2} />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => onChange({ ...block, items: [...items, { date: "", event_zh: "", event_en: "" }] })} className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted">新增事件</button>
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="space-y-3">
        <p className="rounded-md bg-muted p-3 text-xs text-muted-foreground">表格較複雜，目前請以 JSON 格式編輯。</p>
        <JsonTextareaField label="columns JSON" value={block.columns ?? []} onApply={(next) => onChange({ ...block, columns: next })} rows={6} />
        <JsonTextareaField label="rows JSON" value={block.rows ?? []} onApply={(next) => onChange({ ...block, rows: next })} rows={8} />
      </div>
    );
  }

  if (type === "links") {
    return <LinksListEditor value={block.links} onChange={(next) => onChange({ ...block, links: next })} />;
  }

  if (type === "contact") {
    return (
      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <FieldInput label="中文名稱" value={readAdminString(block.name_zh)} onChange={(next) => onChange({ ...block, name_zh: next })} />
          <FieldInput label="英文名稱" value={readAdminString(block.name_en)} onChange={(next) => onChange({ ...block, name_en: next })} />
          <FieldInput label="Email" value={readAdminString(block.email)} onChange={(next) => onChange({ ...block, email: next })} />
          <FieldInput label="電話" value={readAdminString(block.phone)} onChange={(next) => onChange({ ...block, phone: next })} />
          <FieldInput label="中文地點" value={readAdminString(block.location_zh)} onChange={(next) => onChange({ ...block, location_zh: next })} />
          <FieldInput label="英文地點" value={readAdminString(block.location_en)} onChange={(next) => onChange({ ...block, location_en: next })} />
        </div>
        <div className="rounded-md border bg-muted/20 p-3">
          <div className="mb-2 text-sm font-semibold">聯絡卡連結</div>
          <LinksListEditor value={block.links} onChange={(next) => onChange({ ...block, links: next })} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <FieldTextarea label="中文內容" value={readAdminString(block.content_zh)} onChange={(next) => onChange({ ...block, content_zh: next })} />
      <FieldTextarea label="英文內容" value={readAdminString(block.content_en)} onChange={(next) => onChange({ ...block, content_en: next })} />
    </div>
  );
}

function BlocksEditor({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (next: GuideBlock[]) => void;
}) {
  const blocks = readRecordArray(value);
  const [newBlockType, setNewBlockType] = useState<GuideBlockType>("paragraph");

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        const type = readAdminString(block.type) || "paragraph";
        return (
          <details key={index} open className="rounded-md border bg-muted/20 p-3">
            <summary className="cursor-pointer list-none">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <Badge variant="outline">{type}</Badge>
                  <span className="ml-2 text-sm font-semibold">區塊 {index + 1}</span>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={(event) => { event.preventDefault(); onChange(moveArrayItem(blocks, index, -1)); }} className="rounded-md border px-2 py-1 text-xs hover:bg-white">上移</button>
                  <button type="button" onClick={(event) => { event.preventDefault(); onChange(moveArrayItem(blocks, index, 1)); }} className="rounded-md border px-2 py-1 text-xs hover:bg-white">下移</button>
                  <button type="button" onClick={(event) => { event.preventDefault(); onChange(blocks.filter((_, itemIndex) => itemIndex !== index)); }} className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50">刪除</button>
                </div>
              </div>
            </summary>
            <div className="mt-4">
              <BlockEditor
                block={block}
                onChange={(next) => onChange(blocks.map((entry, itemIndex) => (itemIndex === index ? next : entry)))}
              />
            </div>
          </details>
        );
      })}
      <div className="flex flex-wrap gap-2 rounded-md border p-3">
        <select value={newBlockType} onChange={(event) => setNewBlockType(event.target.value as GuideBlockType)} className="rounded-md border px-3 py-2 text-sm">
          <option value="paragraph">paragraph</option>
          <option value="note">note</option>
          <option value="checklist">checklist</option>
          <option value="timeline">timeline</option>
          <option value="table">table</option>
          <option value="links">links</option>
          <option value="contact">contact</option>
        </select>
        <button type="button" onClick={() => onChange([...blocks, createBlock(newBlockType)])} className="rounded-md bg-navy px-3 py-2 text-sm font-semibold text-white hover:bg-navy-light">
          新增區塊
        </button>
      </div>
    </div>
  );
}

function StudentGuideSectionEditor({
  value,
  onChange,
}: {
  value: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  const [jsonText, setJsonText] = useState(() => JSON.stringify(value, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    setJsonText(JSON.stringify(value, null, 2));
  }, [value]);

  const update = (key: string, nextValue: unknown) => {
    onChange({ ...value, [key]: nextValue });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border p-4">
        <h3 className="mb-3 font-semibold">基本資料</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-muted-foreground">指南類型</span>
            <select value={readAdminString(value.guide_id) || "degree"} onChange={(event) => update("guide_id", event.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
              <option value="degree">學位生新生指南</option>
              <option value="exchange">交換生新生指南</option>
            </select>
          </label>
          <FieldInput label="顯示順序" type="number" value={readAdminNumber(value.order_index, 999)} onChange={(next) => update("order_index", Number(next))} />
          <FieldInput label="中文章節標題" value={readAdminString(value.title_zh)} onChange={(next) => update("title_zh", next)} />
          <FieldInput label="英文章節標題" value={readAdminString(value.title_en)} onChange={(next) => update("title_en", next)} />
          <label className="block md:col-span-2">
            <span className="mb-1 block text-xs font-semibold text-muted-foreground">章節分類</span>
            <select value={readAdminString(value.categoryId) || "before_arrival"} onChange={(event) => update("categoryId", event.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
              {guideCategoryOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </label>
          <FieldTextarea label="中文摘要" value={readAdminString(value.summary_zh)} onChange={(next) => update("summary_zh", next)} />
          <FieldTextarea label="英文摘要" value={readAdminString(value.summary_en)} onChange={(next) => update("summary_en", next)} />
        </div>
      </div>

      <div className="rounded-md border p-4">
        <h3 className="mb-3 font-semibold">標籤</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <StringListEditor title="中文標籤" value={value.tags_zh} onChange={(next) => update("tags_zh", next)} />
          <StringListEditor title="英文標籤" value={value.tags_en} onChange={(next) => update("tags_en", next)} />
        </div>
      </div>

      <div className="rounded-md border p-4">
        <h3 className="mb-3 font-semibold">來源與相關任務</h3>
        <div className="space-y-4">
          <SourceReferencesEditor value={value.sourceReferences} onChange={(next) => update("sourceReferences", next)} />
          <StringListEditor title="相關任務 ID" placeholder="arc_resident_visa" value={value.relatedTaskIds} onChange={(next) => update("relatedTaskIds", next)} />
        </div>
      </div>

      <div className="rounded-md border p-4">
        <h3 className="mb-3 font-semibold">章節內容區塊</h3>
        <BlocksEditor value={value.blocks} onChange={(next) => update("blocks", next)} />
      </div>

      <details className="rounded-md border p-4">
        <summary className="cursor-pointer font-semibold">進階 JSON 編輯</summary>
        <div className="mt-3 space-y-3">
          <textarea value={jsonText} onChange={(event) => setJsonText(event.target.value)} rows={14} className="w-full rounded-md border px-3 py-2 font-mono text-xs" />
          {jsonError && <p className="text-sm text-red-700">{jsonError}</p>}
          <button
            type="button"
            onClick={() => {
              try {
                const parsed = JSON.parse(jsonText) as unknown;
                if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
                  setJsonError("JSON 必須是一個物件。");
                  return;
                }
                setJsonError(null);
                onChange(parsed as Record<string, unknown>);
              } catch (err) {
                setJsonError(err instanceof Error ? err.message : "JSON 格式錯誤");
              }
            }}
            className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            套用 JSON
          </button>
        </div>
      </details>
    </div>
  );
}

function ContentMaintenanceTab({ onSaved }: { onSaved: () => Promise<void> }) {
  const [contentMode, setContentMode] = useState<"edit" | "create">("edit");
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"all" | ContentType>("all");
  const [newType, setNewType] = useState<ContentType>("task");
  const [newId, setNewId] = useState("");
  const [items, setItems] = useState<ContentItem[]>([]);
  const [selected, setSelected] = useState<ContentItem | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [note, setNote] = useState("");
  const [loadingItems, setLoadingItems] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const searchItems = async () => {
    setLoadingItems(true);
    setMessage(null);
    try {
      const params = new URLSearchParams();
      const trimmedQuery = query.trim();
      if (trimmedQuery) params.set("query", trimmedQuery);
      if (searchType !== "all") params.set("type", searchType);
      const endpoint = `/api/admin/content-items${params.toString() ? `?${params.toString()}` : ""}`;
      const result = await fetchJson<ContentItem[]>(endpoint);
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

  useEffect(() => {
    if (contentMode === "edit") void searchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchType]);

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

  const deleteSelectedItem = async () => {
    if (!selected || selected.isNew) return;

    const confirmed = window.confirm(
      `確定要刪除這筆資料嗎？\n\n${selected.label}\n\n刪除後網站將不再顯示，但修改紀錄會保留。`
    );
    if (!confirmed) return;

    setDeleting(true);
    setMessage(null);
    try {
      await fetchJson<{ ok: true }>(
        `/api/admin/content-items/${encodeURIComponent(selected.type)}/${encodeURIComponent(selected.id)}`,
        { method: "DELETE" }
      );
      setMessage("已刪除這筆資料，網站內容會改由 Neon 資料庫的 active 資料呈現。");
      setSelected(null);
      setFormData({});
      setNote("");
      await onSaved();
      await searchItems();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "刪除資料失敗");
    } finally {
      setDeleting(false);
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
                <option value="department">系所單位 Department</option>
                <option value="office">行政單位 Office</option>
                <option value="student_guide_section">新生指南章節 Student Guide Section</option>
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
            className={`grid gap-2 sm:grid-cols-[180px_1fr_auto] ${contentMode === "edit" ? "" : "hidden"}`}
            onSubmit={(event) => {
              event.preventDefault();
              void searchItems();
            }}
          >
            <select
              value={searchType}
              onChange={(event) => setSearchType(event.target.value as "all" | ContentType)}
              className="rounded-md border bg-background px-3 py-2 text-sm"
              aria-label="篩選資料類型"
            >
              {CONTENT_TYPE_FILTERS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
              {selected.type === "student_guide_section" ? (
                <StudentGuideSectionEditor value={formData} onChange={setFormData} />
              ) : (
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
              )}

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

              <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void applyContentUpdate()}
                disabled={saving || deleting || changedFields.length === 0}
                className="rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "處理中..." : selected.isNew ? "新增正式內容" : "更新正式內容"}
              </button>

              {!selected.isNew && (
                <button
                  type="button"
                  onClick={() => void deleteSelectedItem()}
                  disabled={saving || deleting}
                  className="rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleting ? "刪除中..." : "刪除這筆資料"}
                </button>
              )}
              </div>
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

// ─── Student Guide Sync Status Card ──────────────────────────────────────────

interface SyncStatus {
  static_count: number;
  db_count: number;
  stale_count: number;
  missing_count: number;
  manually_changed_count: number;
  sample_stale_ids: string[];
  sample_missing_ids: string[];
  sample_manually_changed_ids: string[];
}

interface DuplicateReportEntry {
  section_id: string;
  guide_id: string;
  duplicate_block_keys: string[];
  duplicate_count: number;
}

interface DuplicateReport {
  total_sections_checked: number;
  sections_with_duplicates: number;
  report: DuplicateReportEntry[];
}

function StudentGuideSyncCard() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [dupReport, setDupReport] = useState<DuplicateReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDup, setLoadingDup] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [resetId, setResetId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDup, setShowDup] = useState(false);

  const loadStatus = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const data = await fetchJson<SyncStatus>("/api/admin/student-guide-sync-status");
      setSyncStatus(data);
    } catch {
      setError("無法載入同步狀態");
    } finally {
      setLoading(false);
    }
  };

  const loadDupReport = async () => {
    setLoadingDup(true);
    try {
      const data = await fetchJson<DuplicateReport>("/api/admin/student-guide-duplicate-report");
      setDupReport(data);
      setShowDup(true);
    } catch {
      setError("無法載入重複 blocks 報告");
    } finally {
      setLoadingDup(false);
    }
  };

  const doSync = async () => {
    if (!window.confirm("確定要同步目前程式內建的新生指南 sections 到資料庫嗎？已被人工修改過的 sections 會跳過。")) return;
    setSyncing(true);
    setMessage(null);
    setError(null);
    try {
      const result = await fetchJson<MaintenanceResult>("/api/admin/maintenance/sync-static-content", { method: "POST" });
      const summary = result.result;
      const summaryText = summary ? Object.entries(summary).map(([k, v]) => `${k}: ${v}`).join(", ") : "已完成";
      setMessage(`同步完成。${summaryText}`);
      await loadStatus();
    } catch {
      setError("同步失敗");
    } finally {
      setSyncing(false);
    }
  };

  const doResetToStatic = async (sectionId: string) => {
    if (!window.confirm(`確定要將 ${sectionId} 重設為程式內建資料嗎？這將覆蓋後台人工修改的內容。`)) return;
    setResetId(sectionId);
    setMessage(null);
    setError(null);
    try {
      await fetchJson<{ ok: true }>(`/api/admin/student-guide-sections/${sectionId}/reset-to-static`, { method: "POST" });
      setMessage(`已將 ${sectionId} 重設為 static 資料。`);
      await loadStatus();
    } catch {
      setError(`重設 ${sectionId} 失敗`);
    } finally {
      setResetId(null);
    }
  };

  useEffect(() => { void loadStatus(); }, []);

  const statItems = syncStatus
    ? [
        { label: "Static sections", value: syncStatus.static_count, color: "text-foreground" },
        { label: "DB sections", value: syncStatus.db_count, color: "text-foreground" },
        { label: "Stale (outdated)", value: syncStatus.stale_count, color: syncStatus.stale_count > 0 ? "text-amber-600 font-semibold" : "text-foreground" },
        { label: "Missing in DB", value: syncStatus.missing_count, color: syncStatus.missing_count > 0 ? "text-red-600 font-semibold" : "text-foreground" },
        { label: "Manually changed", value: syncStatus.manually_changed_count, color: syncStatus.manually_changed_count > 0 ? "text-blue-600 font-semibold" : "text-foreground" },
      ]
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <RefreshCw className="h-4 w-4" />
          新生指南 Sections 同步狀態
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          顯示 static code 與資料庫中新生指南 sections 的同步情況。若某 section 曾被後台修改過，系統會保護該 section 不自動覆蓋，需人工確認。
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{message}</div>}
        {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        {/* Stats grid */}
        {syncStatus && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {statItems.map((s) => (
              <div key={s.label} className="rounded-lg border p-3 text-center">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Sample IDs */}
        {syncStatus && (syncStatus.sample_stale_ids.length > 0 || syncStatus.sample_missing_ids.length > 0 || syncStatus.sample_manually_changed_ids.length > 0) && (
          <div className="space-y-2 text-xs">
            {syncStatus.sample_stale_ids.length > 0 && (
              <div>
                <span className="font-semibold text-amber-600">Stale: </span>
                <span className="text-muted-foreground">{syncStatus.sample_stale_ids.join(", ")}</span>
              </div>
            )}
            {syncStatus.sample_missing_ids.length > 0 && (
              <div>
                <span className="font-semibold text-red-600">Missing: </span>
                <span className="text-muted-foreground">{syncStatus.sample_missing_ids.join(", ")}</span>
              </div>
            )}
            {syncStatus.sample_manually_changed_ids.length > 0 && (
              <div>
                <span className="font-semibold text-blue-600">Manually changed: </span>
                <span className="text-muted-foreground">{syncStatus.sample_manually_changed_ids.join(", ")}</span>
                <p className="mt-1 text-muted-foreground/70">若這些 sections 仍有重複 blocks，可用下方「重設為 Static」覆蓋後台修改。</p>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void loadStatus()}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-2 text-sm font-semibold hover:bg-muted disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            重新檢查同步狀態
          </button>
          <button
            type="button"
            onClick={() => void doSync()}
            disabled={syncing || loading}
            className="inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-2 text-sm font-semibold hover:bg-muted disabled:opacity-60"
          >
            <Database className="h-3.5 w-3.5" />
            {syncing ? "同步中..." : "同步 Static Content"}
          </button>
          <button
            type="button"
            onClick={() => void loadDupReport()}
            disabled={loadingDup}
            className="inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-2 text-sm font-semibold hover:bg-muted disabled:opacity-60"
          >
            <AlertCircle className="h-3.5 w-3.5" />
            {loadingDup ? "檢查中..." : "檢查重複 Blocks"}
          </button>
        </div>

        {/* Duplicate report */}
        {showDup && dupReport && (
          <div className="rounded-lg border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">
                重複 Blocks 報告 — 共 {dupReport.total_sections_checked} 個 sections，
                {dupReport.sections_with_duplicates === 0 ? (
                  <span className="text-green-600"> 無重複 ✓</span>
                ) : (
                  <span className="text-red-600"> {dupReport.sections_with_duplicates} 個有重複</span>
                )}
              </h4>
              <button type="button" onClick={() => setShowDup(false)} className="text-xs text-muted-foreground hover:underline">收起</button>
            </div>
            {dupReport.report.map((entry) => (
              <div key={entry.section_id} className="rounded border border-red-200 bg-red-50 p-3 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-sm font-semibold text-red-700">{entry.section_id}</span>
                    <span className="ml-2 text-xs text-muted-foreground">({entry.guide_id} guide) — {entry.duplicate_count} 個重複 block</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => void doResetToStatic(entry.section_id)}
                    disabled={resetId === entry.section_id}
                    className="shrink-0 rounded-md border border-red-300 bg-white px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                  >
                    {resetId === entry.section_id ? "重設中..." : "重設為 Static"}
                  </button>
                </div>
                <div className="text-xs text-muted-foreground break-all">
                  {entry.duplicate_block_keys.map((key, i) => (
                    <span key={i} className="mr-1 inline-block rounded bg-red-100 px-1.5 py-0.5 font-mono">{key.slice(0, 80)}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reset to static for manually changed sections */}
        {syncStatus && syncStatus.sample_manually_changed_ids.length > 0 && (
          <div className="rounded-lg border p-3 space-y-2">
            <h4 className="text-sm font-semibold text-blue-700">人工修改過的 Sections — 可強制重設為 Static</h4>
            <p className="text-xs text-muted-foreground">以下 sections 曾被後台修改過，若需清除修改內容、回復到程式內建版本，可點選「重設為 Static」。</p>
            <div className="flex flex-wrap gap-2">
              {syncStatus.sample_manually_changed_ids.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => void doResetToStatic(id)}
                  disabled={resetId === id}
                  className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-60"
                >
                  {resetId === id ? "重設中..." : id}
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

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
    {
      key: "sync-static",
      title: "同步程式內建內容",
      description: "把目前程式碼內建的 offices、departments、tasks、新生指南章節補進資料庫；已被後台人工修改過的資料會跳過，避免覆蓋國際處維護內容。",
      endpoint: "/api/admin/maintenance/sync-static-content",
      method: "POST",
      confirmText: "確定要同步目前程式內建內容到資料庫嗎？已被人工修改過的資料會保留。",
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
      const summary = result.deleted ?? result.result;
      const summaryText = summary
        ? Object.entries(summary)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")
        : "已完成";
      setMessage(`${action.title}完成。${summaryText}`);
      await onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失敗");
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="space-y-4">
      <StudentGuideSyncCard />

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
