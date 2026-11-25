import { useState } from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight, FileText, LoaderCircle, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { portariasQueryOptions } from "@/lib/portarias-query";
import { officialPortariaLinks } from "@/lib/portarias";

function publicationDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Sao_Paulo" }).format(new Date(iso));
}

export function PortariasSearch() {
  const latest = useSuspenseQuery(portariasQueryOptions());
  const [draft, setDraft] = useState("");
  const [term, setTerm] = useState("");
  const [expanded, setExpanded] = useState(false);
  const search = useQuery({ ...portariasQueryOptions(term), enabled: Boolean(term) });
  const active = term ? search : latest;
  const articles = active.data?.articles ?? [];
  const pending = term && search.isPending;
  const failed = active.isError || active.data?.unavailable;

  return (
    <section id="portarias" aria-labelledby="portarias-title" className="mb-10 border-b border-border pb-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-primary"><FileText className="size-4" /> Seguro-Defeso · Carteira artesanal · RGP</p>
          <h2 id="portarias-title" className="mt-2 text-2xl font-bold sm:text-3xl">Portarias da pesca</h2>
        </div>
        <Button variant="outline" size="icon" aria-label="Atualizar portarias" title="Atualizar portarias" disabled={active.isFetching} onClick={() => active.refetch()}>
          <RefreshCw className={active.isFetching ? "animate-spin" : ""} />
        </Button>
      </div>
      <form className="mt-5 flex flex-col gap-2 sm:flex-row" onSubmit={(event) => {
        event.preventDefault();
        const next = draft.trim();
        if (!next) return;
        setExpanded(false);
        if (next === term) void search.refetch();
        else setTerm(next);
      }}>
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
          <input type="search" aria-label="Número ou assunto da portaria" placeholder="Número, ano ou assunto da portaria" value={draft} maxLength={120} required onChange={(event) => setDraft(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <Button type="submit" className="h-10" disabled={Boolean(pending) || !draft.trim()}><Search /> Buscar portaria</Button>
      </form>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold">{term ? `Resultados para “${term}”` : "Portarias mais recentes encontradas"}</h3>
        {term ? <Button variant="ghost" size="sm" onClick={() => { setTerm(""); setDraft(""); setExpanded(false); }}>Voltar às mais recentes</Button> : <span className="text-xs text-muted-foreground">Atualização a cada 5 min</span>}
      </div>
      <div aria-live="polite" aria-busy={Boolean(pending)}>
        {pending ? <p role="status" className="flex items-center gap-2 py-6 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin" /> Buscando publicações…</p> : failed ? <p role="alert" className="py-5 text-sm text-muted-foreground">A busca está indisponível agora. Consulte as fontes oficiais abaixo ou tente novamente.</p> : articles.length === 0 ? <p className="py-5 text-sm text-muted-foreground">Nenhuma publicação encontrada nesta busca. Consulte também o Diário Oficial e o Ministério da Pesca.</p> : (
          <div className="mt-3 grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, expanded ? 18 : 6).map((article) => (
              <a key={article.id} href={article.url} target="_blank" rel="noopener noreferrer" className="group min-w-0 border-t border-border py-4">
                <div className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground"><span>{article.source}</span><time dateTime={article.publishedAt}>{publicationDate(article.publishedAt)}</time></div>
                <h4 className="mt-2 break-words text-base font-semibold leading-snug group-hover:text-primary">{article.title}</h4>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">Abrir publicação <ArrowUpRight className="size-4" /></span>
              </a>
            ))}
          </div>
        )}
        {active.data?.partial && <p className="text-xs text-muted-foreground">Parte das fontes não respondeu; a lista pode estar incompleta.</p>}
      </div>
      {!pending && !failed && articles.length > 6 && <Button variant="outline" size="sm" className="mt-3" onClick={() => setExpanded(!expanded)}>{expanded ? "Mostrar menos" : "Ver mais portarias"}</Button>}
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-t border-border pt-4">
        {officialPortariaLinks(term).map((link) => <Button key={link.label} asChild variant="link" className="h-auto whitespace-normal p-0 text-left"><a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}<ArrowUpRight /></a></Button>)}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Publicações e notícias encontradas no Google Notícias. A divulgação pode ocorrer após a publicação oficial; confirme o texto e a vigência no Diário Oficial.</p>
    </section>
  );
}