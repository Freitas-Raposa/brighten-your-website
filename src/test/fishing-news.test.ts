import { describe, expect, it } from "vitest";
import { AUTO_REFRESH_INTERVAL_MS, CATEGORY_ORDER, fishingNewsQueryOptions } from "@/lib/fishing-news";
import { classifyCategory, RSS_FEEDS } from "@/lib/fishing-news.server";

describe("Radar da Pesca — atualização automática, Maranhão e portarias", () => {
  it("atualiza as notícias automaticamente a cada 5 minutos", () => {
    expect(AUTO_REFRESH_INTERVAL_MS).toBe(5 * 60 * 1000);
    expect(fishingNewsQueryOptions.refetchInterval).toBe(AUTO_REFRESH_INTERVAL_MS);
    expect(fishingNewsQueryOptions.refetchOnWindowFocus).toBe(true);
  });

  it("inclui fontes dedicadas para pesca no Maranhão e novas portarias", () => {
    const joined = RSS_FEEDS.join("\n").toLowerCase();
    expect(joined).toContain("maranh");
    expect(joined).toContain("raposa");
    expect(joined).toContain("portaria");
    expect(CATEGORY_ORDER.slice(0, 3)).toEqual(["todas", "maranhao", "legislacao"]);
  });

  it("classifica notícias do Maranhão e de novas portarias corretamente", () => {
    expect(classifyCategory("Pescadores de Raposa recebem orientação sobre defeso")).toBe("maranhao");
    expect(classifyCategory("Pesca artesanal no Maranhão bate recorde")).toBe("maranhao");
    expect(classifyCategory("Ministério da Pesca publica nova portaria sobre RGP")).toBe("legislacao");
  });
});