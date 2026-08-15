interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between gap-3 w-full text-left px-4 py-3 rounded-2xl bg-white/70 border border-border-soft hover:bg-white transition-colors"
    >
      <span className="text-sm font-medium text-ink">{label}</span>
      <span
        className={[
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200",
          checked ? "bg-gradient-to-r from-pink-dark to-lavender-dark" : "bg-gray-200",
        ].join(" ")}
      >
        <span
          className={[
            "inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow transition-transform duration-200",
            checked ? "translate-x-[22px]" : "translate-x-[3px]",
          ].join(" ")}
        />
      </span>
    </button>
  );
}
