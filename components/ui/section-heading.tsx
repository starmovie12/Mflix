import type { ReactNode } from "react";

interface SectionHeadingProps {
  title: string;
  action?: ReactNode;
}

export default function SectionHeading({ title, action }: SectionHeadingProps) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-lg font-semibold text-zinc-50 md:text-xl">{title}</h2>
      {action}
    </div>
  );
}
