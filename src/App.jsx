import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CanvasWrapper from './components/CanvasWrapper';
import ScrollToTop from './components/ScrollToTop';
import ScrollRestoration from './components/ScrollRestoration';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ArtworkDetail from './pages/ArtworkDetail';

// Admin Pages
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import HeroEditor from './pages/admin/HeroEditor';
import AboutEditor from './pages/admin/AboutEditor';
import GalleryEditor from './pages/admin/GalleryEditor';
import EventsEditor from './pages/admin/EventsEditor';
import ShopsEditor from './pages/admin/ShopsEditor';
import SEOEditor from './pages/admin/SEOEditor';
import UpdatePassword from './pages/UpdatePassword';

function App() {
  const location = useLocation();

  useEffect(() => {
    // Disable right-click context menu on public pages
    const handleContextMenu = (e) => {
      if (!location.pathname.startsWith('/admin')) {
        e.preventDefault();
      }
    };

    // Disable image dragging on public pages
    const handleDragStart = (e) => {
      if (!location.pathname.startsWith('/admin') && e.target.tagName === 'IMG') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, [location.pathname]);

  return (
    <AuthProvider>
      <Routes>
        {/* Admin Routes - No Navbar/Footer */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/update-password" element={<UpdatePassword />} />
        <Route path="/admin" element={<Admin />}>
          <Route index element={<Dashboard />} />
          <Route path="hero" element={<HeroEditor />} />
          <Route path="about" element={<AboutEditor />} />
          <Route path="gallery" element={<GalleryEditor />} />
          <Route path="events" element={<EventsEditor />} />
          <Route path="shops" element={<ShopsEditor />} />
          <Route path="seo" element={<SEOEditor />} />
        </Route>

        {/* Public Routes - With Navbar/Footer */}
        <Route
          path="*"
          element={
            <div className="app-container">
              <ScrollToTop />
              <ScrollRestoration />
              <CanvasWrapper />
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/gallery/:categoryId" element={<CategoryPage />} />
                  <Route path="/gallery/:categoryId/artwork/:artworkId" element={<ArtworkDetail />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
