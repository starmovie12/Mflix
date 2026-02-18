import { Film } from "lucide-react";
import { type ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900">
        {icon ?? <Film className="h-8 w-8 text-zinc-500" />}
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description && (
          <p className="max-w-sm text-sm text-zinc-400">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
