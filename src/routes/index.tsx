import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, RefreshCw, Search } from "lucide-react";
import heroImage from "@/assets/radar-pesca-hero.jpg";
import {
  ADVERTISE_WHATSAPP_URL,
  AQUACADASTRO_URL,
  AquaCadastroBanner,
  AquaCadastroCard,
  WHATSAPP_DISPLAY,
  WHATSAPP_URL,
  WhatsAppFloatingButton,
} from "@/components/AquaCadastroPromo";
import { DefesoRgpGuide } from "@/components/DefesoRgpGuide";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  fishingNewsQueryOptions,
  formatPublishedDate,
  prioritizeArticles,
  type NewsCategory,
} from "@/lib/fishing-news";
import { HERO_IMAGE_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const PAGE_TITLE = `${SITE_NAME} — Notícias de Pesca em um só lugar`;
const CANONICAL_URL = `${SITE_URL}/`;

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(fishingNewsQueryOptions),
  head: () => ({
    meta: [
      { name: "google-site-verification", content: "jO8QfOeKJyEjBA8kYmeuCw6hogU68dMC9FAycfkpGZE" },
      { title: PAGE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL_URL },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:image", content: HERO_IMAGE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      { name: "twitter:image", content: HERO_IMAGE_URL },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "NewsMediaOrganization",
              "@id": `${SITE_URL}/#organizacao`,
              name: SITE_NAME,
              url: SITE_URL,
              description: SITE_DESCRIPTION,
            },
            {
              "@type": "WebSite",
              "@id": `${SITE_URL}/#site`,
              url: SITE_URL,
              name: SITE_NAME,
              description: SITE_DESCRIPTION,
              inLanguage: "pt-BR",
              publisher: { "@id": `${SITE_URL}/#organizacao` },
            },
            {
              "@type": "CollectionPage",
              "@id": `${SITE_URL}/#pagina`,
              url: CANONICAL_URL,
              name: PAGE_TITLE,
              description: SITE_DESCRIPTION,
              inLanguage: "pt-BR",
              isPartOf: { "@id": `${SITE_URL}/#site` },
            },
          ],
        },
      },
    ],
    links: [{ rel: "canonical", href: CANONICAL_URL }],
  }),
  component: RadarDaPescaHome,
});

function RadarDaPescaHome() {
  const { data, isFetching, refetch } = useSuspenseQuery(fishingNewsQueryOptions);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>("todas");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredArticles = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const filtered = data.articles.filter((article) => {
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
            <div className="flex items-center gap-2">
              <a
                href={ADVERTISE_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-hero-foreground/30 bg-hero-overlay/40 px-3.5 py-2 text-sm font-semibold text-hero-foreground backdrop-blur-sm transition-colors hover:bg-hero-overlay/65"
              >
                Anuncie aqui
              </a>
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
          </div>

          <div className="max-w-2xl pb-8 pt-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sunset">
              Portal de Notícias
            </p>
            <h1 className="mt-3 text-5xl font-bold leading-[1.05] tracking-tight text-hero-foreground sm:text-6xl lg:text-7xl">
              Radar da Pesca
            </h1>
            <p className="mt-4 text-base leading-relaxed text-hero-foreground/85 sm:text-lg">
              Destaque para a pesca no Maranhão, Seguro-Defeso, RGP, leis na Câmara e no Senado e notícias de pesca no Brasil e no mundo.
            </p>
          </div>
        </div>
      </header>

      <AquaCadastroBanner />

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
                  <h2 className="text-2xl font-bold text-foreground">
                    {selectedCategory === "todas" ? "Maranhão, Brasil e Mundo" : CATEGORY_LABELS[selectedCategory]}
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {filteredArticles.length} {filteredArticles.length === 1 ? "notícia" : "notícias"}
                  </span>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {restArticles.slice(0, 2).map((article) => (
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

                  <AquaCadastroCard />
                </div>

                <DefesoRgpGuide
                  onFilterCongresso={() => setSelectedCategory("congresso")}
                  onFilterSeguroDefeso={() => setSelectedCategory("seguro_defeso")}
                />

                {restArticles.length > 2 && (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {restArticles.slice(2).map((article) => (
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
                )}
              </section>
            )}
          </>
        )}

        {restArticles.length === 0 && (
          <DefesoRgpGuide
            onFilterCongresso={() => setSelectedCategory("congresso")}
            onFilterSeguroDefeso={() => setSelectedCategory("seguro_defeso")}
          />
        )}
      </main>

      <footer className="mt-12 border-t border-border bg-muted/40">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-6 pb-20 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6 sm:pb-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p className="font-medium text-foreground">Radar da Pesca</p>
            <a
              href={AQUACADASTRO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              AquaCadastro
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              WhatsApp: {WHATSAPP_DISPLAY}
            </a>
            <a
              href={ADVERTISE_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              Anuncie aqui
            </a>
          </div>
          <p>
            {data.isLive ? "Atualização automática a cada 5 min" : "Seleção de notícias"} •{" "}
            {formatPublishedDate(data.fetchedAt)}
          </p>
        </div>
      </footer>

      <WhatsAppFloatingButton />
    </div>
  );
}
