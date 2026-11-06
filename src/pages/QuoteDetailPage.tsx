import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { getQuoteById, getRandomQuote } from '@/lib/quotes';
import { QUOTES } from '@/data/quotes';
import { CATEGORY_MAP } from '@/types';
import { QuoteCard } from '@/components/QuoteCard';
import { QuoteActions } from '@/components/QuoteActions';
import { useToast } from '@/components/Toast';
import { useState } from 'react';

export function QuoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const [currentId, setCurrentId] = useState(Number(id));
  const quote = getQuoteById(currentId);

  if (!quote) {
    return (
      <div className="py-20 text-center">
        <p className="text-navy-500 dark:text-cream-100/60">Quote not found.</p>
        <Link to="/explore" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-lavender-600 dark:text-lavender-300">
          <ArrowLeft size={16} /> Back to Explore
        </Link>
      </div>
    );
  }

  const category = CATEGORY_MAP[quote.category];
  const idx = QUOTES.findIndex((q) => q.id === quote.id);
  const prev = QUOTES[(idx - 1 + QUOTES.length) % QUOTES.length];
  const next = QUOTES[(idx + 1) % QUOTES.length];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/explore" className="inline-flex items-center gap-1.5 text-sm font-medium text-lavender-600 dark:text-lavender-300 hover:gap-2.5 transition-all">
          <ArrowLeft size={16} /> Explore
        </Link>
        <span className="rounded-full bg-lavender-100 dark:bg-navy-800 px-3 py-1 text-xs font-semibold text-lavender-700 dark:text-lavender-200">{category.name}</span>
      </div>

      <QuoteCard quote={quote} className="aspect-square w-full animate-scaleIn" />

      <div className="flex justify-center">
        <QuoteActions quote={quote} onToast={toast} />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setCurrentId(prev.id)}
          className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-navy-800 px-4 py-2.5 text-sm font-medium text-navy-700 dark:text-cream-100 shadow-soft transition-all hover:scale-105 active:scale-95"
        >
          <ChevronLeft size={16} /> Previous
        </button>
        <button
          onClick={() => { const r = getRandomQuote(quote.id); setCurrentId(r.id); }}
          className="rounded-full bg-lavender-100 dark:bg-navy-800 px-4 py-2.5 text-sm font-medium text-lavender-700 dark:text-lavender-200 transition-all hover:scale-105 active:scale-95"
        >
          Surprise me
        </button>
        <button
          onClick={() => setCurrentId(next.id)}
          className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-navy-800 px-4 py-2.5 text-sm font-medium text-navy-700 dark:text-cream-100 shadow-soft transition-all hover:scale-105 active:scale-95"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
