import { useState } from "react";
import { ArrowLeft, ArrowUpRight, MessageCircle, Sparkles, X } from "lucide-react";
import {
  ADVERTISE_WHATSAPP_URL,
  AQUACADASTRO_URL,
  WHATSAPP_URL,
} from "./AquaCadastroPromo";

const HELP_WHATSAPP_URL = `https://wa.me/5598996094477?text=${encodeURIComponent(
  "Olá! Preciso de ajuda com o Seguro-Defeso / RGP do pescador.",
)}`;

type ActionLink = {
  label: string;
  href: string;
  /** true = botão verde de WhatsApp; false/ausente = botão de link normal. */
  wa?: boolean;
};

type Answer = {
  pergunta: string;
  resposta: string;
  links?: ActionLink[];
};

type Topic = {
  id: string;
  label: string;
  intro: string;
  perguntas: Answer[];
};

const TOPICS: Topic[] = [
  {
    id: "seguro-defeso",
    label: "Seguro-Defeso",
    intro: "Benefício do pescador artesanal no período de defeso.",
    perguntas: [
      {
        pergunta: "O que é o Seguro-Defeso?",
        resposta:
          "É um benefício pago ao pescador artesanal durante o período em que a pesca fica proibida (defeso), para proteger a reprodução dos peixes. O valor é de um salário mínimo por mês de defeso.",
      },
      {
        pergunta: "Quem tem direito?",
        resposta:
          "Quem tem o RGP (carteira de pescador) ativo há pelo menos 1 ano, REAP em dia, CadÚnico atualizado, conta Gov.br prata ou ouro, exerce a pesca artesanal de forma exclusiva e não recebe outro benefício.",
      },
      {
        pergunta: "Como dou entrada?",
        resposta:
          "Desde novembro de 2025, o pedido é feito pelo Ministério do Trabalho (MTE), na Carteira de Trabalho Digital ou no Portal Emprega Brasil — ou com apoio da sua colônia, sindicato ou associação.",
        links: [
          { label: "Ler o guia completo", href: "/guia/seguro-defeso-brasil" },
          {
            label: "Solicitar no Gov.br (MTE)",
            href: "https://www.gov.br/pt-br/servicos/solicitar-seguro-defeso-pescador-artesanal",
          },
          { label: "Falar no WhatsApp", href: HELP_WHATSAPP_URL, wa: true },
        ],
      },
      {
        pergunta: "Qual é o prazo?",
        resposta:
          "O pedido pode ser feito de 30 dias antes até 90 dias depois do início do período de defeso.",
      },
      {
        pergunta: "Quando começa o defeso?",
        resposta:
          "As datas mudam conforme o estado, a espécie e a bacia, e são definidas por portaria. Confira sempre a portaria da sua região — nunca confie em data repassada de boca.",
        links: [
          { label: "Guia nacional do Seguro-Defeso", href: "/guia/seguro-defeso-brasil" },
          { label: "Períodos de defeso (MPA)", href: "https://www.gov.br/mpa/pt-br/assuntos/periodos-de-defeso" },
        ],
      },
    ],
  },
  {
    id: "entrevista",
    label: "Entrevista do Defeso",
    intro: "Datas, locais e como se preparar.",
    perguntas: [
      {
        pergunta: "O que é a entrevista do defeso?",
        resposta:
          "É o atendimento (presencial ou agendado) em que o MTE confere os dados do pescador no processo do Seguro-Defeso. Faz parte da análise do benefício.",
      },
      {
        pergunta: "Quando e onde é a minha?",
        resposta:
          "As datas e os locais saem nos canais oficiais do MTE/Gov.br e aparecem nas notícias aqui do site, na aba \"Entrevistas do Defeso\". Não confie em data repassada de boca — confirme sempre na fonte oficial.",
        links: [
          {
            label: "Datas e locais oficiais (Gov.br)",
            href: "https://www.gov.br/pt-br/servicos/solicitar-seguro-defeso-pescador-artesanal",
          },
        ],
      },
      {
        pergunta: "Preciso de ajuda com a entrevista?",
        resposta:
          "Procure sua colônia, sindicato ou associação de pescadores. Se quiser, fale com a gente que ajudamos a te orientar.",
        links: [{ label: "Falar no WhatsApp", href: HELP_WHATSAPP_URL, wa: true }],
      },
    ],
  },
  {
    id: "rgp",
    label: "RGP / Carteira de pescador",
    intro: "Carteira ativa, suspensa ou reativação.",
    perguntas: [
      {
        pergunta: "O que é o RGP?",
        resposta:
          "É o Registro Geral da Atividade Pesqueira — a carteira de pescador profissional. Ele precisa estar ativo para o pescador ter direito ao Seguro-Defeso.",
      },
      {
        pergunta: "Minha carteira está suspensa. E agora?",
        resposta:
          "Dá para consultar e pedir a reativação no PesqBrasil/MPA. Veja o passo a passo no guia.",
        links: [
          { label: "Guia: RGP suspenso e reativação", href: "/guia/rgp-suspenso-reativacao" },
          { label: "Falar no WhatsApp", href: HELP_WHATSAPP_URL, wa: true },
        ],
      },
      {
        pergunta: "Como mantenho o RGP em dia?",
        resposta:
          "Entregue o REAP todo ano, mantenha o CadÚnico atualizado, a biometria cadastrada e a conta Gov.br prata ou ouro.",
      },
    ],
  },
  {
    id: "aquacadastro",
    label: "Sobre o AquaCadastro",
    intro: "O sistema de gestão para colônias, sindicatos e associações.",
    perguntas: [
      {
        pergunta: "O que é o AquaCadastro?",
        resposta:
          "É um sistema de gestão feito para entidades de pesca — colônias, sindicatos, associações e cooperativas. Ele organiza o cadastro dos sócios, as mensalidades, a emissão de carteirinhas e a documentação do RGP, tudo em um só lugar e na nuvem.",
      },
      {
        pergunta: "Para quem serve?",
        resposta:
          "Para dirigentes de colônias, sindicatos, associações e cooperativas de pescadores que querem acabar com a papelada manual e manter tudo organizado e seguro.",
      },
      {
        pergunta: "O que ele faz?",
        resposta:
          "Cadastro de sócios, controle de mensalidades, emissão de carteirinhas, acompanhamento do RGP/REAP e relatórios da entidade — do jeito que a secretaria precisa no dia a dia.",
      },
      {
        pergunta: "Quanto custa e como contratar?",
        resposta:
          "Os planos são combinados conforme o tamanho da sua entidade. Fale com a gente no WhatsApp que explicamos tudo e mostramos o sistema funcionando.",
        links: [
          { label: "Falar no WhatsApp", href: WHATSAPP_URL, wa: true },
          { label: "Acessar AquaCadastro", href: AQUACADASTRO_URL },
        ],
      },
    ],
  },
  {
    id: "anunciar",
    label: "Como anunciar no site",
    intro: "Coloque sua loja ou serviço na frente de quem vive da pesca.",
    perguntas: [
      {
        pergunta: "Quem vê meu anúncio?",
        resposta:
          "Pescadores artesanais e esportivos do Maranhão e de todo o Brasil, além de dirigentes de colônias, sindicatos e associações. É o público certo para lojas de pesca, serviços e produtos do setor.",
      },
      {
        pergunta: "Onde o anúncio aparece?",
        resposta:
          "Em destaque no site: faixa no topo, card entre as notícias e no rodapé. Seu anúncio fica visível para quem acompanha defeso, RGP e notícias da pesca todos os dias.",
      },
      {
        pergunta: "Quanto custa anunciar?",
        resposta:
          "Os formatos e valores são combinados direto no WhatsApp, conforme o espaço e o tempo do anúncio. Chame a gente que montamos a melhor opção para você.",
        links: [{ label: "Quero anunciar (WhatsApp)", href: ADVERTISE_WHATSAPP_URL, wa: true }],
      },
    ],
  },
];

export function SiteAssistant() {
  const [open, setOpen] = useState(false);
  const [topicId, setTopicId] = useState<string | null>(null);
  const [answer, setAnswer] = useState<Answer | null>(null);

  const topic = TOPICS.find((t) => t.id === topicId) ?? null;

  function reset() {
    setTopicId(null);
    setAnswer(null);
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir assistente de dúvidas"
          className="fixed bottom-20 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-105"
        >
          <Sparkles className="h-5 w-5" />
          <span>Tire suas dúvidas</span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-50 flex max-h-[80vh] w-[min(92vw,22rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <header className="flex items-center justify-between gap-2 border-b border-border bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <div>
                <p className="text-sm font-bold leading-tight">Assistente Radar da Pesca</p>
                <p className="text-xs text-primary-foreground/80">Tire suas dúvidas rápidas</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                reset();
              }}
              aria-label="Fechar assistente"
              className="rounded-full p-1 hover:bg-primary-foreground/15"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {!topic && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Olá! 👋 Sobre o que você quer saber?</p>
                {TOPICS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTopicId(t.id)}
                    className="w-full rounded-xl border border-border bg-background p-3 text-left transition-colors hover:border-primary"
                  >
                    <span className="block text-sm font-semibold text-foreground">{t.label}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{t.intro}</span>
                  </button>
                ))}
              </div>
            )}

            {topic && !answer && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Voltar
                </button>
                <p className="text-sm font-semibold text-foreground">{topic.label}</p>
                {topic.perguntas.map((p) => (
                  <button
                    key={p.pergunta}
                    type="button"
                    onClick={() => setAnswer(p)}
                    className="w-full rounded-xl border border-border bg-background p-3 text-left text-sm text-foreground transition-colors hover:border-primary"
                  >
                    {p.pergunta}
                  </button>
                ))}
              </div>
            )}

            {topic && answer && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setAnswer(null)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Outras perguntas
                </button>
                <div>
                  <p className="text-sm font-semibold text-foreground">{answer.pergunta}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{answer.resposta}</p>
                </div>
                {answer.links?.map((link) =>
                  link.wa ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-4 py-2.5 text-sm font-semibold text-whatsapp-foreground transition-opacity hover:opacity-90"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {link.label}
                    </a>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
                    >
                      {link.label}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ),
                )}
              </div>
            )}
          </div>

          <footer className="border-t border-border px-4 py-2 text-center text-[11px] text-muted-foreground">
            Não achou sua dúvida? Fale no WhatsApp (98) 99609-4477.
          </footer>
        </div>
      )}
    </>
  );
}
