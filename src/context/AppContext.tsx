import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { AppSettings, CategoryId } from '@/types';
import { DEFAULT_SETTINGS } from '@/types';

const FAV_KEY = 'dailyquotes_favorites';
const SET_KEY = 'dailyquotes_settings';

interface AppContextValue {
  settings: AppSettings;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  clearFavorites: () => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
  togglePreferredCategory: (id: CategoryId) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function loadFavorites(): number[] {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SET_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AppSettings>) } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [favorites, setFavorites] = useState<number[]>(loadFavorites);

  // Apply theme + accent to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    root.setAttribute('data-accent', settings.accent);
  }, [settings.theme, settings.accent]);

  useEffect(() => {
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(SET_KEY, JSON.stringify(settings));
  }, [settings]);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]));
  }, []);

  const isFavorite = useCallback((id: number) => favorites.includes(id), [favorites]);

  const clearFavorites = useCallback(() => setFavorites([]), []);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const togglePreferredCategory = useCallback((id: CategoryId) => {
    setSettings((prev) => ({
      ...prev,
      preferredCategories: prev.preferredCategories.includes(id)
        ? prev.preferredCategories.filter((c) => c !== id)
        : [...prev.preferredCategories, id],
    }));
  }, []);

  return (
    <AppContext.Provider
      value={{ settings, favorites, toggleFavorite, isFavorite, clearFavorites, updateSettings, togglePreferredCategory }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
