import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { ToastProvider } from '@/components/Toast';
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/HomePage';
import { ExplorePage } from '@/pages/ExplorePage';
import { CategoriesPage } from '@/pages/CategoriesPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { StudioPage } from '@/pages/StudioPage';
import { QuoteDetailPage } from '@/pages/QuoteDetailPage';

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/studio" element={<StudioPage />} />
              <Route path="/quote/:id" element={<QuoteDetailPage />} />
            </Routes>
          </Layout>
        </HashRouter>
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
