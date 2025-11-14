const QUICK_ACTIONS = [
  "I need a repair estimate",
  "Tell me about your spray painting services",
  "Can I get an update on my vehicle?",
  "Do you assist with insurance claims?",
  "Any tips after my car is resprayed?",
  "Kan julle Afrikaans praat?",
];

type QuickActionsProps = {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
};

export function QuickActions({ onSelect, disabled }: QuickActionsProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {QUICK_ACTIONS.map((action) => (
        <button
          key={action}
          onClick={() => onSelect(action)}
          disabled={disabled}
          className="rounded-xl border border-blue-100 bg-white/70 px-4 py-3 text-left text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md disabled:opacity-60"
        >
          {action}
        </button>
      ))}
    </div>
  );
}
