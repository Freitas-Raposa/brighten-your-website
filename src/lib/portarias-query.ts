import { queryOptions } from "@tanstack/react-query";
import { getPortarias } from "./portarias.functions";
import { PORTARIA_REFRESH_MS } from "./portarias";

export const portariasQueryOptions = (term = "") => queryOptions({
  queryKey: ["portarias", term],
  queryFn: () => getPortarias({ data: { term } }),
  staleTime: 2 * 60 * 1000,
  refetchInterval: PORTARIA_REFRESH_MS,
  refetchOnWindowFocus: true,
});