import { useEffect, useRef, useState } from 'react';
import { Heart, Airplane, House, Diamond, Sparkle } from '@phosphor-icons/react';
import './Historia.css';

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const MILESTONES: Milestone[] = [
  {
    year: '2018',
    title: 'Nos conocimos',
    description: 'Todo empezó en una noche de verano. Un encuentro casual que cambiaría nuestras vidas para siempre.',
    icon: <Sparkle size={24} weight="light" />,
  },
  {
    year: '2019',
    title: 'Primera cita',
    description: 'Después de meses hablando, por fin quedamos. Nervios, risas y la certeza de que algo especial estaba empezando.',
    icon: <Heart size={24} weight="light" />,
  },
  {
    year: '2020',
    title: 'Primer viaje juntos',
    description: 'Descubrimos que viajando juntos todo era mejor. Nuevos lugares, nuevas aventuras, nuevos recuerdos.',
    icon: <Airplane size={24} weight="light" />,
  },
  {
    year: '2022',
    title: 'Nos fuimos a vivir juntos',
    description: 'Dimos el paso de compartir un hogar. Aprendimos a convivir, a cuidarnos y a construir nuestro pequeño mundo.',
    icon: <House size={24} weight="light" />,
  },
  {
    year: '2025',
    title: 'La pedida',
    description: 'En un momento mágico, la pregunta más importante. Y la respuesta más esperada: ¡Sí, quiero!',
    icon: <Diamond size={24} weight="light" />,
  },
];

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
        
        {MILESTONES.map((milestone, index) => (
          <div
            key={milestone.year}
            ref={(el) => { itemRefs.current[index] = el; }}
            data-index={index}
            className={`historia-item ${visibleItems.has(index) ? 'visible' : ''}`}
          >
            <div className="historia-year">{milestone.year}</div>
            <div className="historia-dot">{milestone.icon}</div>
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
