import { queryOptions } from "@tanstack/react-query";
import { getFishingNews } from "./fishing-news.functions";

export type NewsCategory = "todas" | "esportiva" | "rios" | "mar" | "maranhao" | "legislacao";

export const CATEGORY_LABELS: Record<NewsCategory, string> = {
  todas: "Todas",
  maranhao: "Maranhão",
  legislacao: "Portarias e Defeso",
  esportiva: "Pesca Esportiva",
  rios: "Rios e Lagos",
  mar: "Mar e Costa",
};

export const CATEGORY_ORDER: NewsCategory[] = [
  "todas",
  "maranhao",
  "legislacao",
  "esportiva",
  "rios",
  "mar",
];

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