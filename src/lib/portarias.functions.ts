import { createServerFn } from "@tanstack/react-start";
import { fetchPortarias } from "./portarias.server";

export const getPortarias = createServerFn({ method: "GET" })
  .inputValidator((input: { term: string }) => {
    if (typeof input?.term !== "string" || input.term.length > 120) {
      throw new Error("Informe até 120 caracteres para buscar a portaria.");
    }
    return { term: input.term.trim() };
  })
  .handler(async ({ data }) => fetchPortarias(data.term));