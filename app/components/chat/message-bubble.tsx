import { cn } from "@/lib/utils";

type ChatMessageProps = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex w-full gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 font-semibold text-white shadow-md">
          DJ
        </div>
      )}
      <div className={cn("max-w-xl", isUser ? "text-right" : "text-left")}>
        <div
          className={cn(
            "rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm",
            isUser
              ? "bg-blue-600 text-white"
              : "bg-white/80 ring-1 ring-blue-100/70 backdrop-blur"
          )}
        >
          <p className="whitespace-pre-line">{content}</p>
        </div>
        <span className="mt-2 block text-xs font-medium text-blue-200/80">
          {timestamp}
        </span>
      </div>
    </div>
  );
}
