import { type ReactNode } from "react";

type BadgeVariant = "default" | "netflix" | "success" | "warning" | "outline";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-zinc-800 text-zinc-200",
  netflix: "bg-netflix text-white",
  success: "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30",
  warning: "bg-yellow-600/20 text-yellow-400 border border-yellow-600/30",
  outline: "border border-zinc-600 text-zinc-300",
};

export default function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
