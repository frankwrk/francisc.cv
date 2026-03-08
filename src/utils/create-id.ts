function fallbackId() {
  return `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createId() {
  const maybeCrypto = globalThis.crypto;

  if (
    maybeCrypto &&
    typeof maybeCrypto.randomUUID === "function"
  ) {
    return maybeCrypto.randomUUID();
  }

  if (
    maybeCrypto &&
    typeof maybeCrypto.getRandomValues === "function"
  ) {
    const buffer = new Uint32Array(4);
    maybeCrypto.getRandomValues(buffer);
    return Array.from(buffer, (value) => value.toString(16).padStart(8, "0")).join("-");
  }

  return fallbackId();
}
