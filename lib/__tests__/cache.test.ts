import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { getCached, setCache, clearCache, withCache } from "@/lib/cache";

beforeEach(() => clearCache());
afterEach(() => vi.useRealTimers());

describe("cache", () => {
  it("returns undefined for missing key", () => {
    expect(getCached("nope")).toBeUndefined();
  });

  it("stores and retrieves a value", () => {
    setCache("greeting", "hello");
    expect(getCached("greeting")).toBe("hello");
  });

  it("respects TTL", () => {
    vi.useFakeTimers();
    setCache("ephemeral", "data", 5_000);
    vi.advanceTimersByTime(5_001);
    expect(getCached("ephemeral")).toBeUndefined();
  });

  it("withCache returns cached value on second call", async () => {
    const fetcher = vi.fn().mockResolvedValue("expensive");
    const a = await withCache("key", fetcher);
    expect(a).toBe("expensive");
    expect(fetcher).toHaveBeenCalledTimes(1);

    const b = await withCache("key", fetcher);
    expect(b).toBe("expensive");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("withCache calls fetcher again after TTL expires", async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn().mockResolvedValue("fresh");
    await withCache("key", fetcher, 10_000);
    vi.advanceTimersByTime(10_001);
    await withCache("key", fetcher);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("clearCache without pattern empties everything", () => {
    setCache("a", 1);
    setCache("b", 2);
    clearCache();
    expect(getCached("a")).toBeUndefined();
    expect(getCached("b")).toBeUndefined();
  });

  it("clearCache with pattern removes only matching keys", () => {
    setCache("user:1", "alice");
    setCache("user:2", "bob");
    setCache("config", "dark");
    clearCache("user:");
    expect(getCached("user:1")).toBeUndefined();
    expect(getCached("user:2")).toBeUndefined();
    expect(getCached("config")).toBe("dark");
  });
});
