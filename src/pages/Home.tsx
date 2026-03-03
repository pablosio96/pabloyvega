import { useState, useEffect, useRef, useCallback } from 'react';
import { WEDDING_CONFIG } from '../config';
import './Home.css';

const IMG = '/images/wedding';

const { couple, date, venue, timeline, faq, busStops } = WEDDING_CONFIG;

const PARADAS = busStops;

/* ── Helpers ── */
function useCountdown(target: Date) {
  const calc = useCallback(() => {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
    };
  }, [target]);

  const [time, setTime] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 60000);
    return () => clearInterval(id);
  }, [calc]);

  return time;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ── RSVP form types (mirrors Asistencia.tsx) ── */
interface RsvpData {
  nombre: string;
  apellidos: string;
  acompanantes: string;
  telefono: string;
  email: string;
  bus: string;
  parada: string;
  talla: string;
  preferencias: string;
}

const INITIAL_RSVP: RsvpData = {
  nombre: '',
  apellidos: '',
  acompanantes: '',
  telefono: '',
  email: '',
  bus: '',
  parada: '',
  talla: '',
  preferencias: '',
};

type RsvpErrors = Partial<Record<keyof RsvpData, string>>;

const PHONE_REGEX = /^\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ── Component ── */

function Home() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [rsvp, setRsvp] = useState<RsvpData>(INITIAL_RSVP);
  const [rsvpErrors, setRsvpErrors] = useState<RsvpErrors>({});
  const [rsvpSent, setRsvpSent] = useState(false);
  const [rsvpSending, setRsvpSending] = useState(false);
  const [rsvpError, setRsvpError] = useState('');
  const [musicSong, setMusicSong] = useState('');
  const [musicArtist, setMusicArtist] = useState('');
  const [musicName, setMusicName] = useState('');
  const [musicSent, setMusicSent] = useState(false);
  const [musicSending, setMusicSending] = useState(false);
  const [musicError, setMusicError] = useState('');
  const countdown = useCountdown(new Date(date.full));

  // refs para scroll tras éxito
  const rsvpSuccessRef = useRef<HTMLDivElement>(null);
  const musicSuccessRef = useRef<HTMLDivElement>(null);

  const heroObs = useInView(0.1);
  const musicObs = useInView();
  const scheduleObs = useInView();
  const rsvpObs = useInView();
  const faqObs = useInView();
  const closingObs = useInView();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'telefono') {
      setRsvp(prev => ({ ...prev, telefono: value.replace(/\D/g, '').slice(0, 9) }));
      setRsvpErrors(prev => ({ ...prev, telefono: undefined }));
      return;
    }
    setRsvp(prev => {
      if (name === 'bus' && value === 'no') return { ...prev, bus: value, parada: '' };
      return { ...prev, [name]: value };
    });
    setRsvpErrors(prev => ({ ...prev, [name]: undefined }));
  };


  const handleRsvp = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: RsvpErrors = {};
    if (!rsvp.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!rsvp.apellidos.trim()) newErrors.apellidos = 'Los apellidos son obligatorios';
    if (!rsvp.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    } else if (!PHONE_REGEX.test(rsvp.telefono)) {
      newErrors.telefono = 'Introduce 9 dígitos';
    }
    if (!rsvp.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!EMAIL_REGEX.test(rsvp.email)) {
      newErrors.email = 'Email inválido';
    }
    if (Object.keys(newErrors).length > 0) {
      setRsvpErrors(newErrors);
      return;
    }

    setRsvpSending(true);
    setRsvpError('');
    try {
      const response = await fetch(WEDDING_CONFIG.api.attendance, {
        redirect: 'follow',
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(rsvp),
      });
      if (response.ok) {
        setRsvpSent(true);
        setTimeout(() => {
          rsvpSuccessRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      } else {
        setRsvpError('Error al guardar los datos. Por favor, inténtalo de nuevo.');
      }
    } catch {
      setRsvpError('Error de conexión. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setRsvpSending(false);
    }
  };


  const handleMusicSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!musicSong.trim()) { setMusicError('Por favor, escribe el nombre de la canción'); return; }
    setMusicSending(true);
    setMusicError('');
    try {
      await fetch(WEDDING_CONFIG.api.musicSuggestions, {
        redirect: 'follow',
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ tipo: 'sugerencia_musica', cancion: musicSong, artista: musicArtist, nombre: musicName, fecha: new Date().toISOString() }),
      });
    } catch { /* silently accept */ }
    setMusicSent(true);
    setMusicSong('');
    setMusicArtist('');
    setMusicName('');
    setMusicSending(false);
    setTimeout(() => setMusicSent(false), 5000);
    setTimeout(() => {
      musicSuccessRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }, [musicSong, musicArtist, musicName]);

  /* ── Schedule items from config timeline ── */
  const SCHEDULE_IMGS: Record<string, string> = {
    'Ceremonia': `${IMG}/02_1.png`,
    'Cóctel': `${IMG}/02_2.png`,
    'Cena': `${IMG}/02_3.png`,
    'Fiesta': `${IMG}/02_4.png`,
  };

  return (
    <div className="test-wedding">

      {/* ═══ HERO ═══ */}
      <section className="tw-hero" ref={heroObs.ref}>
        <div className="tw-hero__image-container">
          <img src={`${IMG}/00_coche.png`} alt="Coche" className="tw-hero__image" />
          <div className="tw-hero__overlay-container">
            <img src={`${IMG}/NOS CASAMOS.png`} alt="Nos casamos" className="tw-hero__overlay" />
          </div>
        </div>
        <div className={`tw-hero__title-below`}>
          <h1 className="tw-hero__names">{couple.name1} y {couple.name2}</h1>
        </div>
        <div className="tw-hero__frame-section">
          <div className="tw-hero__frame-container">
            <img src={`${IMG}/00_CURVAS.png`} alt="Marco" className="tw-hero__frame-image" />
            <div className="tw-hero__frame-text">
              <p>{date.display.toUpperCase()}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ LOCATION FLIP CARD ═══ */}
      <section className="tw-locations">
        <h2 className="tw-section-title tw-script">¿Dónde será?</h2>
        <p className="tw-locations__hint">¡Pulsa para saber cómo llegar!</p>

        <div className="tw-locations__cards">
          <div className="tw-flip-card visible" onClick={() => setFlipped(p => ({ ...p, [0]: !p[0] }))}>
            <div className={`tw-flip-card__inner ${flipped[0] ? 'flipped' : ''}`}>
              <div className="tw-flip-card__front">
                <img src={`${IMG}/01_Marco.png`} alt="Marco" className="tw-flip-card__frame" />
                <img src={`${IMG}/rectoral_de_cobres_logo_dark.svg`} alt="Rectoral" className="tw-flip-card__img" />
                <div className="tw-flip-card__text">
                  <h3>{venue.name.toUpperCase()}</h3>
                  <p className="tw-flip-card__time">{timeline[0].time}H</p>
                </div>
              </div>
              <div className="tw-flip-card__back">
                <img src={`${IMG}/01_Marco.png`} alt="Marco" className="tw-flip-card__frame" />
                <div className="tw-flip-card__back-content">
                  <div className="tw-flip-card__info">
                    <span className="tw-flip-card__label">Lugar</span>
                    <span className="tw-flip-card__value">{venue.name}</span>
                  </div>
                  <div className="tw-flip-card__info">
                    <span className="tw-flip-card__label">Fecha</span>
                    <span className="tw-flip-card__value">{date.display.toUpperCase()}</span>
                  </div>
                  <div className="tw-flip-card__info">
                    <span className="tw-flip-card__label">Hora</span>
                    <span className="tw-flip-card__value">{timeline[0].time} hrs</span>
                  </div>
                  <a
                    href={venue.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tw-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Ver en Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ITINERARY ═══ */}
      <section className="tw-schedule" ref={scheduleObs.ref}>
        <h2 className={`tw-section-title tw-script tw-white ${scheduleObs.visible ? 'visible' : ''}`}>
          Itinerario
        </h2>
        <div className="tw-schedule__grid">
          {timeline.map((ev) => (
            <div key={ev.title} className={`tw-schedule__item ${scheduleObs.visible ? 'visible' : ''}`}>
              <h3>{ev.title.toUpperCase()}</h3>
              <img
                src={SCHEDULE_IMGS[ev.title] || `${IMG}/02_1.png`}
                alt={ev.title}
                className="tw-schedule__icon-img"
              />
              <p className="tw-schedule__time">{ev.time}</p>
            </div>
          ))}
        </div>
        <div className="tw-schedule__images-grid">
          <img src={`${IMG}/Casa.png`} alt="" className="tw-schedule__deco tw-schedule__deco--1" />
          <img src={`${IMG}/Copas.png`} alt="" className="tw-schedule__deco tw-schedule__deco--2" />
          <img src={`${IMG}/bola.png`} alt="" className="tw-schedule__deco tw-schedule__deco--3" />
          <img src={`${IMG}/Casa.png`} alt="" className="tw-schedule__deco tw-schedule__deco--1" />
          <img src={`${IMG}/Copas.png`} alt="" className="tw-schedule__deco tw-schedule__deco--2" />
          <img src={`${IMG}/bola.png`} alt="" className="tw-schedule__deco tw-schedule__deco--3" />
        </div>
      </section>

      {/* ═══ RSVP ═══ */}
      <section className="tw-rsvp" ref={rsvpObs.ref}>
        <div className="tw-rsvp__inner">
        <h2 className={`tw-rsvp__title ${rsvpObs.visible ? 'visible' : ''}`}>RSVP</h2>
        <img src={`${IMG}/Lazos.png`} alt="" className="tw-rsvp__decoration" />

        {rsvpSent ? (
          <div className="tw-rsvp__thanks" ref={rsvpSuccessRef}>
            <p>¡Gracias por confirmar, {rsvp.nombre}!</p>
            <p>Nos vemos el {date.display}.</p>
            <button
              className="tw-btn tw-rsvp__calendar-btn"
              onClick={() => {
                let isIOS = false;
                const navTyped = navigator as Navigator & { userAgentData?: { platform?: string } };
                if (navTyped.userAgentData?.platform) {
                  isIOS = /iPhone|iPad|iPod/.test(navTyped.userAgentData.platform);
                } else {
                  isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
                }
                if (isIOS) {
                  const icsContent = [
                    'BEGIN:VCALENDAR',
                    'VERSION:2.0',
                    'BEGIN:VEVENT',
                    'SUMMARY:Boda Pablo & Vega',
                    'DTSTART:20260822T163000Z',
                    'DTEND:20260823T020000Z',
                    'LOCATION:Rectoral de Cobres, 1729, 36142 Vilaboa, Pontevedra (España)',
                    'DESCRIPTION:¡Gracias por acompañarnos en este día tan especial!',
                    'END:VEVENT',
                    'END:VCALENDAR',
                  ].join('\r\n');
                  const blob = new Blob([icsContent], { type: 'text/calendar' });
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(blob);
                  link.download = 'boda-pablo-vega.ics';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                } else {
                  const title = encodeURIComponent('Boda Pablo & Vega');
                  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20260822T163000Z/20260823T020000Z`;
                  window.open(url, '_blank');
                }
              }}
            >
              Añadir al calendario
            </button>
          </div>
        ) : (
          <form className="tw-rsvp__form" onSubmit={handleRsvp}>
            {/* Nombre + Apellidos */}
            <div className="tw-rsvp__row">
              <div className="tw-rsvp__field">
                <label>NOMBRE</label>
                <input type="text" name="nombre" placeholder="Tu nombre" value={rsvp.nombre} onChange={handleChange} />
                {rsvpErrors.nombre && <span className="tw-rsvp__field-error">{rsvpErrors.nombre}</span>}
              </div>
              <div className="tw-rsvp__field">
                <label>APELLIDOS</label>
                <input type="text" name="apellidos" placeholder="Tus apellidos" value={rsvp.apellidos} onChange={handleChange} />
                {rsvpErrors.apellidos && <span className="tw-rsvp__field-error">{rsvpErrors.apellidos}</span>}
              </div>
            </div>

            {/* Teléfono + Email */}
            <div className="tw-rsvp__row">
              <div className="tw-rsvp__field">
                <label>TELÉFONO</label>
                <input type="tel" name="telefono" placeholder="600 000 000" value={rsvp.telefono} onChange={handleChange} />
                {rsvpErrors.telefono && <span className="tw-rsvp__field-error">{rsvpErrors.telefono}</span>}
              </div>
              <div className="tw-rsvp__field">
                <label>EMAIL</label>
                <input type="email" name="email" placeholder="tu@email.com" value={rsvp.email} onChange={handleChange} />
                {rsvpErrors.email && <span className="tw-rsvp__field-error">{rsvpErrors.email}</span>}
              </div>
            </div>

            {/* Acompañantes */}
            <div className="tw-rsvp__field full">
              <label>¿VIENES ACOMPAÑADO/A?</label>
              <textarea name="acompanantes" rows={2} placeholder="Nombres de tus acompañantes..." value={rsvp.acompanantes} onChange={handleChange} />
            </div>

            {/* Bus */}
            <div className="tw-rsvp__field full">
              <label>¿NECESITAS SERVICIO DE AUTOBÚS?</label>
              <div className="tw-rsvp__radio-row">
                {['sí', 'no'].map((opt) => (
                  <label key={opt} className={`tw-rsvp__radio ${rsvp.bus === opt ? 'selected' : ''}`}>
                    <input type="radio" name="bus" value={opt} checked={rsvp.bus === opt} onChange={handleChange} />
                    <span>{opt === 'sí' ? 'Sí' : 'No'}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Parada (condicional) */}
            {rsvp.bus === 'sí' && (
              <div className="tw-rsvp__field full tw-rsvp__field--indent">
                <label>¿DESDE DÓNDE SALDRÁS?</label>
                <div className="tw-rsvp__radio-row">
                  {PARADAS.map((p) => (
                    <label key={p} className={`tw-rsvp__radio ${rsvp.parada === p ? 'selected' : ''}`}>
                      <input type="radio" name="parada" value={p} checked={rsvp.parada === p} onChange={handleChange} />
                      <span>{p}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Talla */}
            <div className="tw-rsvp__field full">
              <label>TALLAS DE ZAPATOS (SOLO CHICAS)</label>
              <input type="text" name="talla" placeholder="Ej: 38, 39..." value={rsvp.talla} onChange={handleChange} />
              <span className="tw-rsvp__hint">Para las chanclas de baile</span>
            </div>

            {/* Preferencias */}
            <div className="tw-rsvp__field full">
              <label>PREFERENCIAS ALIMENTICIAS</label>
              <textarea name="preferencias" rows={2} placeholder="Vegetariano, alergias, intolerancias..." value={rsvp.preferencias} onChange={handleChange} />
              <span className="tw-rsvp__hint">Cuéntanos si tienes alguna necesidad especial</span>
            </div>

            <button type="submit" className="tw-btn tw-btn--full" disabled={rsvpSending}>
              {rsvpSending ? 'ENVIANDO...' : 'CONFIRMAR MI ASISTENCIA'}
            </button>
            {rsvpError && <p className="tw-rsvp__field-error" style={{ textAlign: 'center', marginTop: '0.5rem' }}>{rsvpError}</p>}
          </form>
        )}
        </div>
      </section>

      {/* ═══ DRESSCODE ═══ */}
      <section className="tw-dresscode">    
        <img src={`${IMG}/Baile.png`} alt="Dresscode" className="tw-dresscode__image" />
      </section>

      {/* ═══ FAQS ═══ */}
      <section className="tw-faqs" ref={faqObs.ref}>
        <h2 className={`tw-section-title tw-script tw-white ${faqObs.visible ? 'visible' : ''}`}>
          Preguntas
        </h2>
        <div className="tw-faqs__container">
          <div className="tw-faqs__list">
            {faq.map((item, i) => (
              <div key={i} className="tw-faqs__item">
                <button
                  className="tw-faqs__question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{item.question.toUpperCase()}</span>
                  <span className={`tw-faqs__icon ${openFaq === i ? 'open' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <div
                    className="tw-faqs__answer"
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                    onClick={(e) => {
                      const el = (e.target as HTMLElement).closest('[data-copy]') as HTMLElement | null;
                      if (el) {
                        navigator.clipboard.writeText(el.getAttribute('data-copy')!);
                        el.classList.add('copied');
                        setTimeout(() => el.classList.remove('copied'), 2000);
                      }
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="tw-faqs__decos-mobile">
            <img src={`${IMG}/Jarron.png`} alt="" />
            <img src={`${IMG}/Casa2.png`} alt="" />
          </div>
          <img src={`${IMG}/Jarron.png`} alt="" className="tw-faqs__deco tw-faqs__deco--left" />
          <img src={`${IMG}/Casa2.png`} alt="" className="tw-faqs__deco tw-faqs__deco--right" />
        </div>
      </section>

      {/* ═══ MUSIC ═══ */}
      <section className="tw-music" ref={musicObs.ref}>
        <div className="tw-music__inner">
          <h3 className={`tw-music__title ${musicObs.visible ? 'visible' : ''}`}>Nuestra Lista de Canciones</h3>
          <img src={`${IMG}/Lazos.png`} alt="" className="tw-music__deco" />
          <p className="tw-music__info">
            ¡Añade las canciones que no pueden faltar ese día!
          </p>

          {musicSent ? (
            <div className="tw-music__thanks" ref={musicSuccessRef}>
              <span className="tw-music__check">✓</span>
              <p>¡Sugerencia enviada! ¡Esperamos que suene en la fiesta!</p>
            </div>
          ) : (
            <form className="tw-music__form" onSubmit={handleMusicSubmit}>
              <div className="tw-rsvp__row">
                <div className="tw-rsvp__field">
                  <label>CANCIÓN</label>
                  <input
                    type="text"
                    value={musicSong}
                    onChange={e => setMusicSong(e.target.value)}
                    placeholder="Nombre de la canción"
                    required
                  />
                </div>
                <div className="tw-rsvp__field">
                  <label>ARTISTA</label>
                  <input
                    type="text"
                    value={musicArtist}
                    onChange={e => setMusicArtist(e.target.value)}
                    placeholder="Artista (opcional)"
                  />
                </div>
              </div>
              <div className="tw-rsvp__field full">
                <label>TU NOMBRE</label>
                <input
                  type="text"
                  value={musicName}
                  onChange={e => setMusicName(e.target.value)}
                  placeholder="Tu nombre (opcional)"
                />
              </div>
              {musicError && <p className="tw-music__error">{musicError}</p>}
              <button type="submit" className="tw-btn tw-btn--full" disabled={musicSending}>
                {musicSending ? 'ENVIANDO...' : 'ENVIAR SUGERENCIA'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ═══ CLOSING ═══ */}
      <section className="tw-closing" ref={closingObs.ref}>
        <div className={`tw-closing__content ${closingObs.visible ? 'visible' : ''}`}>
          <div className="tw-closing__text">
            <p className="tw-closing__quote">
              ¡Que empiece la fiesta...<br />y que nunca se acabe!
            </p>
            <div className="tw-closing__countdown">
              <img src={`${IMG}/00_CURVAS.png`} alt="" className="tw-closing__frame" />
              <p className="tw-closing__countdown-text">{countdown.days} d, {countdown.hours} h, {countdown.minutes} m</p>
            </div>
            <p className="tw-closing__names">{couple.name1} y {couple.name2}</p>
          </div>
          <div className="tw-closing__image-wrapper">
            <img src={`${IMG}/novia.png`} alt="¡No puedes faltar!" className="tw-closing__image" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
