import { useEffect, useRef, useState } from 'react';
import { 
  Heart, 
  Wine, 
  ForkKnife, 
  Confetti,
  Sparkle,
  MapPin,
  Phone,
  ArrowSquareOut,
  Copy,
  Check,
  Envelope
} from '@phosphor-icons/react';
import { WEDDING_CONFIG } from '../config';
import './Info.css';

interface TimelineEvent {
  time: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const TIMELINE_ICONS: Record<string, React.ReactNode> = {
  'Ceremonia': <Heart size={20} weight="light" />,
  'Cóctel': <Wine size={20} weight="light" />,
  'Cena': <ForkKnife size={20} weight="light" />,
  'Fiesta': <Confetti size={20} weight="light" />,
  'Fin de fiesta': <Sparkle size={20} weight="light" />,
};

const TIMELINE_EVENTS: TimelineEvent[] = WEDDING_CONFIG.timeline.map((event) => ({
  ...event,
  icon: TIMELINE_ICONS[event.title] || <Heart size={20} weight="light" />,
}));

const { venue, gift, hotels, contact, date } = WEDDING_CONFIG;

function Info() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [copiedIBAN, setCopiedIBAN] = useState(false);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    // Observer para timeline items
    const itemObserver = new IntersectionObserver(
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

    // Observer para secciones
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('id');
          if (entry.isIntersecting && id) {
            setVisibleSections((prev) => new Set(prev).add(id));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) itemObserver.observe(ref);
    });

    sectionRefs.current.forEach((ref) => {
      if (ref) sectionObserver.observe(ref);
    });

    return () => {
      itemObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  const copyIBAN = async () => {
    await navigator.clipboard.writeText(gift.iban);
    setCopiedIBAN(true);
    setTimeout(() => setCopiedIBAN(false), 2000);
  };

  return (
    <main className="info-container page-enter" role="main" aria-label="Información del evento">
      <h1>Información</h1>
      <p className="info-subtitle">{date.display}</p>

      {/* Timeline */}
      <section 
        id="programa" 
        className={`info-section section-animate ${visibleSections.has('programa') ? 'visible' : ''}`}
        ref={(el) => { if (el) sectionRefs.current.set('programa', el); }}
        aria-labelledby="programa-title"
      >
        <h2 id="programa-title" className="section-title">Programa del día</h2>
        <div className="timeline">
          <div className="timeline-line" />
          
          {TIMELINE_EVENTS.map((event, index) => (
            <div
              key={event.time}
              ref={(el) => { itemRefs.current[index] = el; }}
              data-index={index}
              className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'} ${
                visibleItems.has(index) ? 'visible' : ''
              }`}
            >
              <div className="timeline-dot">{event.icon}</div>
              <div className="timeline-content">
                <span className="timeline-time">{event.time}</span>
                <h3 className="timeline-title">{event.title}</h3>
                <p className="timeline-description">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ubicación */}
      <section 
        id="ubicacion" 
        className={`info-section section-animate ${visibleSections.has('ubicacion') ? 'visible' : ''}`}
        ref={(el) => { if (el) sectionRefs.current.set('ubicacion', el); }}
        aria-labelledby="ubicacion-title"
      >
        <h2 id="ubicacion-title" className="section-title">Ubicación</h2>
        <div className="location-card">
          <h3>{venue.name}</h3>
          <p>{venue.address}</p>
          <div className="map-container">
            <iframe
              title="Ubicación del venue"
              src={venue.embedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a 
            href={venue.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="location-btn"
          >
            <MapPin size={16} weight="light" />
            Abrir en Google Maps
          </a>
        </div>
      </section>

      {/* Alojamiento */}
      <section 
        id="alojamiento" 
        className={`info-section section-animate ${visibleSections.has('alojamiento') ? 'visible' : ''}`}
        ref={(el) => { if (el) sectionRefs.current.set('alojamiento', el); }}
        aria-labelledby="alojamiento-title"
      >
        <h2 id="alojamiento-title" className="section-title">Alojamiento</h2>
        <p className="section-description">
          Os recomendamos algunos hoteles cercanos al venue:
        </p>
        <div className="hotels-grid">
          {hotels.map((hotel) => (
            <div key={hotel.name} className="hotel-card">
              <h4>{hotel.name}</h4>
              <p className="hotel-distance">
                <MapPin size={14} weight="light" />
                {hotel.distance}
              </p>
              <p className="hotel-phone">
                <Phone size={14} weight="light" />
                {hotel.phone}
              </p>
              {hotel.website && (
                <a
                  href={hotel.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hotel-link"
                >
                  <ArrowSquareOut size={14} weight="light" />
                  Ver web
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Regalo */}
      <section 
        id="regalo" 
        className={`info-section section-animate ${visibleSections.has('regalo') ? 'visible' : ''}`}
        ref={(el) => { if (el) sectionRefs.current.set('regalo', el); }}
        aria-labelledby="regalo-title"
      >
        <h2 id="regalo-title" className="section-title">Lista de bodas</h2>
        <div className="gift-card">
          <p className="gift-message">{gift.message}</p>
          <div className="gift-iban">
            <span className="iban-label">IBAN:</span>
            <code className="iban-code">{gift.iban}</code>
            <button 
              className="copy-btn" 
              onClick={copyIBAN}
              aria-label="Copiar IBAN"
            >
              {copiedIBAN ? <><Check size={14} weight="light" /> Copiado</> : <><Copy size={14} weight="light" /> Copiar</>}
            </button>
          </div>
          <p className="gift-holder">Titular: {gift.holder}</p>
        </div>
      </section>

      {/* Contacto */}
      <section 
        id="contacto" 
        className={`info-section section-animate ${visibleSections.has('contacto') ? 'visible' : ''}`}
        ref={(el) => { if (el) sectionRefs.current.set('contacto', el); }}
        aria-labelledby="contacto-title"
      >
        <h2 id="contacto-title" className="section-title">Contacto</h2>
        <p className="section-description">
          ¿Tenéis alguna duda? No dudéis en escribirnos o llamarnos.
        </p>
        <div className="contact-card">
          <a href={`mailto:${contact.email}`} className="contact-email">
            <Envelope size={18} weight="light" />
            {contact.email}
          </a>
          <div className="contact-phones">
            {contact.contacts.map((person) => (
              <a 
                key={person.name}
                href={`tel:${person.phone.replace(/\s/g, '')}`}
                className="contact-phone"
              >
                <Phone size={16} weight="light" />
                <span className="contact-name">{person.name}</span>
                <span className="contact-number">{person.phone}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Info;
