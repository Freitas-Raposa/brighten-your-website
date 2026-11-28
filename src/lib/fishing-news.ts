import { queryOptions } from "@tanstack/react-query";
import { getFishingNews } from "./fishing-news.functions";

export type NewsCategory =
  | "todas"
  | "entrevistas"
  | "maranhao"
  | "seguro_defeso"
  | "piscicultura"
  | "congresso"
  | "legislacao"
  | "esportiva"
  | "rios"
  | "mar"
  | "mundo";

export const CATEGORY_LABELS: Record<NewsCategory, string> = {
  todas: "Todas",
  entrevistas: "Entrevistas do Defeso",
  maranhao: "Maranhão",
  seguro_defeso: "Seguro-Defeso e RGP",
  piscicultura: "Piscicultura",
  congresso: "Câmara e Senado",
  legislacao: "Portarias",
  esportiva: "Pesca Esportiva",
  rios: "Rios e Lagos",
  mar: "Mar e Costa",
  mundo: "Brasil e Mundo",
};

export const CATEGORY_ORDER: NewsCategory[] = [
  "todas",
  "entrevistas",
  "maranhao",
  "seguro_defeso",
  "piscicultura",
  "congresso",
  "legislacao",
  "esportiva",
  "rios",
  "mar",
  "mundo",
];

export function prioritizeArticles<T extends { category: string; publishedAt: string }>(
  articles: T[],
): T[] {
  const rank = (category: string): number => {
    if (category === "entrevistas") return 0;
    if (category === "maranhao") return 1;
    return 2;
  };
  return [...articles].sort((a, b) => {
    const rankDiff = rank(a.category) - rank(b.category);
    if (rankDiff !== 0) return rankDiff;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

export const AUTO_REFRESH_INTERVAL_MS = 5 * 60 * 1000;
export const RECENT_NEWS_DAYS = 3;

export function splitRecentAndArchivedArticles<T extends { publishedAt: string }>(
  articles: T[],
  nowMs: number = Date.now(),
): { recent: T[]; archived: T[] } {
  const cutoffMs = nowMs - RECENT_NEWS_DAYS * 24 * 60 * 60 * 1000;
  const recent: T[] = [];
  const archived: T[] = [];

  for (const article of articles) {
    const time = new Date(article.publishedAt).getTime();
    if (Number.isNaN(time) || time >= cutoffMs) {
      recent.push(article);
    } else {
      archived.push(article);
    }
  }

  return { recent, archived };
}

export const fishingNewsQueryOptions = queryOptions({
  queryKey: ["fishing-news"],
  queryFn: () => getFishingNews(),
  staleTime: 2 * 60 * 1000,
  refetchInterval: AUTO_REFRESH_INTERVAL_MS,
  refetchOnWindowFocus: true,
});

export function formatPublishedDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Recente";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return "Agora mesmo";
  if (diffMinutes < 60) return `há ${diffMinutes} min`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `há ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`;

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}