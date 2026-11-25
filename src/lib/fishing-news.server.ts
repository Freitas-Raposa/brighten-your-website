import { prioritizeArticles, type NewsCategory } from "./fishing-news";

export type { NewsCategory };

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

export const RSS_FEEDS = [
  "https://news.google.com/rss/search?q=pesca+OR+pescadores+Maranh%C3%A3o&hl=pt-BR&gl=BR&ceid=BR:pt-419",
  "https://news.google.com/rss/search?q=defeso+OR+seguro-defeso+Maranh%C3%A3o&hl=pt-BR&gl=BR&ceid=BR:pt-419",
  "https://news.google.com/rss/search?q=pesca+%22S%C3%A3o+Lu%C3%ADs%22+OR+Raposa+OR+Alc%C3%A2ntara+OR+Tut%C3%B3ia+OR+%22Baixada+Maranhense%22&hl=pt-BR&gl=BR&ceid=BR:pt-419",
  "https://news.google.com/rss/search?q=%22seguro-defeso%22+OR+%22seguro+defeso%22+pescador+artesanal+INSS&hl=pt-BR&gl=BR&ceid=BR:pt-419",
  "https://news.google.com/rss/search?q=RGP+OR+%22carteira+de+pescador%22+suspens%C3%A3o+OR+reativa%C3%A7%C3%A3o+OR+PesqBrasil&hl=pt-BR&gl=BR&ceid=BR:pt-419",
  "https://news.google.com/rss/search?q=pesca+OR+pescadores+%22C%C3%A2mara+dos+Deputados%22+OR+%22Senado+Federal%22+OR+%22projeto+de+lei%22&hl=pt-BR&gl=BR&ceid=BR:pt-419",
  "https://news.google.com/rss/search?q=portaria+pesca+OR+pescadores+OR+MPA+OR+IBAMA&hl=pt-BR&gl=BR&ceid=BR:pt-419",
  "https://news.google.com/rss/search?q=%22nova+portaria%22+OR+%22portaria+interministerial%22+pesca+OR+defeso+OR+RGP&hl=pt-BR&gl=BR&ceid=BR:pt-419",
  "https://news.google.com/rss/search?q=pesca+esportiva+Brasil&hl=pt-BR&gl=BR&ceid=BR:pt-419",
  "https://news.google.com/rss/search?q=pesca+defeso+OR+piracema+Brasil&hl=pt-BR&gl=BR&ceid=BR:pt-419",
  "https://news.google.com/rss/search?q=pescaria+tucunare+OR+dourado+OR+mar+Brasil&hl=pt-BR&gl=BR&ceid=BR:pt-419",
  "https://news.google.com/rss/search?q=pesca+mundial+OR+internacional+OR+FAO+OR+oceanos&hl=pt-BR&gl=BR&ceid=BR:pt-419",
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

export function classifyCategory(text: string): Exclude<NewsCategory, "todas"> {
  const lower = text.toLowerCase();
  if (
    lower.includes("maranhão") ||
    lower.includes("maranhao") ||
    lower.includes("maranhense") ||
    lower.includes("são luís") ||
    lower.includes("sao luis") ||
    lower.includes("ilha do maranhão") ||
    lower.includes("raposa") ||
    lower.includes("alcântara") ||
    lower.includes("alcantara") ||
    lower.includes("tutóia") ||
    lower.includes("tutoia") ||
    lower.includes("barreirinhas") ||
    lower.includes("baixada maranhense") ||
    lower.includes("cururupu") ||
    lower.includes("carutapera")
  ) {
    return "maranhao";
  }
  if (
    lower.includes("câmara dos deputados") ||
    lower.includes("camara dos deputados") ||
    lower.includes("senado federal") ||
    lower.includes("congresso nacional") ||
    lower.includes("projeto de lei") ||
    lower.includes("tramitação") ||
    lower.includes("tramitacao") ||
    lower.includes("deputado") ||
    lower.includes("senador")
  ) {
    return "congresso";
  }
  if (
    lower.includes("seguro-defeso") ||
    lower.includes("seguro defeso") ||
    lower.includes("pesqbrasil") ||
    lower.includes("carteira de pescador") ||
    lower.includes("carteira do pescador") ||
    lower.includes("reativação") ||
    lower.includes("reativacao") ||
    lower.includes("suspensão") ||
    lower.includes("suspensao") ||
    lower.includes("rgp") ||
    lower.includes("inss")
  ) {
    return "seguro_defeso";
  }
  if (
    lower.includes("portaria") ||
    lower.includes("instrução normativa") ||
    lower.includes("instrucao normativa") ||
    lower.includes("decreto") ||
    lower.includes("diário oficial") ||
    lower.includes("diario oficial") ||
    lower.includes("ministério da pesca") ||
    lower.includes("ministerio da pesca") ||
    lower.includes("defeso") ||
    lower.includes("piracema") ||
    lower.includes("ibama") ||
    lower.includes("lei") ||
    lower.includes("licença") ||
    lower.includes("fiscalização") ||
    lower.includes("proibida")
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
  if (
    lower.includes("mundial") ||
    lower.includes("internacional") ||
    lower.includes("fao") ||
    lower.includes("europa") ||
    lower.includes("eua") ||
    lower.includes("china") ||
    lower.includes("exterior") ||
    lower.includes("mundo")
  ) {
    return "mundo";
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
    id: "fallback-5",
    title: "Defeso no Maranhão: veja as regras e as espécies protegidas no litoral e nos rios",
    summary: "Período de proteção à reprodução dos peixes traz restrições à pesca e seguro-defeso para pescadores artesanais.",
    source: "Radar da Pesca",
    url: "https://news.google.com/search?q=defeso+Maranh%C3%A3o+pescadores&hl=pt-BR&gl=BR",
    publishedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    category: "maranhao",
  },
  {
    id: "fallback-6",
    title: "Pescadores do Maranhão acompanham calendário do seguro-defeso e fiscalização no litoral",
    summary: "Comunidades pesqueiras de São Luís, Raposa, Alcântara e região dos Lençóis se organizam para o período de defeso.",
    source: "Radar da Pesca",
    url: "https://news.google.com/search?q=pesca+Maranh%C3%A3o&hl=pt-BR&gl=BR",
    publishedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    category: "maranhao",
  },
  {
    id: "fallback-7",
    title: "Projetos de lei sobre pesca artesanal avançam na Câmara dos Deputados e no Senado",
    summary: "Propostas em tramitação no Congresso tratam de apoio ao pescador artesanal, seguro-defeso e registro profissional.",
    source: "Radar da Pesca",
    url: "https://www.camara.leg.br/busca-portal?contextoBusca=BuscaProposicoes&pagina=1&order=relevancia&abaEspecifica=true&q=pesca+artesanal",
    publishedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    category: "congresso",
  },
  {
    id: "fallback-8",
    title: "Seguro-Defeso e RGP: como consultar suspensão e pedir reativação da carteira de pescador",
    summary: "Veja os requisitos do INSS e do PesqBrasil para manter a documentação regularizada antes do início do defeso.",
    source: "Radar da Pesca",
    url: "https://www.gov.br/mpa/pt-br/assuntos/pesca/registro-geral-da-atividade-pesqueira-rgp",
    publishedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    category: "seguro_defeso",
  },
  {
    id: "fallback-1",
    title: "Temporada de pesca esportiva movimenta rios do Pantanal e da Amazônia",
    summary: "Pousadas e guias registram aumento na procura pelo pesque e solte de tucunarés e dourados.",
    source: "Radar da Pesca",
    url: "https://news.google.com/search?q=pesca+esportiva+Brasil&hl=pt-BR&gl=BR",
    publishedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    category: "esportiva",
  },
  {
    id: "fallback-2",
    title: "Confira o calendário atualizado do período de defeso nas principais bacias do país",
    summary: "Regras de proteção à reprodução dos peixes definem espécies liberadas e equipamentos permitidos.",
    source: "Radar da Pesca",
    url: "https://news.google.com/search?q=periodo+defeso+pesca+Brasil&hl=pt-BR&gl=BR",
    publishedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
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
    id: "fallback-9",
    title: "Relatório da FAO destaca crescimento sustentável da pesca artesanal no Brasil e no mundo",
    summary: "Organização aponta o papel das comunidades costeiras na segurança alimentar e no manejo dos oceanos.",
    source: "Radar da Pesca",
    url: "https://news.google.com/search?q=pesca+mundial+FAO&hl=pt-BR&gl=BR",
    publishedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    category: "mundo",
  },
];

export async function fetchFishingNews(): Promise<FishingNewsResponse> {
  const results = await Promise.allSettled(
    RSS_FEEDS.map(async (feedUrl) => {
      const response = await fetch(feedUrl, {
        cache: "no-store",
        headers: {
          "User-Agent": "RadarDaPesca/1.0 (+https://radardapesca.aquadastro.online)",
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

  const prioritized = prioritizeArticles(merged);

  if (prioritized.length === 0) {
    return {
      articles: prioritizeArticles(FALLBACK_ARTICLES),
      fetchedAt: new Date().toISOString(),
      isLive: false,
    };
  }

  return {
    articles: prioritized.slice(0, 42),
    fetchedAt: new Date().toISOString(),
    isLive: true,
  };
}