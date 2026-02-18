import * as React from "react";
import { cn } from "@/lib/cn";

type BadgeVariant = "default" | "muted" | "netflix";

export type BadgeProps = React.PropsWithChildren<{
  className?: string;
  variant?: BadgeVariant;
}>;

export function Badge({ className, variant = "default", children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide",
        variant === "default" && "border-zinc-700 bg-black/40 text-zinc-100",
        variant === "muted" && "border-zinc-800 bg-zinc-950/60 text-zinc-300",
        variant === "netflix" && "border-netflix/40 bg-netflix/15 text-netflix",
        className
      )}
    >
      {children}
    </span>
  );
}

