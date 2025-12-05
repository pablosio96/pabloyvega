import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { House, MapPin, CaretRight, Heart, MusicNotes, Champagne, GameController } from '@phosphor-icons/react';
import logoWhite from '../assets/logo-white.svg';
import logoBlack from '../assets/logo-black.svg';
import './Navbar.css';

interface NavLinkItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_LINKS: NavLinkItem[] = [
  { to: '/', label: 'Inicio', icon: <House size={18} weight="light" /> },
  { to: '/historia', label: 'Nuestra Historia', icon: <Heart size={18} weight="light" /> },
  { to: '/info', label: 'Información', icon: <MapPin size={18} weight="light" /> },
  { to: '/preboda', label: 'Preboda', icon: <Champagne size={18} weight="light" /> },
  { to: '/musica', label: 'Playlist', icon: <MusicNotes size={18} weight="light" /> },
  { to: '/quiz', label: 'Quiz', icon: <GameController size={18} weight="light" /> },
];

const ASISTENCIA_PATH = '/asistencia';
const ASISTENCIA_LABEL = 'Confirmar asistencia';

function useScrollDetection(enabled: boolean) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setScrolled(false);
      return;
    }
    
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [enabled]);

  return scrolled;
}

// Bloquear scroll del body cuando sidebar está abierta
function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      document.documentElement.classList.add('scroll-locked');
    } else {
      document.documentElement.classList.remove('scroll-locked');
    }
    
    return () => {
      document.documentElement.classList.remove('scroll-locked');
    };
  }, [isLocked]);
}

function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  
  const isHomePage = pathname === '/';
  const scrolled = useScrollDetection(!isHomePage);
  const logo = isHomePage && !scrolled ? logoWhite : logoBlack;
  
  useBodyScrollLock(sidebarOpen);
  
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  
  const handleLogoClick = useCallback(() => {
    setSidebarOpen(false);
    navigate('/');
  }, [navigate]);
  
  // Cerrar sidebar con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) closeSidebar();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen, closeSidebar]);
  
  const navbarClasses = useMemo(() => {
    const classes = ['navbar'];
    if (!isHomePage || scrolled) classes.push('navbar-solid');
    if (scrolled) classes.push('navbar-scrolled');
    return classes.join(' ');
  }, [isHomePage, scrolled]);
  
  const isLightTheme = isHomePage && !scrolled;

  return (
    <>
      <header className={navbarClasses}>
        <div className="navbar-container">
          {/* Desktop view */}
          <nav className="desktop-header">
            <div className="nav-left">
              {NAV_LINKS.map(({ to, label }) => (
                <Link 
                  key={to} 
                  to={to} 
                  className={`nav-link ${pathname === to ? 'active' : ''} ${isLightTheme ? 'nav-link-light' : ''}`}
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="nav-center" style={{ visibility: isHomePage && !scrolled ? 'hidden' : 'visible' }}>
              <Link to="/" className="logo">
                <img src={logo} alt="Logo P&V" />
              </Link>
            </div>

            <div className="nav-right">
              <Link
                to={ASISTENCIA_PATH}
                className={`nav-cta ${isLightTheme ? 'nav-cta-light' : ''}`}
              >
                {ASISTENCIA_LABEL}
              </Link>
            </div>
          </nav>

          {/* Mobile view */}
          <div className={`mobile-header ${sidebarOpen ? 'sidebar-is-open' : ''}`}>
            <Link to="/" className="logo" style={{ visibility: isHomePage && !scrolled ? 'hidden' : 'visible' }}>
              <img src={logo} alt="Logo P&V" />
            </Link>
            <button
              className={`hamburger ${sidebarOpen ? 'is-active' : ''} ${isLightTheme ? 'hamburger-light' : ''}`}
              onClick={toggleSidebar}
              aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={sidebarOpen}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside 
        className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}
        aria-hidden={!sidebarOpen}
      >
        <div className="sidebar-header">
          <button 
            onClick={handleLogoClick}
            className="sidebar-logo-link"
            aria-label="Ir al inicio"
          >
            <img src={logoBlack} alt="Logo P&V" className="sidebar-logo" />
          </button>
          <button 
            className="sidebar-close" 
            onClick={closeSidebar}
            aria-label="Cerrar menú"
          >
            <span className="close-line"></span>
            <span className="close-line"></span>
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_LINKS.map(({ to, label, icon }) => (
            <Link 
              key={to} 
              to={to} 
              onClick={closeSidebar}
              className={`sidebar-link ${pathname === to ? 'sidebar-link-active' : ''}`}
            >
              <span className="sidebar-link-icon">{icon}</span>
              <span className="sidebar-link-text">{label}</span>
              <CaretRight size={18} className="sidebar-link-arrow" />
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link
            to={ASISTENCIA_PATH}
            className="sidebar-cta"
            onClick={closeSidebar}
          >
            {ASISTENCIA_LABEL}
          </Link>
          
          <p className="sidebar-date">22 de Agosto de 2026</p>
        </div>
      </aside>
    </>
  );
}

export default Navbar;
