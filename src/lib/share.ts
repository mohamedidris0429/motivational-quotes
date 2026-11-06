export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function shareText(text: string, author: string): Promise<boolean> {
  const shareData = {
    title: 'DailyQuotes',
    text: `"${text}" — ${author}`,
  };
  if (navigator.share) {
    return navigator.share(shareData).then(() => true).catch(() => false);
  }
  return Promise.resolve(false);
}

export function shareToWhatsApp(text: string, author: string): void {
  const msg = encodeURIComponent(`"${text}" — ${author}\n\nShared via DailyQuotes`);
  window.open(`https://wa.me/?text=${msg}`, '_blank', 'noopener,noreferrer');
}

export function shareToTelegram(text: string, author: string): void {
  const msg = encodeURIComponent(`"${text}" — ${author}`);
  window.open(`https://t.me/share/url?url=${encodeURIComponent('https://dailyquotes.app')}&text=${msg}`, '_blank', 'noopener,noreferrer');
}

export function shareToFacebook(text: string, author: string): void {
  const quote = encodeURIComponent(`"${text}" — ${author}`);
  const url = encodeURIComponent('https://dailyquotes.app');
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`, '_blank', 'noopener,noreferrer');
}
