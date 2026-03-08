function truncatePreview(value: string, maxLength = 180) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1)}…`;
}

export function buildLogPreview(value: string | null | undefined, maxLength?: number) {
  if (!value) {
    return null;
  }

  return truncatePreview(value, maxLength);
}

export function logAssistantInfo(
  event: string,
  payload: Record<string, unknown> = {},
) {
  console.info(
    JSON.stringify({
      scope: "portfolio-assistant",
      level: "info",
      event,
      ...payload,
    }),
  );
}

export function logAssistantError(
  event: string,
  payload: Record<string, unknown> = {},
) {
  console.error(
    JSON.stringify({
      scope: "portfolio-assistant",
      level: "error",
      event,
      ...payload,
    }),
  );
}
