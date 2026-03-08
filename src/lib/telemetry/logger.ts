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
