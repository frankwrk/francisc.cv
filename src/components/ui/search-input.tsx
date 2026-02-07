"use client";

import type { ChangeEvent } from "react";

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
}) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
  }

  return (
    <label className="relative block w-full sm:max-w-sm">
      <span className="sr-only">Search</span>
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="tone-border h-10 w-full rounded-md bg-card px-3 font-mono text-sm text-fg placeholder:text-muted"
      />
    </label>
  );
}
