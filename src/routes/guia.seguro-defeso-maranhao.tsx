import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Share2 } from "lucide-react";
import { AquaCadastroBanner, WhatsAppFloatingButton } from "@/components/AquaCadastroPromo";
import { HERO_IMAGE_URL, SITE_NAME, SITE_URL } from "@/lib/site";

const PAGE_URL = `${SITE_URL}/guia/seguro-defeso-maranhao`;
const PAGE_TITLE = `Seguro-Defeso no Maranhão: como dar entrada pelo MTE, prazos e normas — ${SITE_NAME}`;
const PAGE_DESC =
  "Passo a passo atualizado para solicitar o Seguro-Defeso do pescador artesanal no Maranhão pela Carteira de Trabalho Digital e Portal Emprega Brasil (MTE).";

export const Route = createFileRoute("/guia/seguro-defeso-maranhao")({
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
          headline: "Seguro-Defeso no Maranhão: como dar entrada pelo MTE, prazos e normas",
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
  component: GuiaSeguroDefesoPage,
});

function GuiaSeguroDefesoPage() {
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(
    `Veja o guia atualizado do Seguro-Defeso no Maranhão (pelo MTE / Carteira de Trabalho Digital): ${PAGE_URL}?utm_source=whatsapp&utm_medium=social`,
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
          Guia do Pescador • Maranhão
        </p>
        <h1 className="mt-2 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          Seguro-Defeso no Maranhão: como dar entrada pelo MTE, prazos e normas
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Desde 1º de novembro de 2025, os novos pedidos do Seguro-Defeso do pescador artesanal não são mais feitos pelo Meu INSS. Agora o requerimento é feito pelo Ministério do Trabalho e Emprego (MTE), na Carteira de Trabalho Digital ou no Portal Emprega Brasil.
        </p>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-bold text-card-foreground">1. Requisitos obrigatórios</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>Carteira de Pescador Profissional (RGP) ativa há pelo menos 1 ano antes do início do defeso.</li>
            <li>REAP (Relatório de Exercício da Atividade Pesqueira) entregue e em dia.</li>
            <li>Inscrição atualizada no CadÚnico, biometria cadastrada e conta Gov.br nível prata ou ouro.</li>
            <li>Exercer a pesca artesanal de forma exclusiva e não receber outro benefício previdenciário ou assistencial.</li>
          </ul>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-bold text-card-foreground">2. Prazo para dar entrada</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            O pedido pode ser feito a partir de <strong>30 dias antes</strong> do início do período de defeso até <strong>90 dias depois</strong> do início, conforme ampliação divulgada pelo MPA/MTE.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><strong>Peixes de água doce (rios do MA):</strong> referência de 1º de dezembro a 30 de março.</li>
            <li><strong>Camarão (litoral):</strong> referência de 1º de março a 31 de maio.</li>
            <li><strong>Lagosta:</strong> referência de 1º de novembro a 30 de abril.</li>
            <li><strong>Caranguejo-uçá (andada):</strong> datas definidas por portarias estaduais e federais a cada ano.</li>
          </ul>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-bold text-card-foreground">3. Passo a passo para solicitar</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>Confirme no PesqBrasil se seu RGP está ativo e com o REAP regularizado.</li>
            <li>Acesse o aplicativo <strong>Carteira de Trabalho Digital</strong> ou o <strong>Portal Emprega Brasil</strong> com sua conta Gov.br (prata ou ouro).</li>
            <li>Escolha a opção <strong>Benefícios → Seguro-Defeso</strong> e confira seus dados pessoais e bancários.</li>
            <li>Se preferir apoio presencial, procure sua colônia, sindicato ou associação de pescadores.</li>
          </ol>
          <div className="mt-5 flex flex-wrap gap-4">
            <a
              href="https://www.gov.br/pt-br/servicos/solicitar-seguro-defeso-pescador-artesanal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              Solicitar no Gov.br (MTE)
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href="https://servicos.mte.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              Acessar Portal Emprega Brasil
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <Link
              to="/guia/rgp-suspenso-reativacao"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              RGP suspenso? Veja como reativar
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