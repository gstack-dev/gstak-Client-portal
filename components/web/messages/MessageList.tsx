import { FileText, Eye } from "lucide-react";
import { chatMessages } from "@/lib/data";

export default function MessageList() {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 chat-scroll">
      <div className="flex items-center justify-center relative my-8">
        <hr className="absolute w-full border-slate-200 dark:border-slate-800" />
        <span className="relative bg-white dark:bg-[#0F172A] px-4 text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
          TODAY, OCT 24
        </span>
      </div>

      {chatMessages.map((msg, i) => (
        <div key={i} className={`flex gap-4 max-w-3xl ${msg.type === "client" ? "ml-auto flex-row-reverse" : ""}`}>
          {msg.type === "agent" && (
            <img alt={msg.name} className="w-10 h-10 rounded-lg object-cover shrink-0 shadow-sm" src={msg.avatar!} />
          )}
          <div className={`flex flex-col gap-1 ${msg.type === "client" ? "items-end" : ""}`}>
            <div className={`flex items-baseline gap-2 ${msg.type === "client" ? "flex-row-reverse" : ""}`}>
              <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                {msg.name}
                {msg.role && (
                  <span className="text-blue-600 dark:text-blue-400 text-[10px] ml-1 px-1.5 py-0.5 bg-blue-600/10 dark:bg-blue-400/10 rounded">
                    {msg.role}
                  </span>
                )}
              </span>
              <span className="text-[12px] text-slate-500 dark:text-slate-400">{msg.time}</span>
            </div>
            <div className={`p-4 rounded-xl shadow-sm text-base ${
              msg.type === "client"
                ? "bg-blue-600 dark:bg-blue-600 text-white rounded-tr-sm"
                : "bg-slate-100 dark:bg-[#1E293B] text-slate-900 dark:text-slate-50 rounded-tl-sm border border-slate-200 dark:border-slate-800"
            }`}>
              <p>{msg.content}</p>
            </div>
            {msg.attachment && (
              <div className="mt-2 flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#0B1221] border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-600/50 dark:hover:border-blue-400/50 hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors cursor-pointer group">
                <div className="w-10 h-10 bg-red-500/10 text-red-500 dark:text-red-400 rounded flex items-center justify-center shrink-0">
                  <FileText className="size-5" />
                </div>
                <div className="flex flex-col pr-4">
                  <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {msg.attachment.name}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {msg.attachment.size} &bull; {msg.attachment.type}
                  </span>
                </div>
                <button className="ml-auto p-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                  <Eye className="size-[18px]" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="flex justify-center my-4">
        <span className="bg-slate-100 dark:bg-[#1E293B] py-1 px-3 rounded-full text-[12px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Eye className="size-[14px]" />
          David Chen is viewing the document
        </span>
      </div>

      <div className="h-4 w-full" id="chat-bottom" />
    </div>
  );
}
