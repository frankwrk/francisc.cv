"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sent");
  }

  return (
    <form onSubmit={handleSubmit} className="tone-border mt-6 grid gap-3 rounded-md bg-card p-4">
      <label className="grid gap-1 text-sm">
        <span>Name</span>
        <input className="rounded-sm border border-border bg-bg px-3 py-2" type="text" placeholder="Your name" required />
      </label>
      <label className="grid gap-1 text-sm">
        <span>Email</span>
        <input
          className="rounded-sm border border-border bg-bg px-3 py-2"
          type="email"
          placeholder="you@company.com"
          required
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span>Message</span>
        <textarea
          className="rounded-sm border border-border bg-bg px-3 py-2"
          rows={4}
          placeholder="What are you building?"
          required
        />
      </label>
      <button
        className="w-fit rounded-md border border-border bg-card2 px-3 py-2 text-sm font-medium transition-colors hover:border-accent/40"
        type="submit"
      >
        Send (placeholder)
      </button>
      {status === "sent" ? (
        <p className="font-mono text-xs text-muted">Placeholder action complete. Reach out via mailto for direct contact.</p>
      ) : null}
    </form>
  );
}
