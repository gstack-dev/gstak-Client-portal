import { describe, it, expect, vi, beforeEach } from "vitest";
import { recordAuditEvent } from "@/lib/audit";

vi.mock("@/models/AuditLog", () => ({
  default: {
    create: vi.fn(),
  },
}));

vi.mock("@/lib/mongodb", () => ({
  connectMongoDB: vi.fn().mockResolvedValue(undefined),
}));

const AuditLog = (await import("@/models/AuditLog")).default;

describe("recordAuditEvent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("writes an audit log entry", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(AuditLog.create).mockResolvedValue({} as any);

    await recordAuditEvent({
      action: "login.success",
      userId: "abc123",
      email: "test@example.com",
      role: "client",
      ip: "127.0.0.1",
    });

    expect(AuditLog.create).toHaveBeenCalledWith({
      action: "login.success",
      userId: "abc123",
      email: "test@example.com",
      role: "client",
      ip: "127.0.0.1",
      metadata: {},
      success: true,
      error: undefined,
    });
  });

  it("does not throw when AuditLog.create fails", async () => {
    vi.mocked(AuditLog.create).mockRejectedValue(new Error("db down"));

    await expect(
      recordAuditEvent({ action: "logout", userId: "x" })
    ).resolves.toBeUndefined();
  });
});
