import { forwardRef, type CSSProperties } from 'react';
import type { Quote } from '@/types';
import { CARD_STYLES } from '@/data/cardStyles';
import { CATEGORY_MAP } from '@/types';

interface QuoteCardProps {
  quote: Quote;
  className?: string;
  showAttribution?: boolean;
  fontSize?: number;
  textAlign?: 'left' | 'center' | 'right';
  fontFamily?: string;
  customStyle?: Partial<ReturnType<typeof getCardStyle>>;
}

export function getCardStyle(cardId: Quote['card']) {
  return CARD_STYLES[cardId];
}

export const QuoteCard = forwardRef<HTMLDivElement, QuoteCardProps>(
  ({ quote, className = '', showAttribution = true, fontSize, textAlign = 'center', fontFamily, customStyle }, ref) => {
    const base = getCardStyle(quote.card);
    const style = { ...base, ...customStyle };
    const category = CATEGORY_MAP[quote.category];

    const containerStyle: CSSProperties = {
      background: style.background,
      color: style.textColor,
      fontFamily: fontFamily || style.fontFamily,
    };

    const quoteStyle: CSSProperties = {
      fontSize: fontSize ? `${fontSize}px` : undefined,
      textAlign,
      lineHeight: 1.4,
    };

    return (
      <div
        ref={ref}
        className={`relative overflow-hidden rounded-3xl shadow-card ${className}`}
        style={containerStyle}
      >
        {/* decorative quote mark */}
        <div
          className="absolute top-4 left-5 text-6xl leading-none opacity-20 select-none"
          style={{ color: style.accent, fontFamily: "'Playfair Display', serif" }}
          aria-hidden
        >
          &ldquo;
        </div>

        <div className="relative z-10 flex h-full flex-col justify-center px-8 py-10 sm:px-12 sm:py-14">
          <p
            className="font-medium text-balance"
            style={quoteStyle}
          >
            {quote.text}
          </p>

          {showAttribution && (
            <div
              className="mt-6 flex items-center gap-2 text-sm font-medium tracking-wide"
              style={{ color: style.authorColor, justifyContent: textAlign === 'left' ? 'flex-start' : textAlign === 'right' ? 'flex-end' : 'center' }}
            >
              <span className="h-px w-8" style={{ background: style.accent }} />
              <span>{quote.author}</span>
            </div>
          )}

          <div
            className="mt-5 text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70"
            style={{ color: style.authorColor, textAlign }}
          >
            {category.name}
          </div>
        </div>

        {/* subtle corner glow */}
        <div
          className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full opacity-30 blur-3xl"
          style={{ background: style.accent }}
          aria-hidden
        />
      </div>
    );
  }
);

QuoteCard.displayName = 'QuoteCard';
