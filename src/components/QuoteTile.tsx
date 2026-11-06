import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Copy, Share2, Download, Check, Shuffle } from 'lucide-react';
import type { Quote } from '@/types';
import { useApp } from '@/context/AppContext';
import { useToast } from './Toast';
import { copyToClipboard, shareText } from '@/lib/share';
import { CARD_STYLES } from '@/data/cardStyles';
import { getCardStyle } from './QuoteCard';
import { CATEGORY_MAP } from '@/types';
import { toPng } from 'html-to-image';
import { createRoot } from 'react-dom/client';

// Small compact quote tile for grids
export function QuoteTile({ quote, index = 0 }: { quote: Quote; index?: number }) {
  const { isFavorite, toggleFavorite } = useApp();
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const fav = isFavorite(quote.id);
  const style = getCardStyle(quote.card);
  const category = CATEGORY_MAP[quote.category];

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const ok = await copyToClipboard(`"${quote.text}" — ${quote.author}`);
    if (ok) {
      setCopied(true);
      toast('Copied to clipboard');
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await shareText(quote.text, quote.author);
  };

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(quote.id);
    toast(fav ? 'Removed from favorites' : 'Saved to favorites');
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const node = document.createElement('div');
    node.style.width = '720px';
    node.style.height = '720px';
    node.style.position = 'fixed';
    node.style.left = '-9999px';
    document.body.appendChild(node);
    const root = createRoot(node);
    await new Promise<void>((r) => {
      root.render(
        <div style={{ width: '100%', height: '100%', background: style.background, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '56px', color: style.textColor, fontFamily: style.fontFamily, borderRadius: '32px' }}>
          <p style={{ fontSize: '34px', lineHeight: 1.35, fontWeight: 500 }}>{quote.text}</p>
          <div style={{ marginTop: '28px', color: style.authorColor, fontSize: '18px' }}>— {quote.author}</div>
          <div style={{ marginTop: '16px', color: style.authorColor, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.7 }}>{category.name}</div>
        </div>
      );
      setTimeout(r, 120);
    });
    try {
      const url = await toPng(node, { pixelRatio: 2, cacheBust: true });
      const a = document.createElement('a');
      a.download = `dailyquote-${quote.id}.png`;
      a.href = url;
      a.click();
      toast('Image downloaded');
    } catch {
      toast('Download failed');
    }
    root.unmount();
    document.body.removeChild(node);
  };

  return (
    <article
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glow animate-slideUp"
      style={{ background: style.background, color: style.textColor, fontFamily: style.fontFamily, animationDelay: `${Math.min(index * 50, 400)}ms` }}
    >
      <div className="absolute top-3 left-4 text-5xl leading-none opacity-20 select-none" style={{ color: style.accent }} aria-hidden>&ldquo;</div>

      <Link to={`/quote/${quote.id}`} className="relative z-10 mt-4 block flex-1">
        <p className="text-lg font-medium leading-snug text-balance">{quote.text}</p>
        <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: style.authorColor }}>
          <span className="h-px w-6" style={{ background: style.accent }} />
          {quote.author}
        </div>
        <div className="mt-3 text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70" style={{ color: style.authorColor }}>
          {category.name}
        </div>
      </Link>

      <div className="relative z-10 mt-4 flex items-center gap-1.5 opacity-90 sm:opacity-70 sm:group-hover:opacity-100 transition-opacity">
        <TileBtn onClick={handleFav} label="Favorite">
          <Heart size={16} className={fav ? 'fill-rose-500 text-rose-500' : ''} />
        </TileBtn>
        <TileBtn onClick={handleCopy} label="Copy">
          {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
        </TileBtn>
        <TileBtn onClick={handleShare} label="Share">
          <Share2 size={16} />
        </TileBtn>
        <TileBtn onClick={handleDownload} label="Download">
          <Download size={16} />
        </TileBtn>
      </div>
    </article>
  );
}

function TileBtn({ children, onClick, label }: { children: React.ReactNode; onClick: (e: React.MouseEvent) => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur transition-all hover:bg-white/40 active:scale-90"
      style={{ color: 'inherit' }}
    >
      {children}
    </button>
  );
}

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-navy-900 dark:text-cream-50 sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-navy-500 dark:text-cream-100/60">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function RandomButton({ onClick, label = 'Surprise me' }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-lavender-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:shadow-glow active:scale-95"
    >
      <Shuffle size={16} />
      {label}
    </button>
  );
}

export { CARD_STYLES };
