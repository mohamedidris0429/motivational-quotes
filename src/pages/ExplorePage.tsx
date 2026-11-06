import { useMemo, useState, useEffect } from 'react';
import { Search, X, TrendingUp, Clock, Shuffle } from 'lucide-react';
import { searchQuotes, getRandomQuote } from '@/lib/quotes';
import { CATEGORIES } from '@/types';
import type { CategoryId } from '@/types';
import { QuoteTile, SectionHeader, RandomButton } from '@/components/QuoteTile';
import { useToast } from '@/components/Toast';

type SortMode = 'trending' | 'newest' | 'random';

export function ExplorePage() {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<CategoryId | 'all'>('all');
  const [sort, setSort] = useState<SortMode>('trending');
  const [seed, setSeed] = useState(0);
  const toast = useToast();

  // Re-seed random on sort change
  useEffect(() => { if (sort === 'random') setSeed((s) => s + 1); }, [sort]);

  const results = useMemo(() => {
    let list = query.trim() ? searchQuotes(query) : [];
    if (activeCat !== 'all') {
      list = query.trim()
        ? list.filter((q) => q.category === activeCat)
        : (() => { const all = searchQuotes(''); return all.filter((q) => q.category === activeCat); })();
    }
    if (!query.trim() && activeCat === 'all') {
      list = searchQuotes('');
    }
    if (sort === 'newest') list = [...list].sort((a, b) => b.id - a.id);
    else if (sort === 'random') list = [...list].sort(() => Math.random() - 0.5);
    else list = [...list].sort((a, b) => (a.id % 7) - (b.id % 7)); // pseudo trending
    return list;
  }, [query, activeCat, sort, seed]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-navy-900 dark:text-cream-50 sm:text-4xl">Explore</h1>
        <p className="mt-1 text-navy-500 dark:text-cream-100/60">Search 500 quotes by text, author, or category.</p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-lavender-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search quotes, authors, categories..."
          className="w-full rounded-2xl border border-lavender-100 dark:border-navy-700 bg-white dark:bg-navy-800 py-4 pl-12 pr-12 text-navy-900 dark:text-cream-50 placeholder:text-navy-400 dark:placeholder:text-cream-100/40 shadow-soft outline-none focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200 dark:focus:ring-lavender-800 transition-all"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-700 dark:hover:text-cream-100">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Sort + random */}
      <div className="flex flex-wrap items-center gap-2">
        <SortPill active={sort === 'trending'} onClick={() => setSort('trending')} icon={<TrendingUp size={15} />}>Trending</SortPill>
        <SortPill active={sort === 'newest'} onClick={() => setSort('newest')} icon={<Clock size={15} />}>Newest</SortPill>
        <SortPill active={sort === 'random'} onClick={() => setSort('random')} icon={<Shuffle size={15} />}>Random</SortPill>
        <div className="ml-auto">
          <RandomButton onClick={() => { setSort('random'); toast('Mixed it up for you'); }} label="Shuffle" />
        </div>
      </div>

      {/* Category chips */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <CatChip active={activeCat === 'all'} onClick={() => setActiveCat('all')}>All</CatChip>
        {CATEGORIES.map((c) => (
          <CatChip key={c.id} active={activeCat === c.id} onClick={() => setActiveCat(c.id)}>{c.name}</CatChip>
        ))}
      </div>

      <SectionHeader title={query ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'All Quotes'} subtitle={activeCat !== 'all' ? CATEGORIES.find((c) => c.id === activeCat)?.name : undefined} />

      {results.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-lavender-200 dark:border-navy-700 py-16 text-center">
          <p className="text-navy-500 dark:text-cream-100/60">No quotes found. Try a different word or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.slice(0, 60).map((q, i) => (
            <QuoteTile key={q.id} quote={q} index={i} />
          ))}
        </div>
      )}

      {results.length > 60 && (
        <p className="text-center text-sm text-navy-400 dark:text-cream-100/50">Showing 60 of {results.length}. Refine your search to see more.</p>
      )}
    </div>
  );
}

function SortPill({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
        active ? 'bg-lavender-600 text-white shadow-soft' : 'bg-white dark:bg-navy-800 text-navy-600 dark:text-cream-100/70 hover:bg-lavender-50 dark:hover:bg-navy-700'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function CatChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
        active ? 'bg-lavender-600 text-white shadow-soft' : 'bg-white dark:bg-navy-800 text-navy-600 dark:text-cream-100/70 hover:bg-lavender-50 dark:hover:bg-navy-700'
      }`}
    >
      {children}
    </button>
  );
}
