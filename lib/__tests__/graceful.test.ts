import { describe, it, expect, vi } from "vitest";
import { withFallback, withRetry } from "@/lib/graceful";

describe("withFallback", () => {
  it("returns the resolved value on success", async () => {
    const fn = vi.fn().mockResolvedValue("ok");
    await expect(withFallback(fn, "fallback", "test")).resolves.toBe("ok");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("returns fallback on rejection", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("boom"));
    await expect(withFallback(fn, "fallback", "test")).resolves.toBe("fallback");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("does not retry on failure", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("nope"));
    await withFallback(fn, "safe", "test");
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe("withRetry", () => {
  it("returns resolved value on first try", async () => {
    const fn = vi.fn().mockResolvedValue(42);
    await expect(withRetry(fn, 2, "test")).resolves.toBe(42);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries on failure and succeeds", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("attempt 1"))
      .mockResolvedValueOnce("recovered");
    await expect(withRetry(fn, 2, "test")).resolves.toBe("recovered");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("throws after exhausting retries", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("persistent"));
    await expect(withRetry(fn, 1, "test")).rejects.toThrow("persistent");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("uses default maxRetries of 2", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("fail"));
    await expect(withRetry(fn, undefined, "test")).rejects.toThrow();
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
