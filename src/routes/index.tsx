import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, RefreshCw, Search } from "lucide-react";
import heroImage from "@/assets/radar-pesca-hero.jpg";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  fishingNewsQueryOptions,
  formatPublishedDate,
  type NewsCategory,
} from "@/lib/fishing-news";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(fishingNewsQueryOptions),
  head: () => ({
    meta: [
      { title: "Radar da Pesca — Notícias de Pesca em um só lugar" },
      {
        name: "description",
        content: "Acompanhe as últimas notícias de pesca esportiva, rios, mar e defeso reunidas em um só lugar.",
      },
      { property: "og:title", content: "Radar da Pesca — Notícias de Pesca em um só lugar" },
      {
        property: "og:description",
        content: "Acompanhe as últimas notícias de pesca esportiva, rios, mar e defeso reunidas em um só lugar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RadarDaPescaHome,
});

function RadarDaPescaHome() {
  const { data, isFetching, refetch } = useSuspenseQuery(fishingNewsQueryOptions);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>("todas");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredArticles = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return data.articles.filter((article) => {
      const matchesCategory =
        selectedCategory === "todas" || article.category === selectedCategory;
      const matchesQuery =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.source.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [data.articles, selectedCategory, searchTerm]);

  const featured = filteredArticles[0];
  const restArticles = filteredArticles.slice(1);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="relative min-h-[58vh] w-full overflow-hidden">
        <img
          src={heroImage}
          alt="Pescador lançando tarrafa no rio ao pôr do sol com barcos de madeira"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-hero-overlay/90 via-hero-overlay/45 to-hero-overlay/30" />

        <div className="relative mx-auto flex min-h-[58vh] max-w-6xl flex-col justify-between px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <span className="font-display text-lg font-bold tracking-tight text-hero-foreground">
              Radar da Pesca
            </span>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 rounded-full bg-sunset px-4 py-2 text-sm font-semibold text-sunset-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              {isFetching ? "Atualizando..." : "Atualizar notícias"}
            </button>
          </div>

          <div className="max-w-2xl pb-8 pt-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sunset">
              Portal de Notícias
            </p>
            <h1 className="mt-3 text-5xl font-bold leading-[1.05] tracking-tight text-hero-foreground sm:text-6xl lg:text-7xl">
              Radar da Pesca
            </h1>
            <p className="mt-4 text-base leading-relaxed text-hero-foreground/85 sm:text-lg">
              As principais notícias sobre pesca esportiva, rios, mar, Maranhão e defeso reunidas da internet em um só lugar.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section aria-label="Filtros e busca" className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORY_ORDER.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                >
                  {CATEGORY_LABELS[category]}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar assunto ou fonte..."
              aria-label="Buscar notícias de pesca"
              className="w-full rounded-full border border-input bg-card py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </section>

        {!featured ? (
          <section className="py-16 text-center">
            <h2 className="text-2xl font-bold text-foreground">Nenhuma notícia encontrada</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tente outro termo de busca ou volte para todas as categorias.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("todas");
                setSearchTerm("");
              }}
              className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Mostrar todas as notícias
            </button>
          </section>
        ) : (
          <>
            <section aria-label="Destaque principal" className="mt-8 border-b border-border pb-8">
              <a
                href={featured.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40 sm:p-8"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground">
                  <span className="rounded-full bg-accent px-3 py-1 font-semibold text-accent-foreground">
                    {CATEGORY_LABELS[featured.category]}
                  </span>
                  <span>{featured.source}</span>
                  <span>•</span>
                  <span>{formatPublishedDate(featured.publishedAt)}</span>
                </div>
                <h2 className="mt-4 text-2xl font-bold leading-snug text-card-foreground transition-colors group-hover:text-primary sm:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
                  {featured.summary}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Ler matéria completa
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            </section>

            {restArticles.length > 0 && (
              <section aria-label="Mais notícias de pesca" className="mt-8">
                <div className="mb-5 flex items-baseline justify-between gap-4">
                  <h2 className="text-2xl font-bold text-foreground">Últimas notícias</h2>
                  <span className="text-xs text-muted-foreground">
                    {filteredArticles.length} {filteredArticles.length === 1 ? "notícia" : "notícias"}
                  </span>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {restArticles.map((article) => (
                    <a
                      key={article.id}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                          <span className="font-semibold text-primary">
                            {CATEGORY_LABELS[article.category]}
                          </span>
                          <span>{formatPublishedDate(article.publishedAt)}</span>
                        </div>
                        <h3 className="mt-3 text-lg font-bold leading-snug text-card-foreground transition-colors group-hover:text-primary">
                          {article.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                          {article.summary}
                        </p>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-3 text-xs font-medium text-muted-foreground">
                        <span className="truncate">{article.source}</span>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <footer className="mt-12 border-t border-border bg-muted/40">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <p className="font-medium text-foreground">Radar da Pesca</p>
          <p>
            {data.isLive ? "Notícias atualizadas da internet" : "Seleção de notícias"} •{" "}
            {formatPublishedDate(data.fetchedAt)}
          </p>
        </div>
      </footer>
    </div>
  );
}
