"use client";

import { useMemo, useState } from "react";
import * as Avatar from "@/components/ui/avatar";

type ProfileAvatarProps = {
  sources: string[];
  alt: string;
  initials: string;
};

export function ProfileAvatar({ sources, alt, initials }: ProfileAvatarProps) {
  const [sourceIndex, setSourceIndex] = useState(0);

  const activeSource = useMemo(() => {
    if (!sources.length) {
      return null;
    }
    return sources[Math.min(sourceIndex, sources.length - 1)];
  }, [sourceIndex, sources]);

  const hasImageSource = activeSource !== null && sourceIndex < sources.length;

  return (
    <Avatar.Root
      size="80"
      className="border border-[var(--scaffold-line)] bg-[var(--scaffold-surface)] text-[var(--scaffold-toggle-text-active)]"
     
    >
      {hasImageSource ? (
        <Avatar.Image
          key={activeSource}
          src={activeSource ?? undefined}
          alt={alt}
          onError={() => {
            setSourceIndex((prev) => {
              if (prev >= sources.length - 1) {
                return sources.length;
              }
              return prev + 1;
            });
          }}
         
        />
      ) : (
        <span className="text-base tracking-[0.16em]">
          {initials}
        </span>
      )}
    </Avatar.Root>
  );
}
