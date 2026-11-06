import type { CardTemplate } from '@/types';

export interface CardStyle {
  id: CardTemplate;
  name: string;
  background: string;
  textColor: string;
  authorColor: string;
  fontFamily: string;
  accent: string;
}

export const CARD_STYLES: Record<CardTemplate, CardStyle> = {
  'minimal-white': {
    id: 'minimal-white', name: 'Minimal White',
    background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f7 100%)',
    textColor: '#1a1a2e', authorColor: '#7c3aed', fontFamily: "'Playfair Display', serif",
    accent: '#7c3aed',
  },
  'purple-gradient': {
    id: 'purple-gradient', name: 'Purple Dream',
    background: 'linear-gradient(135deg, #7c3aed 0%, #c4b5ff 100%)',
    textColor: '#ffffff', authorColor: '#ede8ff', fontFamily: "'Playfair Display', serif",
    accent: '#f5ebd9',
  },
  'pink-aesthetic': {
    id: 'pink-aesthetic', name: 'Pink Aesthetic',
    background: 'linear-gradient(135deg, #fb7185 0%, #fbcfe8 100%)',
    textColor: '#4c1d3b', authorColor: '#831843', fontFamily: "'Dancing Script', cursive",
    accent: '#ffffff',
  },
  'dark-elegant': {
    id: 'dark-elegant', name: 'Dark Elegant',
    background: 'linear-gradient(135deg, #0f0e2a 0%, #1e1b4b 100%)',
    textColor: '#f5ebd9', authorColor: '#c4b5ff', fontFamily: "'Playfair Display', serif",
    accent: '#a78bfa',
  },
  'nature-inspired': {
    id: 'nature-inspired', name: 'Nature Green',
    background: 'linear-gradient(135deg, #34d399 0%, #064e3b 100%)',
    textColor: '#ffffff', authorColor: '#d1fae5', fontFamily: "'Cormorant Garamond', serif",
    accent: '#a7f3d0',
  },
  'sunset-gradient': {
    id: 'sunset-gradient', name: 'Sunset Glow',
    background: 'linear-gradient(135deg, #fb923c 0%, #db2777 50%, #7c3aed 100%)',
    textColor: '#fff7ed', authorColor: '#fef3c7', fontFamily: "'Playfair Display', serif",
    accent: '#fef3c7',
  },
  'ocean-blue': {
    id: 'ocean-blue', name: 'Ocean Blue',
    background: 'linear-gradient(135deg, #38bdf8 0%, #1e3a8a 100%)',
    textColor: '#ffffff', authorColor: '#bae6fd', fontFamily: "'Cormorant Garamond', serif",
    accent: '#e0f2fe',
  },
  'pastel-aesthetic': {
    id: 'pastel-aesthetic', name: 'Pastel Soft',
    background: 'linear-gradient(135deg, #c4b5ff 0%, #fbcfe8 50%, #fde68a 100%)',
    textColor: '#4c1d95', authorColor: '#831843', fontFamily: "'Dancing Script', cursive",
    accent: '#ffffff',
  },
  'black-gold': {
    id: 'black-gold', name: 'Black & Gold',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1c1917 100%)',
    textColor: '#fbbf24', authorColor: '#fcd34d', fontFamily: "'Playfair Display', serif",
    accent: '#fbbf24',
  },
  'floral': {
    id: 'floral', name: 'Floral Blush',
    background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #c4b5ff 100%)',
    textColor: '#831843', authorColor: '#a21caf', fontFamily: "'Cormorant Garamond', serif",
    accent: '#f9a8d4',
  },
  'abstract-artistic': {
    id: 'abstract-artistic', name: 'Abstract Art',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%)',
    textColor: '#ffffff', authorColor: '#fdf4ff', fontFamily: "'Playfair Display', serif",
    accent: '#fdf4ff',
  },
  'modern-typography': {
    id: 'modern-typography', name: 'Modern Bold',
    background: 'linear-gradient(135deg, #fafaf9 0%, #e7e5e4 100%)',
    textColor: '#0c0a09', authorColor: '#7c3aed', fontFamily: "'Inter', sans-serif",
    accent: '#7c3aed',
  },
  'vintage-paper': {
    id: 'vintage-paper', name: 'Vintage Paper',
    background: 'linear-gradient(135deg, #f5ebd9 0%, #e7d3b1 100%)',
    textColor: '#451a03', authorColor: '#78350f', fontFamily: "'Cormorant Garamond', serif",
    accent: '#92400e',
  },
  'soft-cream': {
    id: 'soft-cream', name: 'Soft Cream',
    background: 'linear-gradient(135deg, #fdfbf7 0%, #f6f3ff 100%)',
    textColor: '#3b0764', authorColor: '#6d28d9', fontFamily: "'Playfair Display', serif",
    accent: '#a78bfa',
  },
  'glass-premium': {
    id: 'glass-premium', name: 'Premium Glass',
    background: 'linear-gradient(135deg, rgba(124,58,237,0.85) 0%, rgba(30,27,75,0.9) 100%)',
    textColor: '#ffffff', authorColor: '#ddd3ff', fontFamily: "'Cormorant Garamond', serif",
    accent: '#c4b5ff',
  },
};

export const CARD_LIST = Object.values(CARD_STYLES);

export const FONT_OPTIONS = [
  { id: 'serif', name: 'Playfair', value: "'Playfair Display', serif" },
  { id: 'sans', name: 'Inter', value: "'Inter', sans-serif" },
  { id: 'script', name: 'Dancing', value: "'Dancing Script', cursive" },
  { id: 'display', name: 'Cormorant', value: "'Cormorant Garamond', serif" },
] as const;
