import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ── Types ────────────────────────────────────────────────────────────────────

interface Stats {
  totalSearches: number;
  totalConversations: number;
  totalMessages: number;
  totalSessions: number;
  topQueries: { query: string; count: number }[];
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

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmt(ts: string) {
  return new Date(ts).toLocaleString("zh-TW", { hour12: false });
}

function roleColor(role: string) {
  return role === "user" ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200";
}

// ── Components ───────────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value.toLocaleString()}</p>
      </CardContent>
    </Card>
  );
}

function OverviewTab({ stats }: { stats: Stats }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="搜尋次數" value={stats.totalSearches} />
        <StatCard label="CCUGPT 對話" value={stats.totalConversations} />
        <StatCard label="CCUGPT 訊息" value={stats.totalMessages} />
        <StatCard label="Sessions" value={stats.totalSessions} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">熱門搜尋關鍵字 Top 10</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 pr-4">#</th>
                <th className="pb-2 pr-4">查詢</th>
                <th className="pb-2 text-right">次數</th>
              </tr>
            </thead>
            <tbody>
              {stats.topQueries.map((q, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-1.5 pr-4 text-muted-foreground">{i + 1}</td>
                  <td className="py-1.5 pr-4 font-medium">{q.query}</td>
                  <td className="py-1.5 text-right">{q.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function SearchTab({ events }: { events: SearchEvent[] }) {
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
                <th className="px-4 py-2 text-right">結果數</th>
                <th className="px-4 py-2 text-right">回應(ms)</th>
                <th className="px-4 py-2">頁面</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-2 whitespace-nowrap text-muted-foreground">{fmt(e.created_at)}</td>
                  <td className="px-4 py-2 max-w-xs truncate font-medium">{e.query}</td>
                  <td className="px-4 py-2">
                    {e.language && <Badge variant="outline">{e.language}</Badge>}
                  </td>
                  <td className="px-4 py-2 text-right">{e.result_count}</td>
                  <td className="px-4 py-2 text-right">{e.response_time_ms ?? "—"}</td>
                  <td className="px-4 py-2 max-w-[140px] truncate text-xs text-muted-foreground">{e.page_path ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function ConversationRow({ conv }: { conv: Conversation }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <tr
        className="cursor-pointer border-b hover:bg-muted/30"
        onClick={() => setOpen((v) => !v)}
      >
        <td className="px-4 py-2 text-muted-foreground whitespace-nowrap">{fmt(conv.created_at)}</td>
        <td className="px-4 py-2">{conv.messages.length} 則</td>
        <td className="px-4 py-2">
          {conv.language && <Badge variant="outline">{conv.language}</Badge>}
        </td>
        <td className="px-4 py-2 text-xs text-muted-foreground">{conv.model ?? "—"}</td>
        <td className="px-4 py-2">
          <Badge variant={conv.status === "active" ? "default" : "secondary"}>{conv.status}</Badge>
        </td>
        <td className="px-4 py-2 text-xs text-muted-foreground truncate max-w-[140px]">{conv.page_path ?? "—"}</td>
        <td className="px-4 py-2 text-muted-foreground">{open ? "▲" : "▼"}</td>
      </tr>
      {open && (
        <tr>
          <td colSpan={7} className="bg-muted/10 px-6 pb-4 pt-2">
            <div className="space-y-2">
              {conv.messages.map((m, i) => (
                <div key={i} className={`rounded border p-3 text-sm ${roleColor(m.role)}`}>
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{m.role}</Badge>
                    <span className="text-xs text-muted-foreground">{fmt(m.created_at)}</span>
                  </div>
                  <p className="whitespace-pre-wrap">{m.content}</p>
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
              {conversations.map((conv) => (
                <ConversationRow key={conv.id} conv={conv} />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Admin() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [searchEvents, setSearchEvents] = useState<SearchEvent[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/search-events").then((r) => r.json()),
      fetch("/api/admin/ccugpt-conversations").then((r) => r.json()),
    ]).then(([s, se, conv]) => {
      setStats(s);
      setSearchEvents(se);
      setConversations(conv);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        載入中...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">管理後台</h1>
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">總覽</TabsTrigger>
          <TabsTrigger value="search">搜尋紀錄 ({searchEvents.length})</TabsTrigger>
          <TabsTrigger value="ccugpt">CCUGPT 對話 ({conversations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {stats && <OverviewTab stats={stats} />}
        </TabsContent>

        <TabsContent value="search">
          <SearchTab events={searchEvents} />
        </TabsContent>

        <TabsContent value="ccugpt">
          <CCUGPTTab conversations={conversations} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
