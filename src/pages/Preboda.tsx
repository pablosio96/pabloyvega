import { useState, useCallback } from 'react';
import { useToast } from '../components/Toast';
import { WEDDING_CONFIG } from '../config';
import './Home.css';
import './Preboda.css';

type PrebodaForm = {
  nombre: string;
  apellidos: string;
  acompanante: 'sí' | 'no';
};

const INITIAL_FORM: PrebodaForm = {
  nombre: '',
  apellidos: '',
  acompanante: 'no',
};

function Preboda() {
  const [formData, setFormData] = useState<PrebodaForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<{ nombre?: string; apellidos?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const { showToast } = useToast();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = event.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    },
    [],
  );

  const toggleFlip = useCallback(() => {
    setFlipped((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const nombre = formData.nombre.trim();
      const apellidos = formData.apellidos.trim();

      const nextErrors: typeof errors = {};
      if (!nombre) nextErrors.nombre = 'Escribe tu nombre';
      if (!apellidos) nextErrors.apellidos = 'Escribe tus apellidos';
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await fetch(WEDDING_CONFIG.api.preboda, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre,
            apellidos,
            llevaAcompanante: formData.acompanante === 'sí',
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || 'No se ha podido confirmar la preboda');
        }

        showToast('Confirmación de preboda enviada. Revisa tu correo.', 'success');
        setFormData(INITIAL_FORM);
      } catch (error) {
        console.error('Preboda form error:', error);
        showToast(error instanceof Error ? error.message : 'Error al enviar la confirmación', 'error');
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, showToast, errors],
  );

  return (
    <div className="test-wedding">
      <section className="tw-hero preboda-hero">
        <div className="tw-hero__image-container preboda-hero-image-box">
          <img src="/images/wedding/baile_azul.png" alt="Dibujo de baile" className="tw-hero__image preboda-hero-blue-image" />
        </div>

        <div className="tw-hero__title-below preboda-hero-title-below">
          <h1 className="tw-hero__names preboda-hero-title">Preboda</h1>
        </div>

        <div className="tw-hero__frame-section preboda-hero-frame-section">
          <div className="tw-hero__frame-container preboda-frame-container">
            <img src="/images/wedding/00_curvas_azul.png" alt="Marco decorativo" className="tw-hero__frame-image" />
            <div className="tw-hero__frame-text preboda-frame-text">
              <p className="preboda-frame-date">{WEDDING_CONFIG.preboda.date.display.toUpperCase()}</p>
              <p className="preboda-frame-time">{WEDDING_CONFIG.preboda.time.start} - {WEDDING_CONFIG.preboda.time.end}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="tw-locations preboda-locations">
        <h2 className="tw-section-title tw-script">¿Dónde será?</h2>
        <p className="tw-locations__hint">Pulsa la tarjeta para saber cómo llegar y aparcar.</p>

        <div className="tw-locations__cards">
          <div className={`tw-flip-card visible`} onClick={toggleFlip}>
            <div className={`tw-flip-card__inner ${flipped ? 'flipped' : ''}`}>
              <div className="tw-flip-card__front">
                <span role="img" aria-label="Marco" className="tw-flip-card__frame" />
                <span role="img" aria-label="Lugar de preboda" className="tw-flip-card__img" />
                <div className="tw-flip-card__text">
                  <h3>{WEDDING_CONFIG.preboda.venue.name.toUpperCase()}</h3>
                  <p>{WEDDING_CONFIG.preboda.venue.address}</p>
                </div>
              </div>
              <div className="tw-flip-card__back">
                <span role="img" aria-label="Marco" className="tw-flip-card__frame" />
                <div className="tw-flip-card__back-content">
                  <a
                    className="tw-btn tw-btn--light tw-btn--full"
                    href={WEDDING_CONFIG.preboda.venue.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                  >
                    Ver dirección
                  </a>
                  <a
                    className="tw-btn tw-btn--light tw-btn--full"
                    href={WEDDING_CONFIG.preboda.parking.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                  >
                    Dónde aparcar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tw-rsvp">
        <div className="tw-rsvp__inner">
          <h2 className="tw-rsvp__title visible">Confirmar asistencia</h2>
          <span className="tw-rsvp__decoration" />

          <form className="tw-rsvp__form" onSubmit={handleSubmit}>
            <div className="tw-rsvp__row">
              <div className="tw-rsvp__field">
                <label htmlFor="nombre">Nombre</label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej. María"
                  autoComplete="given-name"
                />
                {errors.nombre && <span className="tw-rsvp__field-error">{errors.nombre}</span>}
              </div>
              <div className="tw-rsvp__field">
                <label htmlFor="apellidos">Apellidos</label>
                <input
                  id="apellidos"
                  name="apellidos"
                  type="text"
                  value={formData.apellidos}
                  onChange={handleChange}
                  placeholder="Ej. García Pérez"
                  autoComplete="family-name"
                />
                {errors.apellidos && <span className="tw-rsvp__field-error">{errors.apellidos}</span>}
              </div>
            </div>

            <div className="tw-rsvp__field full">
              <label>¿Llevas acompañante?</label>
              <div className="tw-rsvp__radio-row">
                <label className={`tw-rsvp__radio ${formData.acompanante === 'sí' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="acompanante"
                    value="sí"
                    checked={formData.acompanante === 'sí'}
                    onChange={handleChange}
                  />
                  Sí
                </label>
                <label className={`tw-rsvp__radio ${formData.acompanante === 'no' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="acompanante"
                    value="no"
                    checked={formData.acompanante === 'no'}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
            </div>

            <button type="submit" className="tw-btn tw-btn--full" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Confirmar asistencia'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Preboda;
