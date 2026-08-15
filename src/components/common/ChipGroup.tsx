interface ChipOption<T extends string | number> {
  id: T;
  label: string;
}

interface ChipGroupProps<T extends string | number> {
  options: ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
  columns?: number;
}

export function ChipGroup<T extends string | number>({
  options,
  value,
  onChange,
  columns,
}: ChipGroupProps<T>) {
  return (
    <div
      className="flex flex-wrap gap-2"
      style={columns ? { display: "grid", gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` } : undefined}
    >
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            type="button"
            key={String(opt.id)}
            onClick={() => onChange(opt.id)}
            className={[
              "px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 active:scale-[0.97]",
              active
                ? "bg-gradient-to-r from-pink-dark to-lavender-dark text-white border-transparent shadow-soft"
                : "bg-white/70 text-ink-soft border-border-soft hover:bg-white",
            ].join(" ")}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
