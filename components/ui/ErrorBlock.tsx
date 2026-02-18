"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import Button from "./Button";

interface ErrorBlockProps {
  title?: string;
  message?: string;
  retry?: () => void;
}

export default function ErrorBlock({
  title = "Something went wrong",
  message = "We encountered an error loading this content. Please try again.",
  retry,
}: ErrorBlockProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-900/30">
        <AlertTriangle className="h-8 w-8 text-red-400" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="max-w-sm text-sm text-zinc-400">{message}</p>
      </div>
      {retry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={retry}
          icon={<RefreshCw className="h-3.5 w-3.5" />}
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
