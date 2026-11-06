import type { Quote, CategoryId } from '@/types';
import { QUOTES } from '@/data/quotes';

// Stable date-based daily quote index (same all day, changes next day)
export function getDailyQuote(date = new Date()): Quote {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86400000);
  const idx = (dayOfYear + date.getFullYear()) % QUOTES.length;
  return QUOTES[idx];
}

export function getQuoteById(id: number): Quote | undefined {
  return QUOTES.find((q) => q.id === id);
}

export function getQuotesByCategory(category: CategoryId): Quote[] {
  return QUOTES.filter((q) => q.category === category);
}

export function getRandomQuote(excludeId?: number): Quote {
  let q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  if (excludeId !== undefined) {
    let attempts = 0;
    while (q.id === excludeId && attempts < 10) {
      q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      attempts++;
    }
  }
  return q;
}

export function getPopularQuotes(limit = 8): Quote[] {
  // Deterministic "popular" selection spread across categories
  const byCat = new Map<CategoryId, Quote[]>();
  QUOTES.forEach((q) => {
    const arr = byCat.get(q.category) ?? [];
    arr.push(q);
    byCat.set(q.category, arr);
  });
  const picks: Quote[] = [];
  const cats = [...byCat.keys()];
  let i = 0;
  while (picks.length < limit && picks.length < QUOTES.length) {
    const cat = cats[i % cats.length];
    const arr = byCat.get(cat)!;
    const pick = arr[Math.floor(i / cats.length) % arr.length];
    if (pick && !picks.some((p) => p.id === pick.id)) picks.push(pick);
    i++;
  }
  return picks;
}

export function searchQuotes(query: string): Quote[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return QUOTES.filter(
    (quote) =>
      quote.text.toLowerCase().includes(q) ||
      quote.author.toLowerCase().includes(q) ||
      quote.category.toLowerCase().includes(q) ||
      quote.category.replace(/-/g, ' ').toLowerCase().includes(q)
  );
}

export function formatDate(date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function getGreeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}
