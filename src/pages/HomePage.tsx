import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { QUOTES } from '@/data/quotes';
import { getDailyQuote, getGreeting, formatDate, getPopularQuotes, getRandomQuote, getQuotesByCategory } from '@/lib/quotes';
import { CATEGORIES, CATEGORY_MAP } from '@/types';
import { useApp } from '@/context/AppContext';
import { QuoteCard } from '@/components/QuoteCard';
import { QuoteActions } from '@/components/QuoteActions';
import { QuoteTile, SectionHeader, RandomButton } from '@/components/QuoteTile';
import { useToast } from '@/components/Toast';

export function HomePage() {
  const daily = useMemo(() => getDailyQuote(), []);
  const popular = useMemo(() => getPopularQuotes(8), []);
  const { settings } = useApp();
  const toast = useToast();
  const [spotlight, setSpotlight] = useState(daily);

  const featuredCats = CATEGORIES.slice(0, 6);
  const preferredQuotes = useMemo(() => {
    const ids = new Set(settings.preferredCategories);
    const pool = QUOTES.filter((q) => ids.has(q.category));
    return (pool.length ? pool : QUOTES).slice(0, 4);
  }, [settings.preferredCategories]);

  return (
    <div className="space-y-10">
      {/* Greeting */}
      <section className="animate-fadeIn">
        <p className="text-sm font-medium text-lavender-500 dark:text-lavender-300">{formatDate()}</p>
        <h1 className="mt-1 font-serif text-3xl font-semibold text-navy-900 dark:text-cream-50 sm:text-4xl">
          {getGreeting()} <span className="bg-gradient-to-r from-lavender-500 to-fuchsia-500 bg-clip-text text-transparent">beautiful soul</span>
        </h1>
        <p className="mt-2 text-navy-500 dark:text-cream-100/60">Here is your little inspiration for today.</p>
      </section>

      {/* Quote of the Day */}
      <section className="animate-slideUp">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-soft">
              <Calendar size={18} />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-navy-900 dark:text-cream-50">Quote of the Day</h2>
              <p className="text-xs text-navy-500 dark:text-cream-100/60">A new one each day</p>
            </div>
          </div>
          <RandomButton onClick={() => { setSpotlight(getRandomQuote(spotlight.id)); toast('A fresh spark for you'); }} label="New quote" />
        </div>

        <div className="relative mx-auto max-w-2xl">
          <QuoteCard quote={spotlight} className="aspect-square w-full sm:aspect-[4/3]" />
          <div className="mt-4 flex justify-center">
            <QuoteActions quote={spotlight} onToast={toast} />
          </div>
        </div>
      </section>

      {/* Explore Categories */}
      <section>
        <SectionHeader title="Explore Categories" subtitle="Find the words that meet you where you are" action={<Link to="/categories" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-lavender-600 dark:text-lavender-300 hover:gap-2 transition-all">View all <ArrowRight size={16} /></Link>} />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {featuredCats.map((cat) => {
            const count = getQuotesByCategory(cat.id).length;
            return (
              <Link
                key={cat.id}
                to={`/categories?cat=${cat.id}`}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${cat.gradient} p-5 text-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-card`}
              >
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/20 blur-2xl" />
                <h3 className="font-serif text-lg font-semibold">{cat.name}</h3>
                <p className="mt-1 text-xs text-white/80 line-clamp-2">{cat.description}</p>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-white/70">{count} quotes</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Preferred picks */}
      {preferredQuotes.length > 0 && (
        <section>
          <SectionHeader title="Picked for You" subtitle="From your preferred categories" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {preferredQuotes.map((q, i) => (
              <QuoteTile key={q.id} quote={q} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Quotes */}
      <section>
        <SectionHeader title="Popular Quotes" subtitle="Loved by the community" action={<Link to="/explore" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-lavender-600 dark:text-lavender-300 hover:gap-2 transition-all">Explore <ArrowRight size={16} /></Link>} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popular.map((q, i) => (
            <QuoteTile key={q.id} quote={q} index={i} />
          ))}
        </div>
      </section>

      {/* Studio promo */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-lavender-600 via-fuchsia-500 to-rose-500 p-8 text-center text-white shadow-card">
        <Sparkles className="mx-auto mb-3" size={32} />
        <h2 className="font-serif text-2xl font-semibold sm:text-3xl">Create your own quote card</h2>
        <p className="mx-auto mt-2 max-w-md text-white/85">Pick a quote, style it your way, and download a beautiful image to share.</p>
        <Link to="/studio" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-lavender-700 shadow-soft transition-all hover:scale-105 active:scale-95">
          <Sparkles size={18} /> Open Customization Studio
        </Link>
      </section>
    </div>
  );
}
