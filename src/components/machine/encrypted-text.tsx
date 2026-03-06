"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

type EncryptedTextProps = {
  text: string;
  className?: string;
};

function randomChar(index: number) {
  return SCRAMBLE_CHARS[(Math.abs(index * 17 + Date.now()) % SCRAMBLE_CHARS.length)];
}

export function EncryptedText({ text, className }: EncryptedTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const normalizedText = useMemo(() => text.toUpperCase(), [text]);
  const [displayText, setDisplayText] = useState(normalizedText);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    let frame = 0;
    let interval = 0;
    const totalFrames = 16;
    const kickoff = window.setTimeout(() => {
      interval = window.setInterval(() => {
        frame += 1;

        const next = normalizedText
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            const revealAt = Math.floor((index / Math.max(normalizedText.length, 1)) * totalFrames);
            return frame >= revealAt ? char : randomChar(index + frame);
          })
          .join("");

        setDisplayText(next);

        if (frame >= totalFrames) {
          window.clearInterval(interval);
          setDisplayText(normalizedText);
        }
      }, 42);
    }, 0);

    return () => {
      window.clearTimeout(kickoff);
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [normalizedText, prefersReducedMotion]);

  return <span className={className}>{prefersReducedMotion ? normalizedText : displayText}</span>;
}
