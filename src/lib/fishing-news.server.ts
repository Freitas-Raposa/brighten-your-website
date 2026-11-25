export type NewsCategory = "todas" | "esportiva" | "rios" | "mar" | "legislacao";

export interface FishingArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  category: Exclude<NewsCategory, "todas">;
}

export interface FishingNewsResponse {
  articles: FishingArticle[];
  fetchedAt: string;
  isLive: boolean;
}

const RSS_FEEDS = [
  "https://news.google.com/rss/search?q=pesca+esportiva+Brasil&hl=pt-BR&gl=BR&ceid=BR:pt-419",
  "https://news.google.com/rss/search?q=pesca+defeso+OR+piracema+Brasil&hl=pt-BR&gl=BR&ceid=BR:pt-419",
  "https://news.google.com/rss/search?q=pescaria+tucunare+OR+dourado+OR+mar+Brasil&hl=pt-BR&gl=BR&ceid=BR:pt-419",
];

function decodeEntities(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTag(block: string, tag: string): string {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match?.[1] ? decodeEntities(match[1]) : "";
}

function classifyCategory(text: string): Exclude<NewsCategory, "todas"> {
  const lower = text.toLowerCase();
  if (
    lower.includes("defeso") ||
    lower.includes("piracema") ||
    lower.includes("ibama") ||
    lower.includes("lei") ||
    lower.includes("licença") ||
    lower.includes("fiscalização") ||
    lower.includes("proibida") ||
    lower.includes("portaria")
  ) {
    return "legislacao";
  }
  if (
    lower.includes("mar") ||
    lower.includes("litoral") ||
    lower.includes("oceano") ||
    lower.includes("praia") ||
    lower.includes("costa") ||
    lower.includes("robalo") ||
    lower.includes("atum") ||
    lower.includes("alto-mar")
  ) {
    return "mar";
  }
  if (
    lower.includes("torneio") ||
    lower.includes("campeonato") ||
    lower.includes("esportiva") ||
    lower.includes("pesque e solte") ||
    lower.includes("isca") ||
    lower.includes("recorde")
  ) {
    return "esportiva";
  }
  return "rios";
}

function parseRssXml(xml: string): FishingArticle[] {
  const items: FishingArticle[] = [];
  const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/gi);

  for (const match of itemMatches) {
    const block = match[1] ?? "";
    const rawTitle = extractTag(block, "title");
    const link = extractTag(block, "link");
    const pubDate = extractTag(block, "pubDate");
    const sourceTag = extractTag(block, "source");
    const rawDesc = extractTag(block, "description");

    if (!rawTitle || !link) continue;

    // Google News titles often end with " - Source Name"
    const parts = rawTitle.split(" - ");
    const source =
      sourceTag || (parts.length > 1 ? (parts[parts.length - 1] ?? "Portal de Notícias") : "Portal de Notícias");
    const title =
      parts.length > 1 && sourceTag && parts[parts.length - 1]?.trim() === sourceTag.trim()
        ? parts.slice(0, -1).join(" - ").trim()
        : rawTitle;

    const cleanSummary =
      rawDesc && rawDesc !== rawTitle && !rawDesc.startsWith(title)
        ? rawDesc.slice(0, 180)
        : `Matéria publicada por ${source}. Clique para ler a cobertura completa na fonte original.`;

    const parsedDate = pubDate ? new Date(pubDate) : new Date();
    const publishedAt = Number.isNaN(parsedDate.getTime())
      ? new Date().toISOString()
      : parsedDate.toISOString();

    items.push({
      id: `${link}-${title}`.slice(0, 120),
      title,
      summary: cleanSummary,
      source,
      url: link,
      publishedAt,
      category: classifyCategory(`${title} ${cleanSummary}`),
    });
  }

  return items;
}

const FALLBACK_ARTICLES: FishingArticle[] = [
  {
    id: "fallback-1",
    title: "Temporada de pesca esportiva movimenta rios do Pantanal e da Amazônia",
    summary: "Pousadas e guias registram aumento na procura pelo pesque e solte de tucunarés e dourados.",
    source: "Radar da Pesca",
    url: "https://news.google.com/search?q=pesca+esportiva+Brasil&hl=pt-BR&gl=BR",
    publishedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    category: "esportiva",
  },
  {
    id: "fallback-2",
    title: "Confira o calendário atualizado do período de defeso nas principais bacias do país",
    summary: "Regras de proteção à reprodução dos peixes definem espécies liberadas e equipamentos permitidos.",
    source: "Radar da Pesca",
    url: "https://news.google.com/search?q=periodo+defeso+pesca+Brasil&hl=pt-BR&gl=BR",
    publishedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    category: "legislacao",
  },
  {
    id: "fallback-3",
    title: "Robalos e garoupas: condições de maré favorecem a pesca embarcada no litoral",
    summary: "Pescadores de costa aproveitam águas mais limpas e ventos moderados neste fim de semana.",
    source: "Radar da Pesca",
    url: "https://news.google.com/search?q=pesca+litoral+robalo+Brasil&hl=pt-BR&gl=BR",
    publishedAt: new Date(Date.now() - 9 * 3600 * 1000).toISOString(),
    category: "mar",
  },
  {
    id: "fallback-4",
    title: "Nível dos reservatórios melhora pontos de pesca em represas do Sudeste e Centro-Oeste",
    summary: "Estruturas alagadas voltam a abrigar cardumes e animam pescadores de barranco e caiaque.",
    source: "Radar da Pesca",
    url: "https://news.google.com/search?q=pesca+represas+rios+Brasil&hl=pt-BR&gl=BR",
    publishedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    category: "rios",
  },
];

export async function fetchFishingNews(): Promise<FishingNewsResponse> {
  const results = await Promise.allSettled(
    RSS_FEEDS.map(async (feedUrl) => {
      const response = await fetch(feedUrl, {
        headers: {
          "User-Agent": "RadarDaPesca/1.0 (+https://radardapesca.app)",
          Accept: "application/rss+xml, application/xml, text/xml",
        },
      });
      if (!response.ok) {
        throw new Error(`Feed returned ${response.status}`);
      }
      const xml = await response.text();
      return parseRssXml(xml);
    }),
  );

  const seen = new Set<string>();
  const merged: FishingArticle[] = [];

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const article of result.value) {
      const key = article.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      merged.push(article);
    }
  }

  merged.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  if (merged.length === 0) {
    return {
      articles: FALLBACK_ARTICLES,
      fetchedAt: new Date().toISOString(),
      isLive: false,
    };
  }

  return {
    articles: merged.slice(0, 24),
    fetchedAt: new Date().toISOString(),
    isLive: true,
  };
}