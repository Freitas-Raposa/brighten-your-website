import { ArrowUpRight, MessageCircle } from "lucide-react";

export const AQUACADASTRO_URL = "https://aquadastro.online";
export const WHATSAPP_DISPLAY = "(98) 99609-4477";
export const WHATSAPP_URL =
  "https://wa.me/5598996094477?text=Ol%C3%A1%21%20Vi%20o%20AquaCadastro%20no%20Radar%20da%20Pesca%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.";

export function AquaCadastroBanner() {
  return (
    <section aria-label="Divulgação AquaCadastro" className="border-b border-border bg-promo text-promo-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-promo-accent">
            AquaCadastro • Gestão para Entidades de Pesca
          </p>
          <h2 className="mt-1 text-lg font-bold leading-snug sm:text-xl">
            Automatize cadastros, mensalidades, carteirinhas e RGP da sua colônia, sindicato ou associação.
          </h2>
        </div>

        <a
          href={AQUACADASTRO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-promo-accent px-5 py-2.5 text-sm font-bold text-promo-accent-foreground transition-opacity hover:opacity-90"
        >
          Acessar AquaCadastro
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}

export function AquaCadastroCard() {
  return (
    <a
      href={AQUACADASTRO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col justify-between rounded-xl border border-promo-accent/35 bg-promo p-5 text-promo-foreground transition-colors hover:border-promo-accent"
    >
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-promo-accent">
          Solução Recomendada
        </span>
        <h3 className="mt-3 text-lg font-bold leading-snug">
          AquaCadastro: diga adeus à papelada manual na sua entidade de pesca
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-promo-foreground/85">
          Gerencie sócios, emita carteirinhas, controle mensalidades e mantenha a documentação do RGP sempre em dia.
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-promo-foreground/15 pt-3 text-xs font-semibold text-promo-accent">
        <span>aquadastro.online</span>
        <span className="inline-flex items-center gap-1">
          Conhecer agora
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </a>
  );
}

export function WhatsAppFloatingButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Falar no WhatsApp ${WHATSAPP_DISPLAY}`}
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-sm font-semibold text-whatsapp-foreground shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle className="h-5 w-5" />
      <span>WhatsApp</span>
    </a>
  );
}