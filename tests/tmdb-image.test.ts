import { describe, expect, it } from "vitest";
import { getTmdbImageUrl } from "../lib/tmdb";

describe("getTmdbImageUrl", () => {
  it("returns placeholder for empty paths", () => {
    expect(getTmdbImageUrl(null, "w500")).toBe("/placeholder.svg");
    expect(getTmdbImageUrl(undefined, "w500")).toBe("/placeholder.svg");
  });

  it("builds a TMDB URL for valid paths", () => {
    const url = getTmdbImageUrl("/abc.jpg", "w300");
    expect(url).toContain("/w300/abc.jpg");
  });
});

