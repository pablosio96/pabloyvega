import { useEffect, useRef, useState } from 'react';
import { Heart, Airplane, House, Diamond, Sparkle } from '@phosphor-icons/react';
import { WEDDING_CONFIG } from '../config';
import './Historia.css';

const ICONS: Record<string, React.ReactNode> = {
  'Nos conocimos': <Sparkle size={24} weight="light" />,
  'Primera cita': <Heart size={24} weight="light" />,
  'Primer viaje juntos': <Airplane size={24} weight="light" />,
  'Nos fuimos a vivir juntos': <House size={24} weight="light" />,
  'La pedida': <Diamond size={24} weight="light" />,
};

function Historia() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-index'));
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set(prev).add(index));
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="historia-container page-enter" role="main" aria-label="Nuestra historia">
      <h1>Nuestra Historia</h1>
      <p className="historia-subtitle">El camino hasta el "Sí, quiero"</p>

      <div className="historia-intro">
        <p>
          Dicen que las mejores historias de amor son las que no se planean. 
          La nuestra comenzó sin que ninguno de los dos lo esperara, y aquí estamos, 
          a punto de dar el paso más importante de nuestras vidas.
        </p>
      </div>

      <div className="historia-timeline">
        <div className="historia-line" />

        {WEDDING_CONFIG.milestones.map((milestone, index) => (
          <div
            key={milestone.year + milestone.title}
            ref={(el) => { itemRefs.current[index] = el; }}
            data-index={index}
            className={`historia-item ${visibleItems.has(index) ? 'visible' : ''}`}
          >
            <div className="historia-year">{milestone.year}</div>
            <div className="historia-dot">{ICONS[milestone.title] ?? <Sparkle size={24} weight="light" />}</div>
            <div className="historia-content">
              <h3>{milestone.title}</h3>
              <p>{milestone.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="historia-footer">
        <Heart size={32} className="historia-heart" />
        <p>Y la historia continúa...</p>
        <span className="historia-date">22 de Agosto de 2026</span>
      </div>
    </main>
  );
}

export default Historia;
