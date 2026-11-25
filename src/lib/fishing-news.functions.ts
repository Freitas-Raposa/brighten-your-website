import { createServerFn } from "@tanstack/react-start";
import { fetchFishingNews } from "./fishing-news.server";

export const getFishingNews = createServerFn({ method: "GET" }).handler(async () => {
  return fetchFishingNews();
});