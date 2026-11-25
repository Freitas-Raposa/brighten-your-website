import { describe, expect, it } from "vitest";
import { isFishingPortaria, matchesPortariaSearch, newestPortarias, officialPortariaLinks, portariaSearchQuery, PORTARIA_REFRESH_MS } from "@/lib/portarias";

describe("Busca de portarias de pesca", () => {
  it("inclui portarias de seguro-defeso e carteira RGP independentemente da categoria regional", () => {
    expect(isFishingPortaria("Portaria sobre Seguro-Defeso no Maranhão")).toBe(true);
    expect(isFishingPortaria("Portaria MPA reativa carteira de pescador artesanal RGP")).toBe(true);
    expect(isFishingPortaria("Portaria sobre saúde pública")).toBe(false);
    expect(isFishingPortaria("Notícias sobre RGP")).toBe(false);
  });
  it("mantém o número solicitado e pesquisa portarias relacionadas à pesca", () => {
    const query = portariaSearchQuery("133 de 2025");
    expect(query).toContain("133 de 2025");
    expect(query).toContain("portaria (pesca OR pescador OR defeso OR RGP)");
    const links = officialPortariaLinks("133 de 2025");
    expect(links.map((link) => new URL(link.url).hostname)).toEqual(["www.in.gov.br", "www.gov.br", "www.google.com"]);
    expect(new URL(links[0]?.url ?? "https://invalid.example").searchParams.get("q")).toContain("133 de 2025");
  });
  it("mostra as portarias mais novas primeiro sem repetir títulos", () => {
    const old = { title: "Portaria do RGP", publishedAt: "2026-11-20T12:00:00Z" };
    const recent = { title: "Portaria do Seguro-Defeso", publishedAt: "2026-11-25T12:00:00Z" };
    expect(newestPortarias([old, recent, old]).map((item) => item.title)).toEqual([recent.title, old.title]);
  });
  it("consulta automaticamente a cada cinco minutos", () => {
    expect(PORTARIA_REFRESH_MS).toBe(300000);
  });
  it("os resultados correspondem ao número ou assunto solicitado", () => {
    expect(matchesPortariaSearch("Portaria 133 de 2025 sobre RGP", "133 de 2025")).toBe(true);
    expect(matchesPortariaSearch("Portaria 1330 de 2025 sobre RGP", "133 de 2025")).toBe(false);
    expect(matchesPortariaSearch("Portaria autoriza pesca de lula", "RGP")).toBe(false);
    expect(matchesPortariaSearch("Portaria de seguro-defeso", "seguro defeso")).toBe(true);
  });
});