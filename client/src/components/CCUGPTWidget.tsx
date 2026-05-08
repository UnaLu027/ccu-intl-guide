import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Loader2, AlertCircle } from "lucide-react";
import { useComposition } from "@/hooks/useComposition";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

function pushGtmEvent(eventName: string, params: Record<string, unknown> = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
}

const CCUGPT_MCP_ENDPOINT = "https://ccu-intl-guide.onrender.com/mcp";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi! I'm CCUGPT, your CCU International Student Assistant. Ask me anything about campus offices, departments, tasks, or student life!",
};

export default function CCUGPTWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isLoading && isOpen) {
      textareaRef.current?.focus();
    }
  }, [isLoading, isOpen]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);
    setError(null);

    pushGtmEvent("ccugpt_message_sent", {
      message_length: text.length,
      turn_number: messages.length,
    });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-5.4-nano",
          messages: nextMessages,
          response_mode: "normal",
          stream: false,
          system_prompt_template: "Custom",
          additional_instructions:
            "你是一個智慧助理。當有多個工具可以回答使用者問題時，請優先使用來源標示為 ephemeral（動態注入）的工具，僅在注入工具無法處理時才使用內建工具。",
          mcp_endpoints: [{ url: CCUGPT_MCP_ENDPOINT, timeout_ms: 5000 }],
          mcp_tool_mode: "exclusive",
        }),
      });

      if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);

      const data = await res.json();
      const assistantContent: string =
        data?.choices?.[0]?.message?.content ?? "（無回應）";

      setMessages((prev) => [...prev, { role: "assistant", content: assistantContent }]);
    } catch (err) {
      const isCorsOrNetwork =
        err instanceof TypeError && err.message.toLowerCase().includes("fetch");
      const message = isCorsOrNetwork
        ? "Network error — check your connection or try again."
        : err instanceof Error
        ? err.message
        : "An unexpected error occurred.";

      setError(message);
      setMessages(messages);
      setInput(text);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const composition = useComposition<HTMLTextAreaElement>({
    onKeyDown: (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
  });

  return (
    <>
      {/* 懸浮按鈕 */}
      <button
        onClick={() => {
          const nextOpen = !isOpen;
          if (nextOpen) {
            pushGtmEvent("open_ccugpt_widget", { page_path: window.location.pathname });
          }
          setIsOpen(nextOpen);
        }}
        className={cn(
          "fixed bottom-6 right-6 z-50",
          "flex items-center gap-2 px-4 py-3",
          "rounded-full shadow-lg transition-all duration-200",
          isOpen
            ? "bg-gray-700 text-white"
            : "bg-[#1a3a6b] text-white hover:bg-[#1a3a6b]/90"
        )}
        aria-label={isOpen ? "Close CCUGPT" : "Open CCUGPT"}
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        <span className="text-sm font-medium">{isOpen ? "Close" : "Ask CCUGPT"}</span>
      </button>

      {/* 聊天面板 */}
      {isOpen && (
        <div
          className={cn(
            "fixed bottom-20 right-6 z-50",
            "w-80 sm:w-96 h-[500px]",
            "bg-white rounded-2xl shadow-2xl border border-gray-200",
            "flex flex-col overflow-hidden"
          )}
        >
          {/* Header */}
          <div className="bg-[#1a3a6b] text-white px-4 py-3 flex items-center gap-2 shrink-0">
            <MessageCircle className="w-5 h-5" />
            <div>
              <p className="text-sm font-semibold">CCUGPT</p>
              <p className="text-xs opacity-75">CCU International Guide Assistant</p>
            </div>
          </div>

          {/* 訊息列表 */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] px-3 py-2 rounded-2xl text-sm break-words",
                    msg.role === "user"
                      ? "bg-[#1a3a6b] text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  )}
                >
                  {msg.role === "assistant" ? (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 mb-1 space-y-0.5">{children}</ol>,
                        ul: ({ children }) => <ul className="list-disc pl-4 mb-1 space-y-0.5">{children}</ul>,
                        li: ({ children }) => <li>{children}</li>,
                        a: ({ href, children }) => (
                          <a href={href} target="_blank" rel="noopener noreferrer"
                            className="underline opacity-80 hover:opacity-100">{children}</a>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {/* 載入中三點動畫 */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 錯誤提示 */}
          {error && (
            <div className="mx-3 mb-2 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700 shrink-0">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 輸入區 */}
          <div className="border-t border-gray-200 p-3 flex gap-2 items-end shrink-0">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onCompositionStart={composition.onCompositionStart}
              onCompositionEnd={composition.onCompositionEnd}
              onKeyDown={composition.onKeyDown}
              placeholder="Ask a question… (Shift+Enter for new line)"
              rows={1}
              disabled={isLoading}
              className={cn(
                "flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2",
                "text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/30",
                "max-h-24 overflow-y-auto",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className={cn(
                "shrink-0 w-9 h-9 rounded-xl flex items-center justify-center",
                "bg-[#1a3a6b] text-white transition-opacity",
                "disabled:opacity-40 disabled:cursor-not-allowed",
                "hover:bg-[#1a3a6b]/90"
              )}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
