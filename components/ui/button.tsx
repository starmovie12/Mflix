"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
}

const variantClassName: Record<ButtonVariant, string> = {
  primary: "bg-netflix text-white hover:bg-red-500",
  secondary: "bg-white text-black hover:bg-zinc-200",
  ghost: "bg-zinc-700/70 text-white hover:bg-zinc-600/80"
};

const sizeClassName: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm"
};

export default function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  leftIcon,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-netflix",
        variantClassName[variant],
        sizeClassName[size],
        className
      )}
      {...props}
    >
      {leftIcon}
      {children}
    </button>
  );
}
