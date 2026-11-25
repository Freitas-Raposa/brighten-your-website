import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchPortarias } from "@/lib/portarias.server";

afterEach(() => vi.unstubAllGlobals());

describe("Busca online de portarias", () => {
  it("retorna o link da publicação encontrada e consulta o termo informado", async () => {
    const mockedFetch = vi.fn(async () => new Response('<rss><channel><item><title>Portaria 133 sobre RGP</title><link>https://www.gov.br/mpa/portaria-133</link><pubDate>Wed, 25 Nov 2026 12:00:00 GMT</pubDate><source>Ministério da Pesca</source></item></channel></rss>'));
    vi.stubGlobal("fetch", mockedFetch);
    const result = await fetchPortarias("133");
    expect(result.articles[0]?.url).toBe("https://www.gov.br/mpa/portaria-133");
    expect(result.unavailable).toBe(false);
    const call = mockedFetch.mock.calls[0] as unknown[] | undefined;
    expect(new URL(String(call?.[0])).searchParams.get("q")).toContain("133");
  });
  it("consulta pesca, Seguro-Defeso e RGP para atualizar os destaques", async () => {
    const calls: string[] = [];
    vi.stubGlobal("fetch", vi.fn(async (url: URL) => {
      calls.push(url.searchParams.get("q") ?? "");
      return new Response("<rss><channel></channel></rss>");
    }));
    await fetchPortarias("");
    expect(calls).toEqual(["portaria pesca", "portaria seguro-defeso", "portaria RGP pescador"]);
  });
  it("não inventa portarias quando o serviço de busca falha", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("offline"); }));
    const result = await fetchPortarias("RGP");
    expect(result.articles).toEqual([]);
    expect(result.unavailable).toBe(true);
  });
  it("não inventa datas para publicações que não informam data válida", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response('<rss><channel><item><title>Portaria 133 sobre RGP</title><link>https://www.gov.br/mpa/portaria-133</link></item></channel></rss>')));
    const result = await fetchPortarias("133");
    expect(result.articles).toEqual([]);
    expect(result.unavailable).toBe(false);
  });
});