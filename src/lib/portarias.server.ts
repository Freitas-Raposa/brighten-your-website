import { parseRssXml } from "./fishing-news.server";
import { matchesPortariaSearch, newestPortarias, portariaSearchQuery } from "./portarias";

export async function fetchPortarias(term: string) {
  const queries = term.trim()
    ? [portariaSearchQuery(term)]
    : [
        'portaria pesca',
        'portaria seguro-defeso',
        'portaria RGP pescador',
      ];
  const results = await Promise.allSettled(queries.map(async (query) => {
    const url = new URL("https://news.google.com/rss/search");
    url.search = new URLSearchParams({ q: query, hl: "pt-BR", gl: "BR", ceid: "BR:pt-419" }).toString();
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
      headers: { Accept: "application/rss+xml, application/xml" },
    });
    if (!response.ok) throw new Error("Busca temporariamente indisponível");
    const xml = await response.text();
    if (!xml.includes("<rss")) throw new Error("Resposta inválida da busca");
    return parseRssXml(xml, { requireValidDate: true });
  }));
  const successful = results.filter((result) => result.status === "fulfilled");
  return {
    articles: newestPortarias(successful.flatMap((result) => result.value))
      .filter((article) => matchesPortariaSearch(`${article.title} ${article.summary}`, term)).slice(0, 18),
    fetchedAt: new Date().toISOString(),
    unavailable: successful.length === 0,
    partial: successful.length > 0 && successful.length < results.length,
  };
}