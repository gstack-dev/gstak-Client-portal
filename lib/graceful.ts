export async function withFallback<T>(
  fn: () => Promise<T>,
  fallback: T,
  label: string
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error(`[${label}] Operation failed, using fallback:`, err);
    return fallback;
  }
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  label: string = "operation"
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        console.warn(`[${label}] Attempt ${attempt + 1} failed, retrying...`);
      }
    }
  }
  throw lastError;
}
