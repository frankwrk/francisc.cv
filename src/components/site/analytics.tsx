"use client";

import { useEffect } from "react";

export function Analytics() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    // Placeholder hook for analytics tooling.
    console.info("[analytics] ready");
  }, []);

  return null;
}
