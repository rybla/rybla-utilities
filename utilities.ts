export const do_ = <A>(k: () => A): A => k();

export function fold<A>(xss: A[][]): A[] {
  return xss.reduce((acc, arr) => acc.concat(arr), [] as A[]);
}

export function slugifyFilename(str: string): string {
  if (!str) return "untitled";

  // Replace invalid characters with a hyphen
  // List of characters unsafe for most filesystems: / \ ? % * : | " < > . (leading)
  // Plus control characters and potentially others.
  // We'll use a broad regex to replace anything not alphanumeric, space, or simple punctuation allowed in URLs (-)
  // and then refine.
  let safeStr = str
    .trim() // Remove leading/trailing whitespace
    .toLowerCase() // Often helpful for case-insensitive filesystems
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[/\\?%*:|"<>.]/g, "-") // Replace common invalid characters with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
    .replace(/^-+/, "") // Remove leading hyphens
    .replace(/-+$/, ""); // Remove trailing hyphens

  // Ensure it's not empty after cleaning
  if (safeStr.length === 0) {
    return "untitled";
  }

  // Limit length to avoid issues on some filesystems (e.g., 255 chars is common)
  const maxLength = 200; // A bit shorter to be safe
  if (safeStr.length > maxLength) {
    safeStr = safeStr.substring(0, maxLength);
  }

  return safeStr;
}

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string = `Operation timed out after ${timeoutMs}ms`,
): Promise<T> {
  let timer: NodeJS.Timeout | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timer) {
      clearTimeout(timer);
    }
  });
}
