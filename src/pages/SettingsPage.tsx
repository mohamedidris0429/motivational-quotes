import { useState } from 'react';
import { Sun, Moon, Bell, BellOff, Heart, Info, Trash2, Check, Palette, Clock, ChevronRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/types';
import type { CategoryId } from '@/types';
import { useToast } from '@/components/Toast';

const ACCENTS = [
  { id: 'lavender', name: 'Lavender', colors: 'from-lavender-400 to-lavender-600' },
  { id: 'rose', name: 'Rose', colors: 'from-rose-400 to-pink-600' },
  { id: 'ocean', name: 'Ocean', colors: 'from-sky-400 to-blue-600' },
  { id: 'sunset', name: 'Sunset', colors: 'from-orange-400 to-rose-500' },
] as const;

export function SettingsPage() {
  const { settings, updateSettings, favorites, togglePreferredCategory, clearFavorites } = useApp();
  const toast = useToast();
  const [confirmClear, setConfirmClear] = useState(false);
  const [reminding, setReminding] = useState(false);

  const handleToggleReminders = async () => {
    if (!settings.remindersEnabled) {
      // request permission
      let granted = settings.notificationsGranted;
      if ('Notification' in window && Notification.permission === 'default') {
        const perm = await Notification.requestPermission();
        granted = perm === 'granted';
        updateSettings({ notificationsGranted: granted });
      } else if ('Notification' in window) {
        granted = Notification.permission === 'granted';
        updateSettings({ notificationsGranted: granted });
      }
      if (granted) {
        updateSettings({ remindersEnabled: true });
        toast('Daily reminders enabled');
        sendTestNotification();
      } else {
        toast('Notifications blocked by browser');
      }
    } else {
      updateSettings({ remindersEnabled: false });
      toast('Reminders turned off');
    }
  };

  const sendTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('DailyQuotes', { body: 'Daily reminders are on. We will send a little inspiration each day.' });
      } catch { /* ignore */ }
    }
  };

  const testReminderNow = () => {
    setReminding(true);
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('Your daily inspiration', { body: '"Your effort is a vote for the person you are becoming." — DailyQuotes' });
        toast('Test notification sent');
      } catch {
        toast('Could not send notification');
      }
    } else {
      toast('Enable notifications first');
    }
    setTimeout(() => setReminding(false), 800);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-navy-900 dark:text-cream-50 sm:text-4xl">Settings</h1>
        <p className="mt-1 text-navy-500 dark:text-cream-100/60">Make DailyQuotes yours. No account needed.</p>
      </div>

      {/* Appearance */}
      <Section icon={<Palette size={20} />} title="Appearance">
        <Row label="Theme" hint="Switch between light and dark">
          <div className="flex gap-2">
            <ThemeBtn active={settings.theme === 'light'} onClick={() => updateSettings({ theme: 'light' })} icon={<Sun size={16} />} label="Light" />
            <ThemeBtn active={settings.theme === 'dark'} onClick={() => updateSettings({ theme: 'dark' })} icon={<Moon size={16} />} label="Dark" />
          </div>
        </Row>
        <Row label="Accent" hint="Color used across the app">
          <div className="flex gap-2">
            {ACCENTS.map((a) => (
              <button
                key={a.id}
                onClick={() => updateSettings({ accent: a.id })}
                className={`h-9 w-9 rounded-full bg-gradient-to-br ${a.colors} transition-all ${settings.accent === a.id ? 'ring-2 ring-offset-2 ring-lavender-400 dark:ring-offset-navy-800 scale-110' : 'hover:scale-105'}`}
                aria-label={a.name}
                title={a.name}
              >
                {settings.accent === a.id && <Check size={16} className="mx-auto text-white" />}
              </button>
            ))}
          </div>
        </Row>
      </Section>

      {/* Reminders */}
      <Section icon={<Bell size={20} />} title="Daily Reminder">
        <Row label="Reminders" hint="Get a gentle nudge with inspiration each day">
          <button
            onClick={handleToggleReminders}
            className={`relative h-7 w-12 rounded-full transition-colors ${settings.remindersEnabled ? 'bg-lavender-500' : 'bg-navy-200 dark:bg-navy-700'}`}
            aria-label="Toggle reminders"
          >
            <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${settings.remindersEnabled ? 'left-6' : 'left-1'}`} />
          </button>
        </Row>
        {settings.remindersEnabled && (
          <>
            <Row label="Reminder time" hint="When you would like your daily quote">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-lavender-400" />
                <input
                  type="time"
                  value={settings.reminderTime}
                  onChange={(e) => updateSettings({ reminderTime: e.target.value })}
                  className="rounded-xl border border-lavender-100 dark:border-navy-700 bg-white dark:bg-navy-800 px-3 py-2 text-navy-900 dark:text-cream-50 outline-none focus:border-lavender-400"
                />
              </div>
            </Row>
            <div className="rounded-2xl bg-lavender-50 dark:bg-navy-800/60 p-4 text-sm text-navy-600 dark:text-cream-100/70">
              <p className="flex items-start gap-2">
                <Info size={16} className="mt-0.5 shrink-0 text-lavender-400" />
                Reminders use your browser's notification system. The app or browser tab may need to remain open for reminders to appear at your chosen time.
              </p>
              <button onClick={testReminderNow} disabled={reminding} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-navy-700 px-4 py-2 text-sm font-semibold text-lavender-600 dark:text-lavender-200 shadow-soft transition-all hover:scale-105 active:scale-95">
                <Bell size={15} /> Send test notification
              </button>
            </div>
          </>
        )}
        {!settings.remindersEnabled && (
          <div className="flex items-center gap-2 rounded-2xl bg-navy-50 dark:bg-navy-800/40 p-4 text-sm text-navy-500 dark:text-cream-100/50">
            <BellOff size={16} /> Reminders are currently off.
          </div>
        )}
      </Section>

      {/* Preferred categories */}
      <Section icon={<Heart size={20} />} title="Preferred Categories">
        <p className="mb-3 text-sm text-navy-500 dark:text-cream-100/60">Choose themes for your "Picked for You" section on Home.</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const active = settings.preferredCategories.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => togglePreferredCategory(c.id as CategoryId)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-all ${
                  active
                    ? 'bg-lavender-600 text-white shadow-soft'
                    : 'bg-white dark:bg-navy-800 text-navy-600 dark:text-cream-100/70 hover:bg-lavender-50 dark:hover:bg-navy-700 border border-lavender-100 dark:border-navy-700'
                }`}
              >
                {active && <Check size={14} />}
                {c.name}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Favorites summary */}
      <Section icon={<Heart size={20} />} title="Favorites">
        <Row label="Saved quotes" hint="Quotes you have hearted">
          <span className="rounded-full bg-lavender-100 dark:bg-navy-800 px-4 py-1.5 text-sm font-bold text-lavender-700 dark:text-lavender-200">{favorites.length}</span>
        </Row>
        {favorites.length > 0 && (
          <button onClick={() => setConfirmClear(true)} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-rose-50 dark:bg-rose-900/30 px-4 py-2 text-sm font-medium text-rose-600 dark:text-rose-300 transition-all hover:bg-rose-100 dark:hover:bg-rose-900/50">
            <Trash2 size={16} /> Clear all favorites
          </button>
        )}
      </Section>

      {/* About */}
      <Section icon={<Info size={20} />} title="About">
        <div className="space-y-2 text-sm text-navy-600 dark:text-cream-100/70">
          <div className="flex justify-between"><span>App</span><span className="font-semibold">DailyQuotes</span></div>
          <div className="flex justify-between"><span>Tagline</span><span className="font-semibold">A Little Inspiration Every Day</span></div>
          <div className="flex justify-between"><span>Quote library</span><span className="font-semibold">500 unique quotes</span></div>
          <div className="flex justify-between"><span>Categories</span><span className="font-semibold">20 themes</span></div>
          <div className="flex justify-between"><span>Card designs</span><span className="font-semibold">15 templates</span></div>
          <div className="flex justify-between"><span>Version</span><span className="font-semibold">1.0.0</span></div>
        </div>
        <p className="mt-4 text-xs text-navy-400 dark:text-cream-100/40">
          DailyQuotes is a free motivational quotes app. All favorites and preferences are stored locally on your device. Guest mode — no registration required.
        </p>
      </Section>

      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4 animate-fadeIn" onClick={() => setConfirmClear(false)}>
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-navy-800 p-6 shadow-card animate-scaleIn" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/40">
              <Trash2 size={24} className="text-rose-500" />
            </div>
            <h3 className="text-center font-serif text-xl font-semibold text-navy-900 dark:text-cream-50">Clear all favorites?</h3>
            <p className="mt-2 text-center text-sm text-navy-500 dark:text-cream-100/60">This removes all {favorites.length} saved quotes and cannot be undone.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setConfirmClear(false)} className="flex-1 rounded-full bg-lavender-100 dark:bg-navy-700 py-3 text-sm font-semibold text-navy-700 dark:text-cream-100 transition-all hover:bg-lavender-200 dark:hover:bg-navy-600">Cancel</button>
              <button onClick={() => { clearFavorites(); setConfirmClear(false); toast('Favorites cleared'); }} className="flex-1 rounded-full bg-rose-500 py-3 text-sm font-semibold text-white transition-all hover:bg-rose-600">Clear all</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-white dark:bg-navy-800/60 p-5 sm:p-6 shadow-soft border border-lavender-50 dark:border-navy-700/60">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lavender-100 dark:bg-navy-700 text-lavender-600 dark:text-lavender-300">{icon}</div>
        <h2 className="font-serif text-xl font-semibold text-navy-900 dark:text-cream-50">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-medium text-navy-800 dark:text-cream-100">{label}</p>
        {hint && <p className="text-xs text-navy-400 dark:text-cream-100/50">{hint}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function ThemeBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
        active ? 'bg-lavender-600 text-white shadow-soft' : 'bg-lavender-50 dark:bg-navy-700 text-navy-600 dark:text-cream-100/70 hover:bg-lavender-100 dark:hover:bg-navy-600'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
