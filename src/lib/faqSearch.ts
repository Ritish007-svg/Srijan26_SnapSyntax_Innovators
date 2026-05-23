import faqData from "@/data/faq.json";

export type FaqItem = { question: string; answer: string; category: string };
export type FaqCategory = { main: string; sub: { question: string; answer: string }[] };

const data = faqData as { faq: FaqCategory[] };

export const categories: string[] = data.faq.map((c) => c.main);

export const allItems: FaqItem[] = data.faq.flatMap((c) =>
  c.sub.map((s) => ({ ...s, category: c.main }))
);

const STOPWORDS = new Set([
  "the","a","an","is","are","do","does","did","of","to","for","in","on","at","by","with",
  "i","you","we","they","my","your","our","can","will","be","have","has","had","what","when",
  "where","who","how","why","which","this","that","these","those","and","or","but","if","it",
  "as","about","from","into","me","please","tell","explain",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function score(query: string, item: FaqItem): number {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return 0;
  const haystack = (item.question + " " + item.answer + " " + item.category).toLowerCase();
  const qTokensQOnly = tokenize(item.question);
  let s = 0;
  for (const t of qTokens) {
    if (haystack.includes(t)) s += 1;
    if (qTokensQOnly.includes(t)) s += 2; // weight question matches more
  }
  // exact phrase boost
  if (item.question.toLowerCase().includes(query.toLowerCase().trim())) s += 5;
  return s;
}

export function searchFaq(query: string, opts?: { category?: string; topK?: number }) {
  const pool = opts?.category
    ? allItems.filter((i) => i.category === opts.category)
    : allItems;
  const scored = pool
    .map((item) => ({ item, s: score(query, item) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);
  return scored.slice(0, opts?.topK ?? 3);
}

export function getCategoryItems(category: string): FaqItem[] {
  return allItems.filter((i) => i.category === category);
}

export function getStarterQuestion(category: string): string {
  const items = getCategoryItems(category);
  return items[0]?.question ?? `Tell me about ${category}`;
}

export function suggestionsFor(category?: string, exclude?: string): string[] {
  const pool = category ? getCategoryItems(category) : allItems;
  return pool
    .filter((i) => i.question !== exclude)
    .slice(0, 3)
    .map((i) => i.question);
}
