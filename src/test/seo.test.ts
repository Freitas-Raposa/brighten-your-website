import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { Route } from "@/routes/index";
import { SITE_URL } from "@/lib/site";

const OFFICIAL = "https://radardapesca.aquadastro.online";

async function pageHead() {
  return Route.options.head?.({} as never);
}

describe("Descoberta do site pelo Google", () => {
  it("declares the official domain as the canonical address", async () => {
    const head = await pageHead();
    const canonical = head?.links?.find((link) => link?.rel === "canonical");

    expect(canonical?.href).toBe(`${OFFICIAL}/`);
  });

  it("publishes a sitemap that lists the official address", () => {
    const sitemap = readFileSync("public/sitemap.xml", "utf8");

    expect(sitemap).toContain(`<loc>${OFFICIAL}/</loc>`);
  });

  it("tells crawlers where the sitemap lives", () => {
    const robots = readFileSync("public/robots.txt", "utf8");

    expect(robots).toContain(`Sitemap: ${OFFICIAL}/sitemap.xml`);
  });

  it("sends structured data describing the site", async () => {
    const head = await pageHead();
    const entry = head?.meta?.find((item) => item && "script:ld+json" in item);
    const data =
      entry && "script:ld+json" in entry
        ? (entry["script:ld+json"] as Record<string, unknown>)
        : undefined;

    expect(data?.["@context"]).toBe("https://schema.org");
  });

  it("keeps the shared-card image on the official domain", async () => {
    const head = await pageHead();
    const ogImage = head?.meta?.find(
      (entry) => entry && "property" in entry && entry["property"] === "og:image",
    );
    const content = ogImage && "content" in ogImage ? ogImage["content"] : undefined;

    expect(String(content)).toMatch(
      new RegExp(`^${SITE_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/`),
    );
  });
});
