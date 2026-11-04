// Security utilities  -  server-side only patterns
// These helpers are designed to be called from Server Actions or API routes

/**
 * Sanitizes a string input to prevent injection attacks.
 * Uses allowlist approach  -  strips anything not in the allowed character set.
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>'"`;]/g, "") // Strip common injection chars
    .replace(/javascript:/gi, "") // Block JS protocol
    .replace(/data:/gi, "") // Block data URIs
    .trim()
    .slice(0, 2000); // Hard length cap
}

/**
 * Generates a simple request fingerprint for rate limiting.
 * Uses IP + User-Agent hash (non-identifying, for rate limit only).
 */
export function getRequestFingerprint(
  ip: string | null,
  userAgent: string | null
): string {
  const raw = `${ip ?? "unknown"}-${userAgent ?? "unknown"}`;
  // Simple djb2 hash  -  not cryptographic, just for rate limit keys
  let hash = 5381;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) + hash + raw.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit int
  }
  return Math.abs(hash).toString(36);
}

/**
 * Checks if a honeypot field was filled (indicates bot).
 */
export function isBot(honeypotValue: string | undefined): boolean {
  return typeof honeypotValue === "string" && honeypotValue.length > 0;
}

/**
 * Safe structured response builder  -  never exposes internal errors to client.
 */
export function safeError(
  userMessage: string,
  _internalError?: unknown
): { success: false; message: string } {
  // Log internally but never expose to client
  if (_internalError) {
    console.error("[SakhiFi Internal]", _internalError);
  }
  return { success: false, message: userMessage };
}

export function safeSuccess(message: string): { success: true; message: string } {
  return { success: true, message };
}