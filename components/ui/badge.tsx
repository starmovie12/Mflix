import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "default" | "accent" | "muted";
}

const toneClasses = {
  default: "bg-zinc-800 text-zinc-100 border-zinc-700",
  accent: "bg-netflix/20 text-red-100 border-netflix/40",
  muted: "bg-zinc-900 text-zinc-300 border-zinc-800"
} as const;

export default function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
