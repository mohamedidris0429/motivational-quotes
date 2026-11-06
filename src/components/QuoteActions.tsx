import { useState } from 'react';
import { Heart, Copy, Share2, Download, Check, MessageCircle, Send, Facebook } from 'lucide-react';
import type { Quote } from '@/types';
import { useApp } from '@/context/AppContext';
import { copyToClipboard, shareText, shareToWhatsApp, shareToTelegram, shareToFacebook } from '@/lib/share';
import { toPng } from 'html-to-image';
import { QuoteCard } from './QuoteCard';

interface QuoteActionsProps {
  quote: Quote;
  onToast?: (msg: string) => void;
  variant?: 'row' | 'stacked';
}

export function QuoteActions({ quote, onToast, variant = 'row' }: QuoteActionsProps) {
  const { isFavorite, toggleFavorite } = useApp();
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const fav = isFavorite(quote.id);

  const toast = (msg: string) => onToast?.(msg);

  const handleCopy = async () => {
    const ok = await copyToClipboard(`"${quote.text}" — ${quote.author}`);
    if (ok) {
      setCopied(true);
      toast('Quote copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast('Could not copy');
    }
  };

  const handleShare = async () => {
    const ok = await shareText(quote.text, quote.author);
    if (!ok) setMenuOpen((v) => !v);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const node = document.createElement('div');
      node.style.width = '800px';
      node.style.height = '800px';
      node.style.position = 'fixed';
      node.style.left = '-9999px';
      node.style.top = '0';
      const holder = document.createElement('div');
      holder.style.width = '100%';
      holder.style.height = '100%';
      node.appendChild(holder);
      document.body.appendChild(node);

      // Render card into offscreen node using React render
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(holder);
      await new Promise<void>((resolve) => {
        root.render(<QuoteCard quote={quote} className="w-full h-full" />);
        setTimeout(resolve, 120);
      });

      const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true });
      const link = document.createElement('a');
      link.download = `dailyquote-${quote.id}.png`;
      link.href = dataUrl;
      link.click();
      root.unmount();
      document.body.removeChild(node);
      toast('Quote image downloaded');
    } catch {
      toast('Download failed');
    } finally {
      setDownloading(false);
    }
  };

  const btnBase =
    'inline-flex items-center justify-center rounded-full transition-all duration-200 active:scale-90 disabled:opacity-50';

  const sizeClasses = variant === 'row'
    ? 'w-11 h-11 bg-white/80 dark:bg-navy-800/80 backdrop-blur text-lavender-600 dark:text-lavender-300 hover:bg-white dark:hover:bg-navy-700 shadow-soft'
    : 'w-full h-11 bg-white/80 dark:bg-navy-800/80 backdrop-blur text-lavender-600 dark:text-lavender-300 hover:bg-white dark:hover:bg-navy-700 shadow-soft gap-2 text-sm font-medium';

  return (
    <div className="relative">
      <div className={variant === 'row' ? 'flex items-center gap-2' : 'flex flex-col gap-2'}>
        <button
          onClick={() => {
            toggleFavorite(quote.id);
            toast(fav ? 'Removed from favorites' : 'Saved to favorites');
          }}
          className={`${btnBase} ${sizeClasses}`}
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          title={fav ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className={fav ? 'fill-rose-500 text-rose-500' : ''} size={20} />
        </button>

        <button onClick={handleCopy} className={`${btnBase} ${sizeClasses}`} aria-label="Copy quote" title="Copy">
          {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
        </button>

        <button onClick={handleShare} className={`${btnBase} ${sizeClasses}`} aria-label="Share quote" title="Share">
          <Share2 size={20} />
        </button>

        <button onClick={handleDownload} disabled={downloading} className={`${btnBase} ${sizeClasses}`} aria-label="Download image" title="Download as image">
          <Download size={20} className={downloading ? 'animate-pulse' : ''} />
        </button>
      </div>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-2xl bg-white dark:bg-navy-800 shadow-card border border-lavender-100 dark:border-navy-700 animate-scaleIn origin-top-right">
            <ShareMenuItem icon={<MessageCircle size={18} className="text-emerald-500" />} label="WhatsApp" onClick={() => { shareToWhatsApp(quote.text, quote.author); setMenuOpen(false); }} />
            <ShareMenuItem icon={<Send size={18} className="text-sky-500" />} label="Telegram" onClick={() => { shareToTelegram(quote.text, quote.author); setMenuOpen(false); }} />
            <ShareMenuItem icon={<Facebook size={18} className="text-blue-600" />} label="Facebook" onClick={() => { shareToFacebook(quote.text, quote.author); setMenuOpen(false); }} />
          </div>
        </>
      )}
    </div>
  );
}

function ShareMenuItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-navy-900 dark:text-cream-100 hover:bg-lavender-50 dark:hover:bg-navy-700 transition-colors">
      {icon}
      {label}
    </button>
  );
}
