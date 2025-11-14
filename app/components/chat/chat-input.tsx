import { FormEvent, useState } from "react";

type ChatInputProps = {
  onSend: (message: string) => void;
  isBusy?: boolean;
  suggestions?: string[];
};

export function ChatInput({ onSend, isBusy, suggestions = [] }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value.trim() || isBusy) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <div className="space-y-3">
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              className="rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-xs font-medium text-blue-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
              onClick={() => onSend(suggestion)}
              type="button"
              disabled={isBusy}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 rounded-full bg-white/90 p-2 pl-6 shadow-xl ring-1 ring-blue-100 backdrop-blur"
      >
        <input
          className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
          placeholder={
            isBusy
              ? "Assistant is typing..."
              : "Tell us how we can help with your vehicle."
          }
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={isBusy}
        />
        <button
          type="submit"
          className="rounded-full bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:shadow-blue-200 disabled:opacity-60"
          disabled={isBusy}
        >
          Send
        </button>
      </form>
    </div>
  );
}
