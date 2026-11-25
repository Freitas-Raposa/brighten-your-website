export const PORTARIA_REFRESH_MS = 5 * 60 * 1000;

export function normalizePortariaText(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function isFishingPortaria(title: string): boolean {
  const text = normalizePortariaText(title);
  return /\bportarias?\b/.test(text) && /\b(pesca|pesqueira|pesqueiro|pescadores?|pescadoras?|defeso|rgp|mpa|reap)\b/.test(text);
}

export function portariaSearchQuery(term: string): string {
  const clean = term.trim().replace(/[\r\n]/g, " ").slice(0, 120);
  return `portaria (pesca OR pescador OR defeso OR RGP) ${clean}`.trim();
}

export function matchesPortariaSearch(text: string, term: string): boolean {
  const normalized = normalizePortariaText(text).replace(/[^a-z0-9]+/g, " ");
  const tokens = normalizePortariaText(term).split(/[^a-z0-9]+/).filter((token) => token && !["de", "do", "da", "dos", "das", "sobre", "numero", "n", "no", "portaria"].includes(token));
  return tokens.every((token) => normalized.split(" ").includes(token));
}

export function officialPortariaLinks(term: string) {
  const query = portariaSearchQuery(term);
  return [
    { label: "Diário Oficial da União", url: `https://www.in.gov.br/consulta/-/buscar/dou?q=${encodeURIComponent(query)}` },
    { label: "Ministério da Pesca", url: `https://www.gov.br/mpa/pt-br/search?SearchableText=${encodeURIComponent(`portaria ${term.trim()}`)}` },
    { label: "Buscar no Google · fontes oficiais", url: `https://www.google.com/search?q=${encodeURIComponent(`${query} (site:gov.br OR site:in.gov.br)`)}` },
  ];
}

export function newestPortarias<T extends { title: string; publishedAt: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = normalizePortariaText(item.title).replace(/[^a-z0-9]/g, "");
    if (!isFishingPortaria(item.title) || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}