import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useMemo, lazy, Suspense, useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastProvider } from './components/Toast';
import SplashScreen from './components/SplashScreen';

// Lazy loading para mejor rendimiento
const Home = lazy(() => import('./pages/Home'));
const Info = lazy(() => import('./pages/Info'));
const Asistencia = lazy(() => import('./pages/Asistencia'));
const Historia = lazy(() => import('./pages/Historia'));
const Musica = lazy(() => import('./pages/Musica'));
const Preboda = lazy(() => import('./pages/Preboda'));
const Quiz = lazy(() => import('./pages/Quiz'));
const NotFound = lazy(() => import('./pages/NotFound'));

const ROUTES = [
  { path: '/', element: <Home /> },
  { path: '/info', element: <Info /> },
  { path: '/asistencia', element: <Asistencia /> },
  { path: '/historia', element: <Historia /> },
  { path: '/musica', element: <Musica /> },
  { path: '/preboda', element: <Preboda /> },
  { path: '/quiz', element: <Quiz /> },
] as const;

// Componente para scroll al top en cambio de ruta
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';
  
  const pageClass = useMemo(() => (isHomePage ? 'page-home' : ''), [isHomePage]);

  return (
    <div className={pageClass}>
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={<div className="loading">Cargando...</div>}>
        <Routes>
          {ROUTES.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {!isHomePage && <Footer />}
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  // Solo mostrar splash en la primera visita de la sesión
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (hasVisited) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('hasVisited', 'true');
  };

  return (
    <Router>
      <ToastProvider>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        <AppContent />
      </ToastProvider>
    </Router>
  );
}

export default App;
