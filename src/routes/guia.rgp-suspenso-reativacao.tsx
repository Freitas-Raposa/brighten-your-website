import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Share2 } from "lucide-react";
import { AquaCadastroBanner, WhatsAppFloatingButton } from "@/components/AquaCadastroPromo";
import { HERO_IMAGE_URL, SITE_NAME, SITE_URL } from "@/lib/site";

const PAGE_URL = `${SITE_URL}/guia/rgp-suspenso-reativacao`;
const PAGE_TITLE = `RGP suspenso ou cancelado: como consultar e reativar a carteira de pescador — ${SITE_NAME}`;
const PAGE_DESC =
  "Saiba por que a carteira do pescador (RGP) pode ser suspensa e o passo a passo oficial para consultar a situação e pedir reativação no PesqBrasil.";

export const Route = createFileRoute("/guia/rgp-suspenso-reativacao")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESC },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:image", content: HERO_IMAGE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: PAGE_DESC },
      { name: "twitter:image", content: HERO_IMAGE_URL },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "RGP suspenso ou cancelado: como consultar e reativar a carteira de pescador",
          description: PAGE_DESC,
          inLanguage: "pt-BR",
          datePublished: "2026-11-25",
          dateModified: "2026-11-25",
          mainEntityOfPage: PAGE_URL,
          publisher: { "@type": "NewsMediaOrganization", name: SITE_NAME, url: SITE_URL },
        }),
      },
    ],
  }),
  component: GuiaRgpSuspensoPage,
});

function GuiaRgpSuspensoPage() {
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(
    `Veja como consultar e pedir reativação da carteira de pescador (RGP suspenso): ${PAGE_URL}?utm_source=whatsapp&utm_medium=social`,
  )}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Voltar para o Radar da Pesca
          </Link>
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
          >
            <Share2 className="h-3.5 w-3.5" />
            Compartilhar no WhatsApp
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Guia do Pescador • RGP e PesqBrasil
        </p>
        <h1 className="mt-2 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          RGP suspenso ou cancelado: como consultar e reativar a carteira de pescador
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Sem a carteira do RGP ativa, o pescador artesanal não consegue receber o Seguro-Defeso. Veja os motivos mais comuns de suspensão e como regularizar no portal oficial do Ministério da Pesca e Aquicultura (MPA).
        </p>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-bold text-card-foreground">Por que o RGP fica suspenso?</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>Falta de entrega do REAP (Relatório de Exercício da Atividade Pesqueira) dentro do prazo.</li>
            <li>Pendência ou divergência de dados no CPF, CadÚnico ou endereço.</li>
            <li>Cruzamento de dados com outro vínculo de trabalho formal ou benefício incompatível.</li>
          </ul>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-bold text-card-foreground">Como consultar e pedir reativação</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>Entre no sistema <strong>PesqBrasil (RGP)</strong> usando sua conta Gov.br (prata ou ouro).</li>
            <li>Verifique a situação da sua licença (Ativa, Suspensa ou Cancelada) e leia o motivo informado.</li>
            <li>Envie o REAP pendente ou anexe os documentos de defesa/recurso pedidos pelo sistema.</li>
            <li>Acompanhe o andamento pelo próprio PesqBrasil ou com apoio da sua colônia, sindicato ou associação.</li>
          </ol>
          <div className="mt-5 flex flex-wrap gap-4">
            <a
              href="https://www.gov.br/mpa/pt-br/assuntos/pesca/registro-geral-da-atividade-pesqueira-rgp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              Consultar RGP no site do MPA
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <Link
              to="/guia/seguro-defeso-maranhao"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              Ver guia do Seguro-Defeso no Maranhão
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <AquaCadastroBanner />
      <WhatsAppFloatingButton />
    </div>
  );
}