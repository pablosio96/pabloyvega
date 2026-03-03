import { useMemo, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import bg from '../assets/fondo.jpg';
import logoWhite from '../assets/logo-white.svg';
import './Home.css';

function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);

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

  useEffect(() => {
    setIsLoaded(true);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <main className={`hero ${isLoaded ? 'hero-loaded' : ''}`} style={backgroundStyle}>
      <div className="hero-content">
        <header className={`title-container ${isLoaded ? 'fade-in' : ''}`}> 
          <img src={logoWhite} alt="Pablo & Vega" className="hero-logo" />
        </header>
      </div>

      {/* Fecha en móvil justo encima del botón */}
      <footer className={`subtitle-group ${isLoaded ? 'fade-in-delay' : ''}`}> 
        <div className="mobile-date">
          <time className="hero-date" dateTime="2026-08-22">22 · 08 · 2026</time>
        </div>
        <Link to="/asistencia" className="mobile-cta-btn">
          Confirmar asistencia
        </Link>
      </footer>

      {/* Fecha en desktop pegada al fondo */}
      <div className="desktop-date">
        <time className="hero-date" dateTime="2026-08-22">22 · 08 · 2026</time>
      </div>
    </main>
  );
}

export default Home;
