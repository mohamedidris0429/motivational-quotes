import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import * as Lucide from 'lucide-react';
import { CATEGORIES } from '@/types';
import type { CategoryId } from '@/types';
import { getQuotesByCategory } from '@/lib/quotes';
import { QuoteTile, SectionHeader } from '@/components/QuoteTile';

export function CategoriesPage() {
  const [params, setParams] = useSearchParams();
  const active = (params.get('cat') as CategoryId | null) ?? null;
  const [showAll, setShowAll] = useState(false);

  const activeCat = useMemo(() => CATEGORIES.find((c) => c.id === active) ?? null, [active]);
  const quotes = useMemo(() => (active ? getQuotesByCategory(active) : []), [active]);
  const visible = showAll ? quotes : quotes.slice(0, 12);

  if (active && activeCat) {
    const Icon = (Lucide as any)[activeCat.icon] ?? Lucide.Sparkles;
    return (
      <div className="space-y-6">
        <button onClick={() => setParams({})} className="inline-flex items-center gap-1.5 text-sm font-medium text-lavender-600 dark:text-lavender-300 hover:gap-2.5 transition-all">
          <ArrowLeft size={16} /> All categories
        </button>

        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${activeCat.gradient} p-8 text-white shadow-card`}>
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/25 backdrop-blur">
              <Icon size={24} />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-semibold">{activeCat.name}</h1>
              <p className="text-white/85">{activeCat.description}</p>
            </div>
          </div>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-white/80">{quotes.length} quotes</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((q, i) => (
            <QuoteTile key={q.id} quote={q} index={i} />
          ))}
        </div>

        {quotes.length > 12 && (
          <div className="text-center">
            <button onClick={() => setShowAll((v) => !v)} className="rounded-full bg-lavender-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:scale-105 active:scale-95">
              {showAll ? 'Show less' : `Show all ${quotes.length}`}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-navy-900 dark:text-cream-50 sm:text-4xl">Categories</h1>
        <p className="mt-1 text-navy-500 dark:text-cream-100/60">20 themes of inspiration to explore.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat, i) => {
          const Icon = (Lucide as any)[cat.icon] ?? Lucide.Sparkles;
          const count = getQuotesByCategory(cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setParams({ cat: cat.id })}
              className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${cat.gradient} p-6 text-left text-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-card animate-slideUp`}
              style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/20 blur-2xl transition-all group-hover:scale-150" />
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/25 backdrop-blur">
                <Icon size={22} />
              </div>
              <h3 className="mt-4 font-serif text-xl font-semibold">{cat.name}</h3>
              <p className="mt-1 text-sm text-white/85">{cat.description}</p>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-white/70">{count} quotes</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
