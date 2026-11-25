import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Search } from "lucide-react";
import { WhatsAppFloatingButton } from "@/components/AquaCadastroPromo";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  RECENT_NEWS_DAYS,
  fishingNewsQueryOptions,
  formatPublishedDate,
  prioritizeArticles,
  splitRecentAndArchivedArticles,
  type NewsCategory,
} from "@/lib/fishing-news";
import { HERO_IMAGE_URL, SITE_NAME, SITE_URL } from "@/lib/site";

const PAGE_TITLE = `Notícias anteriores — ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  "Arquivo de notícias anteriores sobre pesca no Maranhão, Seguro-Defeso, RGP, portarias, Câmara, Senado, Brasil e mundo.";
const CANONICAL_URL = `${SITE_URL}/arquivo`;

export const Route = createFileRoute("/arquivo")({
  loader: ({ context }) => context.queryClient.ensureQueryData(fishingNewsQueryOptions),
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESCRIPTION },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL_URL },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:image", content: HERO_IMAGE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: PAGE_DESCRIPTION },
      { name: "twitter:image", content: HERO_IMAGE_URL },
    ],
    links: [{ rel: "canonical", href: CANONICAL_URL }],
  }),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-foreground">Não foi possível carregar o arquivo</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {error instanceof Error ? error.message : "Tente novamente em instantes."}
      </p>
      <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
        <ArrowLeft className="h-4 w-4" />
        Voltar para notícias recentes
      </Link>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-foreground">Página não encontrada</h1>
      <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
        <ArrowLeft className="h-4 w-4" />
        Voltar para o Radar da Pesca
      </Link>
    </div>
  ),
  component: ArquivoNoticiasPage,
});

function ArquivoNoticiasPage() {
  const { data } = useSuspenseQuery(fishingNewsQueryOptions);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>("todas");
  const [searchTerm, setSearchTerm] = useState("");

  const archivedArticles = useMemo(() => {
    const { archived } = splitRecentAndArchivedArticles(data.articles);
    const query = searchTerm.trim().toLowerCase();
    const filtered = archived.filter((article) => {
      const matchesCategory =
        selectedCategory === "todas" || article.category === selectedCategory;
      const matchesQuery =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.source.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
    return prioritizeArticles(filtered);
  }, [data.articles, selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para as notícias dos últimos {RECENT_NEWS_DAYS} dias
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-card-foreground sm:text-4xl">
              Notícias anteriores
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Matérias sobre pesca no Maranhão, no Brasil e no mundo publicadas há mais de {RECENT_NEWS_DAYS} dias.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section aria-label="Filtros do arquivo" className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
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
              placeholder="Buscar no arquivo..."
              aria-label="Buscar notícias anteriores"
              className="w-full rounded-full border border-input bg-card py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </section>

        {archivedArticles.length === 0 ? (
          <section className="py-16 text-center">
            <h2 className="text-xl font-bold text-foreground">Nenhuma notícia anterior encontrada</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tente outra categoria ou volte para a página inicial com as notícias mais recentes.
            </p>
            <Link
              to="/"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <ArrowLeft className="h-4 w-4" />
              Ver notícias recentes
            </Link>
          </section>
        ) : (
          <section aria-label="Lista de notícias anteriores" className="mt-8">
            <div className="mb-5 flex items-baseline justify-between gap-4">
              <h2 className="text-xl font-bold text-foreground">
                {selectedCategory === "todas" ? "Todas as anteriores" : CATEGORY_LABELS[selectedCategory]}
              </h2>
              <span className="text-xs text-muted-foreground">
                {archivedArticles.length} {archivedArticles.length === 1 ? "notícia" : "notícias"}
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {archivedArticles.map((article) => (
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
      </main>

      <WhatsAppFloatingButton />
    </div>
  );
}