import { describe, expect, it } from "vitest";
import { formatRuntime, formatVoteAverage, formatYear, isMediaType } from "@/lib/utils";

describe("utils", () => {
  it("formats runtime correctly", () => {
    expect(formatRuntime(0)).toBe("Runtime unavailable");
    expect(formatRuntime(45)).toBe("45m");
    expect(formatRuntime(130)).toBe("2h 10m");
  });

  it("formats vote averages", () => {
    expect(formatVoteAverage(8.777)).toBe("8.8");
    expect(formatVoteAverage(0)).toBe("N/A");
  });

  it("formats years", () => {
    expect(formatYear("2025-10-15")).toBe("2025");
    expect(formatYear(null)).toBe("N/A");
  });

  it("validates media types", () => {
    expect(isMediaType("movie")).toBe(true);
    expect(isMediaType("tv")).toBe(true);
    expect(isMediaType("person")).toBe(false);
  });
});
