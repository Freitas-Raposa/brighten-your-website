import { queryOptions } from "@tanstack/react-query";
import { getFishingNews } from "./fishing-news.functions";

export type NewsCategory =
  | "todas"
  | "maranhao"
  | "seguro_defeso"
  | "congresso"
  | "legislacao"
  | "esportiva"
  | "rios"
  | "mar"
  | "mundo";

export const CATEGORY_LABELS: Record<NewsCategory, string> = {
  todas: "Todas",
  maranhao: "Maranhão",
  seguro_defeso: "Seguro-Defeso e RGP",
  congresso: "Câmara e Senado",
  legislacao: "Portarias",
  esportiva: "Pesca Esportiva",
  rios: "Rios e Lagos",
  mar: "Mar e Costa",
  mundo: "Brasil e Mundo",
};

export const CATEGORY_ORDER: NewsCategory[] = [
  "todas",
  "maranhao",
  "seguro_defeso",
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
  return [...articles].sort((a, b) => {
    const aMaranhao = a.category === "maranhao" ? 0 : 1;
    const bMaranhao = b.category === "maranhao" ? 0 : 1;
    if (aMaranhao !== bMaranhao) return aMaranhao - bMaranhao;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

export const AUTO_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

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
  }).format(date);
}