import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-pink-dark to-lavender-dark text-white shadow-soft hover:brightness-105 active:brightness-95",
  secondary:
    "bg-white/80 text-ink border border-border-soft hover:bg-white shadow-card",
  ghost: "bg-transparent text-ink-soft hover:bg-white/60",
  danger: "bg-white/80 text-rose-500 border border-rose-200 hover:bg-rose-50",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "text-xs px-3 py-1.5 gap-1.5 rounded-full",
  md: "text-sm px-4 py-2.5 gap-2 rounded-2xl",
  lg: "text-base px-6 py-3.5 gap-2.5 rounded-2xl",
};

export function Button({
  variant = "secondary",
  size = "md",
  icon,
  fullWidth,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center font-medium transition-all duration-150",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100",
        "active:scale-[0.98]",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
