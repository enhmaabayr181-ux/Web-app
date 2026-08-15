import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padded?: boolean;
}

export function Card({ children, className = "", padded = true, ...rest }: CardProps) {
  return (
    <div
      className={[
        "glass rounded-3xl shadow-card",
        padded ? "p-5 sm:p-6" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold tracking-wide uppercase text-pink-dark mb-1">
            {eyebrow}
          </p>
        )}
        <h2 className="text-xl sm:text-2xl font-semibold text-ink">{title}</h2>
        {description && <p className="text-sm text-ink-soft mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}
