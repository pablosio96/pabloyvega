import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import bg from '../assets/fondo.jpg';
import logoWhite from '../assets/logo-white.svg';
import './Home.css';

function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const navigate = useNavigate();
  const hasNavigated = useRef(false);

  const smoothNavigate = useCallback((path: string) => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;
    setIsExiting(true);
    setTimeout(() => navigate(path), 500);
  }, [navigate]);

  const backgroundStyle = useMemo(
    () => ({ 
      backgroundImage: `url(${bg})`,
      backgroundPositionY: `calc(50% + ${parallaxOffset * 0.3}px)`,
    }),
    [parallaxOffset]
  );

  const handleScroll = useCallback(() => {
    setParallaxOffset(window.scrollY);
  }, []);

  // Detectar scroll con rueda del ratón o touch para navegar
  useEffect(() => {
    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 50 && !hasNavigated.current) {
        smoothNavigate('/info');
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      
      if (deltaY > 50 && !hasNavigated.current) {
        smoothNavigate('/info');
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [smoothNavigate]);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <main className={`hero ${isLoaded ? 'hero-loaded' : ''} ${isExiting ? 'hero-exiting' : ''}`} style={backgroundStyle}>
      <div className="hero-content">
        <header className={`title-container ${isLoaded ? 'fade-in' : ''}`}>
          <img src={logoWhite} alt="Pablo & Vega" className="hero-logo" />
          <time className="hero-date" dateTime="2026-08-22">22 · 08 · 2026</time>
        </header>
      </div>

      <footer className={`subtitle-group ${isLoaded ? 'fade-in-delay' : ''}`}>
        <button 
          className="scroll-indicator"
          onClick={() => smoothNavigate('/info')}
          aria-label="Ver más información"
        >
          <span className="scroll-text">Descubre más</span>
          <div className="scroll-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </div>
        </button>
      </footer>
    </main>
  );
}

export default Home;
