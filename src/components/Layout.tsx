import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, LayoutGrid, Heart, Settings, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { useApp } from '@/context/AppContext';

const NAV = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/categories', label: 'Categories', icon: LayoutGrid },
  { to: '/favorites', label: 'Favorites', icon: Heart },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Layout({ children }: { children: ReactNode }) {
  const { favorites } = useApp();
  const loc = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-lavender-50/40 to-cream-50 dark:from-navy-950 dark:via-navy-900 dark:to-navy-950 transition-colors duration-500">
      {/* Desktop top nav */}
      <header className="sticky top-0 z-30 hidden md:block glass border-b border-lavender-100/60 dark:border-navy-700/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-lavender-400 to-lavender-600 text-white shadow-soft">
              <Sparkles size={18} />
            </div>
            <div className="leading-tight">
              <div className="font-serif text-lg font-semibold text-navy-900 dark:text-cream-50">DailyQuotes</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-lavender-500 dark:text-lavender-300">Inspire daily</div>
            </div>
          </NavLink>

          <nav className="flex items-center gap-1">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-lavender-600 text-white shadow-soft'
                      : 'text-navy-700 dark:text-cream-100 hover:bg-lavender-100 dark:hover:bg-navy-800'
                  }`
                }
              >
                <Icon size={18} />
                {label}
                {to === '/favorites' && favorites.length > 0 && (
                  <span className="ml-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{favorites.length}</span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-30 glass border-b border-lavender-100/60 dark:border-navy-700/60 px-5 py-3 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-lavender-400 to-lavender-600 text-white shadow-soft">
            <Sparkles size={16} />
          </div>
          <span className="font-serif text-base font-semibold text-navy-900 dark:text-cream-50">DailyQuotes</span>
        </NavLink>
        <NavLink to="/studio" className="flex items-center gap-1.5 rounded-full bg-lavender-100 dark:bg-navy-800 px-3 py-1.5 text-xs font-semibold text-lavender-700 dark:text-lavender-200">
          <Sparkles size={14} /> Studio
        </NavLink>
      </div>

      <main className={`mx-auto max-w-6xl px-4 sm:px-6 pb-28 md:pb-12 pt-4 md:pt-8 ${loc.pathname === '/' ? '' : ''}`}>
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-lavender-100/60 dark:border-navy-700/60 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-stretch justify-around px-2 py-1.5">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `relative flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 transition-all ${
                  isActive ? 'text-lavender-600 dark:text-lavender-300' : 'text-navy-400 dark:text-cream-100/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`relative flex h-8 w-8 items-center justify-center rounded-xl transition-all ${isActive ? 'bg-lavender-100 dark:bg-navy-800' : ''}`}>
                    <Icon size={20} className={isActive ? 'stroke-[2.4]' : ''} />
                    {to === '/favorites' && favorites.length > 0 && (
                      <span className="absolute -top-1 -right-1 rounded-full bg-rose-500 px-1.5 text-[9px] font-bold text-white">{favorites.length}</span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
