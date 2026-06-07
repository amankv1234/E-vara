/**
 * Generates a SHA-256 hash of a string using the Web Crypto API.
 * Useful for privacy-preserving identity matching.
 */
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

export function cn(...inputs: unknown[]) {
  // Simplified version of tailwind-merge + clsx if not available, 
  // but assuming standard utils.ts exists
  return inputs.filter(Boolean).join(' ');
}
