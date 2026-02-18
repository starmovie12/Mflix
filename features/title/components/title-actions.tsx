"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Plus, Share2 } from "lucide-react";
import Button from "@/components/ui/button";
import { useMyListStore } from "@/features/my-list/store/use-my-list-store";
import type { MediaItem } from "@/types/media";

interface TitleActionsProps {
  item: MediaItem;
}

export default function TitleActions({ item }: TitleActionsProps) {
  const [copied, setCopied] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const inMyList = useMyListStore((state) => state.has(item.id, item.mediaType));
  const toggle = useMyListStore((state) => state.toggle);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}/title/${item.mediaType}/${item.id}`;
  }, [item.id, item.mediaType]);

  const onShare = async () => {
    setShareError(null);

    const payload = {
      title: item.title,
      text: `Watch ${item.title} on MFLIX`,
      url: shareUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(payload);
      } catch {
        // User cancelled share, no visible error required.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setShareError("Unable to copy URL on this browser.");
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setShareError("Unable to copy URL on this browser.");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        type="button"
        variant={inMyList ? "ghost" : "primary"}
        size="lg"
        leftIcon={inMyList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        onClick={() => toggle(item)}
      >
        {inMyList ? "In My List" : "Add to My List"}
      </Button>

      <Button type="button" variant="ghost" size="lg" leftIcon={<Share2 className="h-4 w-4" />} onClick={onShare}>
        Share
      </Button>

      <Button type="button" variant="ghost" size="lg" leftIcon={<Copy className="h-4 w-4" />} onClick={onCopy}>
        {copied ? "Copied" : "Copy Link"}
      </Button>

      {shareError ? <p className="text-xs text-red-300">{shareError}</p> : null}
    </div>
  );
}
