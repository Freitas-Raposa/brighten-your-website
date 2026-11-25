import { ArrowUpRight } from "lucide-react";

const DEFESO_PERIODS = [
  { especie: "Peixes de água doce (rios do MA)", periodo: "1º dez a 30 mar" },
  { especie: "Camarão (litoral)", periodo: "1º mar a 31 mai" },
  { especie: "Lagosta", periodo: "1º nov a 30 abr" },
  { especie: "Caranguejo-uçá (andada)", periodo: "Portaria anual" },
];

interface DefesoRgpGuideProps {
  onFilterCongresso: () => void;
  onFilterSeguroDefeso: () => void;
}

export function DefesoRgpGuide({ onFilterCongresso, onFilterSeguroDefeso }: DefesoRgpGuideProps) {
  return (
    <section
      aria-label="Central do Seguro-Defeso, RGP e Leis no Congresso"
      className="my-10 rounded-2xl border border-border bg-secondary/45 p-6 sm:p-8"
    >
      <div className="flex flex-col gap-2 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Central do Pescador: Seguro-Defeso, RGP e Leis no Congresso
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Períodos, normas, como dar entrada, regularização de carteira suspensa e projetos de lei em tramitação.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onFilterSeguroDefeso}
            className="rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Notícias Seguro-Defeso
          </button>
          <button
            type="button"
            onClick={onFilterCongresso}
            className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
          >
            Notícias Câmara e Senado
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5">
          <div>
            <h3 className="text-lg font-bold text-card-foreground">
              Períodos e normas do Seguro-Defeso
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {DEFESO_PERIODS.map((item) => (
                <li key={item.especie} className="flex items-baseline justify-between gap-2 border-b border-border/60 pb-1.5 last:border-0">
                  <span className="font-medium text-card-foreground">{item.especie}</span>
                  <span className="shrink-0 text-xs font-semibold text-primary">{item.periodo}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Normas básicas: RGP ativo há pelo menos 1 ano, pesca artesanal exclusiva e não receber outro benefício do INSS. Datas podem mudar conforme portaria anual.
            </p>
          </div>
          <a
            href="https://www.gov.br/pt-br/servicos/solicitar-seguro-desemprego-do-pescador-artesanal"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            Ver normas oficiais no Gov.br
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5">
          <div>
            <h3 className="text-lg font-bold text-card-foreground">
              Como dar entrada e Carteira RGP
            </h3>
            <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm text-muted-foreground">
              <li>Confira se sua carteira do RGP está ativa no PesqBrasil.</li>
              <li>Separe RG, CPF, comprovante de residência e comprovante de pesca.</li>
              <li>Peça o benefício pelo Meu INSS, telefone 135 ou na sua colônia, sindicato ou associação.</li>
              <li>Carteira suspensa ou cancelada? Solicite revisão e reativação direto no portal do MPA.</li>
            </ol>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            <a
              href="https://meu.inss.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Dar entrada no Meu INSS
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href="https://www.gov.br/mpa/pt-br/assuntos/pesca/registro-geral-da-atividade-pesqueira-rgp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Suspensão e reativação do RGP
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5">
          <div>
            <h3 className="text-lg font-bold text-card-foreground">
              Leis da pesca no Congresso
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Acompanhe os projetos de lei em tramitação na Câmara dos Deputados e no Senado Federal sobre seguro-defeso, carteira de pescador, previdência e direitos da pesca artesanal.
            </p>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <a
              href="https://www.camara.leg.br/busca-portal?contextoBusca=BuscaProposicoes&pagina=1&order=relevancia&abaEspecifica=true&q=pesca+artesanal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              Projetos na Câmara dos Deputados
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href="https://www25.senado.leg.br/web/atividade/materias/-/materia/pesquisa?texto=pesca+artesanal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              Projetos no Senado Federal
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}