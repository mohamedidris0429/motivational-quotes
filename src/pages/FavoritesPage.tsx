import { useMemo, useState } from 'react';
import { Heart, Search, X, Trash2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getQuoteById } from '@/lib/quotes';
import { QUOTES } from '@/data/quotes';
import { CATEGORIES } from '@/types';
import type { CategoryId } from '@/types';
import { QuoteTile, SectionHeader } from '@/components/QuoteTile';
import { useToast } from '@/components/Toast';

export function FavoritesPage() {
  const { favorites, clearFavorites } = useApp();
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<CategoryId | 'all'>('all');
  const [confirmClear, setConfirmClear] = useState(false);

  const favQuotes = useMemo(
    () => favorites.map((id) => getQuoteById(id)).filter((q): q is NonNullable<typeof q> => Boolean(q)),
    [favorites]
  );

  const filtered = useMemo(() => {
    let list = favQuotes;
    if (cat !== 'all') list = list.filter((q) => q.category === cat);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((quote) => quote.text.toLowerCase().includes(q) || quote.author.toLowerCase().includes(q));
    }
    return list;
  }, [favQuotes, query, cat]);

  const usedCats = useMemo(() => {
    const set = new Set(favQuotes.map((q) => q.category));
    return CATEGORIES.filter((c) => set.has(c.id));
  }, [favQuotes]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-navy-900 dark:text-cream-50 sm:text-4xl">Favorites</h1>
          <p className="mt-1 text-navy-500 dark:text-cream-100/60">
            {favorites.length === 0 ? 'No saved quotes yet' : `${favorites.length} saved quote${favorites.length === 1 ? '' : 's'}`}
          </p>
        </div>
        {favorites.length > 0 && (
          <button
            onClick={() => setConfirmClear(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 dark:bg-rose-900/30 px-4 py-2 text-sm font-medium text-rose-600 dark:text-rose-300 transition-all hover:bg-rose-100 dark:hover:bg-rose-900/50"
          >
            <Trash2 size={16} /> Clear all
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-lavender-200 dark:border-navy-700 py-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-lavender-100 dark:bg-navy-800">
            <Heart size={28} className="text-lavender-400" />
          </div>
          <h3 className="font-serif text-xl font-semibold text-navy-900 dark:text-cream-50">Your collection is empty</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-navy-500 dark:text-cream-100/60">
            Tap the heart on any quote to save it here. Your favorites stay saved even after you refresh.
          </p>
        </div>
      ) : (
        <>
          {/* Search + filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-lavender-400" size={20} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your favorites..."
                className="w-full rounded-2xl border border-lavender-100 dark:border-navy-700 bg-white dark:bg-navy-800 py-3.5 pl-12 pr-10 text-navy-900 dark:text-cream-50 placeholder:text-navy-400 shadow-soft outline-none focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200 dark:focus:ring-lavender-800 transition-all"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-700 dark:hover:text-cream-100">
                  <X size={18} />
                </button>
              )}
            </div>
            {usedCats.length > 1 && (
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value as CategoryId | 'all')}
                className="rounded-2xl border border-lavender-100 dark:border-navy-700 bg-white dark:bg-navy-800 px-4 py-3.5 text-navy-900 dark:text-cream-50 shadow-soft outline-none focus:border-lavender-400"
              >
                <option value="all">All categories</option>
                {usedCats.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          </div>

          <SectionHeader title={`${filtered.length} quote${filtered.length === 1 ? '' : 's'}`} />

          {filtered.length === 0 ? (
            <p className="text-center text-sm text-navy-500 dark:text-cream-100/60 py-12">No favorites match your search.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((q, i) => (
                <QuoteTile key={q.id} quote={q} index={i} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Clear confirmation modal */}
      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4 animate-fadeIn" onClick={() => setConfirmClear(false)}>
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-navy-800 p-6 shadow-card animate-scaleIn" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/40">
              <Trash2 size={24} className="text-rose-500" />
            </div>
            <h3 className="text-center font-serif text-xl font-semibold text-navy-900 dark:text-cream-50">Clear all favorites?</h3>
            <p className="mt-2 text-center text-sm text-navy-500 dark:text-cream-100/60">This will remove all {favorites.length} saved quotes. This cannot be undone.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setConfirmClear(false)} className="flex-1 rounded-full bg-lavender-100 dark:bg-navy-700 py-3 text-sm font-semibold text-navy-700 dark:text-cream-100 transition-all hover:bg-lavender-200 dark:hover:bg-navy-600">Cancel</button>
              <button onClick={() => { clearFavorites(); setConfirmClear(false); toast('Favorites cleared'); }} className="flex-1 rounded-full bg-rose-500 py-3 text-sm font-semibold text-white transition-all hover:bg-rose-600">Clear all</button>
            </div>
          </div>
        </div>
      )}

      {/* unused import guard */}
      <span className="hidden">{QUOTES.length}</span>
    </div>
  );
}
