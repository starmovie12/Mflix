import { type ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  action?: ReactNode;
  className?: string;
}

export default function SectionHeader({ title, action, className = "" }: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <h2 className="text-fluid-xl font-semibold text-white">{title}</h2>
      {action}
    </div>
  );
}
