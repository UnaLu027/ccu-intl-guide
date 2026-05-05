/**
 * CCUGPTWidget — 懸浮客服機器人骨架
 *
 * 使用方式：
 * 1. 目前顯示「即將推出」的佔位按鈕（骨架模式）
 * 2. 當 CCUGPT 研發團隊提供 embed 程式碼後：
 *    - 將 EMBED_READY 改為 true
 *    - 將 embedCode 替換為實際的 <script> 或 <iframe> 程式碼
 *    - 或依研發團隊指示在 useEffect 中載入 script
 *
 * 放置位置：加入 client/src/App.tsx 的最外層即可全站顯示
 * 範例：
 *   import CCUGPTWidget from "@/components/CCUGPTWidget";
 *   // 在 App.tsx return 的最外層加入：
 *   <CCUGPTWidget />
 */

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

function pushGtmEvent(eventName: string, params: Record<string, unknown> = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params,
  });
}

// ─── 設定區（串接時只需修改這裡）────────────────────────────────
const EMBED_READY = false; // 改為 true 即啟用真實 widget
const CCUGPT_ENDPOINT = "https://ccu-intl-guide.onrender.com/mcp"; // MCP endpoint（備查）
// ─────────────────────────────────────────────────────────────────

export default function CCUGPTWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // 當 EMBED_READY 為 true 且 widget 被打開時，動態載入 embed script
  useEffect(() => {
    if (!EMBED_READY || !isOpen || scriptLoaded) return;

    // TODO: 替換為研發團隊提供的實際 script URL
    // const script = document.createElement("script");
    // script.src = "https://ccugpt.ccu.edu.tw/embed.js";
    // script.dataset.endpoint = CCUGPT_ENDPOINT;
    // script.onload = () => setScriptLoaded(true);
    // document.body.appendChild(script);
  }, [isOpen, scriptLoaded]);

  return (
    <>
      {/* 懸浮按鈕 */}
      <button
        onClick={() => {
          const nextOpen = !isOpen;

          if (nextOpen) {
            pushGtmEvent("open_ccugpt_widget", {
              page_path: window.location.pathname,
            });
          }

          setIsOpen(nextOpen);
        }}
        className={`
          fixed bottom-6 right-6 z-50
          flex items-center gap-2 px-4 py-3
          rounded-full shadow-lg
          transition-all duration-200
          ${isOpen
            ? "bg-gray-700 text-white"
            : "bg-[#1a3a6b] text-white hover:bg-[#1a3a6b]/90"
          }
        `}
        aria-label={isOpen ? "Close CCUGPT" : "Open CCUGPT"}
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <MessageCircle className="w-5 h-5" />
        )}
        <span className="text-sm font-medium">
          {isOpen ? "Close" : "Ask CCUGPT"}
        </span>
      </button>

      {/* Widget 面板 */}
      {isOpen && (
        <div
          className={`
            fixed bottom-20 right-6 z-50
            w-80 sm:w-96 h-[500px]
            bg-white rounded-2xl shadow-2xl
            border border-gray-200
            flex flex-col overflow-hidden
            transition-all duration-200
          `}
        >
          {/* Header */}
          <div className="bg-[#1a3a6b] text-white px-4 py-3 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <div>
              <p className="text-sm font-semibold">CCUGPT</p>
              <p className="text-xs opacity-75">CCU International Guide Assistant</p>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-center">
            {EMBED_READY ? (
              // 串接完成後，這裡會被 CCUGPT widget 接管
              // 研發團隊的 embed script 會在這個 div 裡渲染
              <div id="ccugpt-container" className="w-full h-full" />
            ) : (
              // 骨架佔位畫面
              <>
                <div className="w-16 h-16 rounded-full bg-[#1a3a6b]/10 flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-[#1a3a6b]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">
                    AI Assistant Coming Soon
                  </p>
                  <p className="text-sm text-gray-500">
                    CCUGPT integration is in progress.
                    This assistant will help you find campus information,
                    navigate offices, and answer your questions.
                  </p>
                </div>
                <div className="w-full bg-gray-50 rounded-lg p-3 text-left">
                  <p className="text-xs text-gray-500 mb-1">In the meantime, try:</p>
                  <ul className="text-xs text-[#1a3a6b] space-y-1">
                    <li>→ <a href="/tasks" className="hover:underline">Browse Common Tasks</a></li>
                    <li>→ <a href="/offices" className="hover:underline">Find an Office</a></li>
                    <li>→ <a href="/map" className="hover:underline">View Campus Map</a></li>
                  </ul>
                </div>
                <p className="text-xs text-gray-400">
                  Powered by{" "}
                  <a
                    href="https://ccugpt.ccu.edu.tw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-[#1a3a6b]"
                  >
                    CCUGPT
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
