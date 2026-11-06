import { useMemo, useRef, useState } from 'react';
import { Download, Shuffle, Search, Type, AlignLeft, AlignCenter, AlignRight, Eye, Check } from 'lucide-react';
import { QUOTES } from '@/data/quotes';
import { CARD_LIST, FONT_OPTIONS } from '@/data/cardStyles';
import type { CardTemplate, Quote } from '@/types';
import { getRandomQuote } from '@/lib/quotes';
import { QuoteCard, getCardStyle } from '@/components/QuoteCard';
import { toPng } from 'html-to-image';
import { useToast } from '@/components/Toast';
import { CATEGORIES, CATEGORY_MAP } from '@/types';
import type { CategoryId } from '@/types';

export function StudioPage() {
  const toast = useToast();
  const previewRef = useRef<HTMLDivElement>(null);
  const [quote, setQuote] = useState<Quote>(() => getRandomQuote());
  const [card, setCard] = useState<CardTemplate>(quote.card);
  const [font, setFont] = useState<string>(FONT_OPTIONS[0].value);
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('center');
  const [fontSize, setFontSize] = useState(28);
  const [textColor, setTextColor] = useState<string>(getCardStyle(quote.card).textColor);
  const [showAuthor, setShowAuthor] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerQuery, setPickerQuery] = useState('');
  const [pickerCat, setPickerCat] = useState<CategoryId | 'all'>('all');

  const cardStyle = getCardStyle(card);

  const filteredQuotes = useMemo(() => {
    let list = QUOTES;
    if (pickerCat !== 'all') list = list.filter((q) => q.category === pickerCat);
    if (pickerQuery.trim()) {
      const q = pickerQuery.toLowerCase();
      list = list.filter((quote) => quote.text.toLowerCase().includes(q) || quote.author.toLowerCase().includes(q));
    }
    return list.slice(0, 40);
  }, [pickerQuery, pickerCat]);

  const handleDownload = async () => {
    if (!previewRef.current) return;
    try {
      const dataUrl = await toPng(previewRef.current, { pixelRatio: 2, cacheBust: true });
      const link = document.createElement('a');
      link.download = `dailyquotes-studio-${quote.id}.png`;
      link.href = dataUrl;
      link.click();
      toast('Your quote card downloaded');
    } catch {
      toast('Download failed');
    }
  };

  const pickQuote = (q: Quote) => {
    setQuote(q);
    setCard(q.card);
    setTextColor(getCardStyle(q.card).textColor);
    setPickerOpen(false);
    setPickerQuery('');
  };

  const shuffleQuote = () => {
    const q = getRandomQuote(quote.id);
    pickQuote(q);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-navy-900 dark:text-cream-50 sm:text-4xl">Customization Studio</h1>
          <p className="mt-1 text-navy-500 dark:text-cream-100/60">Design a personalized quote image and download it.</p>
        </div>
        <button onClick={shuffleQuote} className="inline-flex items-center gap-2 rounded-full bg-lavender-100 dark:bg-navy-800 px-4 py-2.5 text-sm font-semibold text-lavender-700 dark:text-lavender-200 transition-all hover:scale-105 active:scale-95">
          <Shuffle size={16} /> Random
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Preview */}
        <div className="lg:sticky lg:top-24 self-start">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy-600 dark:text-cream-100/70">
            <Eye size={16} /> Preview
          </div>
          <div ref={previewRef} className="aspect-square w-full max-w-md mx-auto">
            <QuoteCard
              quote={quote}
              className="w-full h-full"
              showAttribution={showAuthor}
              fontSize={fontSize}
              textAlign={align}
              fontFamily={font}
              customStyle={{ background: cardStyle.background, textColor, authorColor: cardStyle.authorColor, accent: cardStyle.accent }}
            />
          </div>
          <button
            onClick={handleDownload}
            className="mt-4 mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-gradient-to-r from-lavender-600 to-fuchsia-500 px-6 py-3.5 text-sm font-bold text-white shadow-card transition-all hover:scale-[1.02] active:scale-95"
          >
            <Download size={18} /> Download as PNG
          </button>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Quote picker */}
          <Panel title="Quote" icon={<Type size={18} />}>
            <button onClick={() => setPickerOpen((v) => !v)} className="flex w-full items-center justify-between rounded-2xl bg-lavender-50 dark:bg-navy-800 px-4 py-3 text-left transition-all hover:bg-lavender-100 dark:hover:bg-navy-700">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-navy-800 dark:text-cream-100">"{quote.text}"</p>
                <p className="text-xs text-navy-400 dark:text-cream-100/50">— {quote.author} · {CATEGORY_MAP[quote.category].name}</p>
              </div>
              <Search size={18} className="shrink-0 text-lavender-400" />
            </button>

            {pickerOpen && (
              <div className="mt-3 space-y-3 animate-scaleIn">
                <input
                  value={pickerQuery}
                  onChange={(e) => setPickerQuery(e.target.value)}
                  placeholder="Search quotes..."
                  className="w-full rounded-xl border border-lavender-100 dark:border-navy-700 bg-white dark:bg-navy-800 px-3 py-2.5 text-sm text-navy-900 dark:text-cream-50 outline-none focus:border-lavender-400"
                />
                <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
                  <Chip active={pickerCat === 'all'} onClick={() => setPickerCat('all')}>All</Chip>
                  {CATEGORIES.slice(0, 10).map((c) => (
                    <Chip key={c.id} active={pickerCat === c.id} onClick={() => setPickerCat(c.id)}>{c.name}</Chip>
                  ))}
                </div>
                <div className="max-h-64 overflow-y-auto rounded-2xl border border-lavender-50 dark:border-navy-700 divide-y divide-lavender-50 dark:divide-navy-700/60">
                  {filteredQuotes.map((q) => (
                    <button key={q.id} onClick={() => pickQuote(q)} className="block w-full px-4 py-3 text-left hover:bg-lavender-50 dark:hover:bg-navy-800 transition-colors">
                      <p className="text-sm font-medium text-navy-800 dark:text-cream-100 line-clamp-2">"{q.text}"</p>
                      <p className="text-xs text-navy-400 dark:text-cream-100/50">— {q.author}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Panel>

          {/* Background */}
          <Panel title="Background" icon={<span className="text-base">🎨</span>}>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {CARD_LIST.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setCard(c.id); setTextColor(c.textColor); }}
                  className={`group relative h-16 rounded-xl overflow-hidden transition-all ${card === c.id ? 'ring-2 ring-lavender-500 ring-offset-2 dark:ring-offset-navy-800 scale-105' : 'hover:scale-105'}`}
                  style={{ background: c.background }}
                  title={c.name}
                  aria-label={c.name}
                >
                  {card === c.id && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Check size={18} className="text-white" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Panel>

          {/* Font */}
          <Panel title="Font Style" icon={<Type size={18} />}>
            <div className="grid grid-cols-2 gap-2">
              {FONT_OPTIONS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFont(f.value)}
                  className={`rounded-xl px-4 py-3 text-sm transition-all ${font === f.value ? 'bg-lavender-600 text-white shadow-soft' : 'bg-lavender-50 dark:bg-navy-800 text-navy-700 dark:text-cream-100 hover:bg-lavender-100 dark:hover:bg-navy-700'}`}
                  style={{ fontFamily: f.value }}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </Panel>

          {/* Alignment */}
          <Panel title="Text Alignment" icon={<AlignCenter size={18} />}>
            <div className="flex gap-2">
              <AlignBtn active={align === 'left'} onClick={() => setAlign('left')} icon={<AlignLeft size={18} />} label="Left" />
              <AlignBtn active={align === 'center'} onClick={() => setAlign('center')} icon={<AlignCenter size={18} />} label="Center" />
              <AlignBtn active={align === 'right'} onClick={() => setAlign('right')} icon={<AlignRight size={18} />} label="Right" />
            </div>
          </Panel>

          {/* Text size */}
          <Panel title="Text Size" icon={<span className="text-base">Aa</span>}>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={18}
                max={48}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="flex-1 accent-lavender-600"
              />
              <span className="w-12 text-center text-sm font-semibold text-navy-700 dark:text-cream-100">{fontSize}px</span>
            </div>
          </Panel>

          {/* Text color */}
          <Panel title="Text Color" icon={<span className="text-base">🎨</span>}>
            <div className="flex flex-wrap gap-2">
              {['#ffffff', '#1a1a2e', '#fbbf24', '#f5ebd9', '#fbcfe8', '#bae6fd', '#d1fae5', '#ddd3ff'].map((c) => (
                <button
                  key={c}
                  onClick={() => setTextColor(c)}
                  className={`h-9 w-9 rounded-full transition-all ${textColor === c ? 'ring-2 ring-lavender-500 ring-offset-2 dark:ring-offset-navy-800 scale-110' : 'hover:scale-105'}`}
                  style={{ background: c, border: c === '#ffffff' ? '1px solid #e5e7eb' : 'none' }}
                  aria-label={c}
                />
              ))}
              <label className="relative h-9 w-9 cursor-pointer overflow-hidden rounded-full border border-lavender-100 dark:border-navy-700">
                <span className="absolute inset-0" style={{ background: 'conic-gradient(red,orange,yellow,green,blue,indigo,violet,red)' }} />
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" aria-label="Custom color" />
              </label>
            </div>
          </Panel>

          {/* Author toggle */}
          <Panel title="Author Attribution" icon={<Check size={18} />}>
            <button
              onClick={() => setShowAuthor((v) => !v)}
              className={`relative h-7 w-12 rounded-full transition-colors ${showAuthor ? 'bg-lavender-500' : 'bg-navy-200 dark:bg-navy-700'}`}
              aria-label="Toggle author"
            >
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${showAuthor ? 'left-6' : 'left-1'}`} />
            </button>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-white dark:bg-navy-800/60 p-5 shadow-soft border border-lavender-50 dark:border-navy-700/60">
      <div className="mb-3 flex items-center gap-2 text-lavender-600 dark:text-lavender-300">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-lavender-100 dark:bg-navy-700">{icon}</span>
        <h3 className="font-serif text-lg font-semibold text-navy-900 dark:text-cream-50">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function AlignBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${active ? 'bg-lavender-600 text-white shadow-soft' : 'bg-lavender-50 dark:bg-navy-800 text-navy-700 dark:text-cream-100 hover:bg-lavender-100 dark:hover:bg-navy-700'}`}>
      {icon} {label}
    </button>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${active ? 'bg-lavender-600 text-white' : 'bg-lavender-50 dark:bg-navy-800 text-navy-600 dark:text-cream-100/70'}`}>
      {children}
    </button>
  );
}
