import { describe, expect, it } from "vitest";
import {
  AUTO_REFRESH_INTERVAL_MS,
  CATEGORY_ORDER,
  fishingNewsQueryOptions,
  prioritizeArticles,
} from "@/lib/fishing-news";
import { classifyCategory, RSS_FEEDS } from "@/lib/fishing-news.server";

describe("Radar da Pesca — atualização automática, Maranhão e portarias", () => {
  it("atualiza as notícias automaticamente a cada 5 minutos", () => {
    expect(AUTO_REFRESH_INTERVAL_MS).toBe(5 * 60 * 1000);
    expect(fishingNewsQueryOptions.refetchInterval).toBe(AUTO_REFRESH_INTERVAL_MS);
    expect(fishingNewsQueryOptions.refetchOnWindowFocus).toBe(true);
  });

  it("inclui fontes dedicadas para Maranhão, Seguro-Defeso/RGP, Congresso e Mundo", () => {
    const joined = RSS_FEEDS.join("\n").toLowerCase();
    expect(joined).toContain("maranh");
    expect(joined).toContain("raposa");
    expect(joined).toContain("seguro-defeso");
    expect(joined).toContain("rgp");
    expect(joined).toContain("senado");
    expect(joined).toContain("portaria");
    expect(joined).toContain("mundial");
    expect(CATEGORY_ORDER.slice(0, 4)).toEqual(["todas", "maranhao", "seguro_defeso", "congresso"]);
  });

  it("coloca notícias do Maranhão sempre em destaque antes dos outros estados", () => {
    const ordered = prioritizeArticles([
      { id: "1", category: "esportiva", publishedAt: "2026-11-25T14:00:00.000Z" },
      { id: "2", category: "maranhao", publishedAt: "2026-11-25T10:00:00.000Z" },
      { id: "3", category: "congresso", publishedAt: "2026-11-25T15:00:00.000Z" },
      { id: "4", category: "maranhao", publishedAt: "2026-11-25T13:00:00.000Z" },
    ]);
    expect(ordered.map((a) => a.id)).toEqual(["4", "2", "3", "1"]);
  });

  it("classifica Maranhão, Congresso, Seguro-Defeso/RGP e Mundo corretamente", () => {
    expect(classifyCategory("Pescadores de Raposa recebem orientação sobre defeso")).toBe("maranhao");
    expect(classifyCategory("Pesca artesanal no Maranhão bate recorde")).toBe("maranhao");
    expect(classifyCategory("Projeto de lei na Câmara dos Deputados amplia apoio à pesca")).toBe("congresso");
    expect(classifyCategory("Como pedir reativação da carteira de pescador RGP no PesqBrasil")).toBe("seguro_defeso");
    expect(classifyCategory("Ministério da Pesca publica nova portaria sobre defeso")).toBe("legislacao");
    expect(classifyCategory("Relatório da FAO analisa pesca mundial")).toBe("mundo");
  });
});