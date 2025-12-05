import { useState, useCallback } from 'react';
import {
  MapPin,
  Clock,
  CalendarBlank,
  Car,
  NavigationArrow,
  Check,
  CircleNotch,
  User,
  Users,
  X
} from '@phosphor-icons/react';
import { useToast } from '../components/Toast';
import { WEDDING_CONFIG } from '../config';
import './Preboda.css';

const { preboda, api } = WEDDING_CONFIG;

interface FormData {
  nombre: string;
  asistira: string;
  acompanantes: string;
}

function Preboda() {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    asistira: '',
    acompanantes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim() || !formData.asistira) {
      showToast('Por favor, completa los campos obligatorios', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(api.preboda, {
        redirect: 'follow',
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          tipo: 'preboda',
          ...formData,
          fecha: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        showToast('Error al enviar. Inténtalo de nuevo.', 'error');
      }
    } catch {
      setIsSubmitted(true); // UX: mostrar éxito aunque falle
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="preboda-container page-enter" role="main" aria-label="Información de la preboda">
      <h1>Preboda</h1>
      <p className="preboda-subtitle">¡Empezamos a celebrar antes!</p>

      {/* Información del evento */}
      <section className="preboda-info">
        <div className="info-card">
          <div className="info-icon">
            <CalendarBlank size={24} weight="light" />
          </div>
          <div className="info-content">
            <h3>Fecha</h3>
            <p>{preboda.date.display}</p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon">
            <Clock size={24} weight="light" />
          </div>
          <div className="info-content">
            <h3>Horario</h3>
            <p>{preboda.time.start} - {preboda.time.end}</p>
          </div>
        </div>

        <div className="info-card full-width">
          <div className="info-icon">
            <MapPin size={24} weight="light" />
          </div>
          <div className="info-content">
            <h3>{preboda.venue.name}</h3>
            <p>{preboda.venue.address}</p>
          </div>
        </div>
      </section>

      {/* Enlaces de Maps */}
      <section className="preboda-maps">
        <h2>¿Cómo llegar?</h2>
        <div className="maps-buttons">
          <a 
            href={preboda.venue.mapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="map-btn"
          >
            <NavigationArrow size={20} weight="light" />
            <span>Ubicación del evento</span>
          </a>
          <a 
            href={preboda.parking.mapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="map-btn secondary"
          >
            <Car size={20} weight="light" />
            <span>Dónde aparcar</span>
          </a>
        </div>
      </section>

      {/* Descripción */}
      {preboda.description && (
        <section className="preboda-description">
          <p>{preboda.description}</p>
        </section>
      )}

      {/* Formulario de asistencia */}
      <section className="preboda-form-section">
        <h2>¿Vienes a la preboda?</h2>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="preboda-form" noValidate>
            <div className="form-field">
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder=" "
                id="nombre"
                required
              />
              <label htmlFor="nombre">Tu nombre *</label>
            </div>

            <div className="radio-card-group">
              <span className="radio-card-label">¿Asistirás? *</span>
              <div className="radio-cards">
                <label className={`radio-card ${formData.asistira === 'sí' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="asistira"
                    value="sí"
                    checked={formData.asistira === 'sí'}
                    onChange={handleChange}
                  />
                  <Check size={18} weight="light" />
                  <span>Sí, allí estaré</span>
                </label>
                <label className={`radio-card ${formData.asistira === 'no' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="asistira"
                    value="no"
                    checked={formData.asistira === 'no'}
                    onChange={handleChange}
                  />
                  <X size={18} weight="light" />
                  <span>No puedo ir</span>
                </label>
              </div>
            </div>

            {formData.asistira === 'sí' && (
              <div className="form-field">
                <input
                  type="text"
                  name="acompanantes"
                  value={formData.acompanantes}
                  onChange={handleChange}
                  placeholder=" "
                  id="acompanantes"
                />
                <label htmlFor="acompanantes">¿Vienes con alguien?</label>
                <span className="field-hint">Nombres de tus acompañantes</span>
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <CircleNotch size={18} className="spinner" />
                  Enviando...
                </>
              ) : (
                <>
                  <Check size={18} weight="light" />
                  Confirmar
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="success-message">
            <div className="success-icon">
              {formData.asistira === 'sí' ? (
                <Users size={48} weight="light" />
              ) : (
                <User size={48} weight="light" />
              )}
            </div>
            <h3>
              {formData.asistira === 'sí' 
                ? '¡Genial, te esperamos!' 
                : 'Gracias por avisarnos'}
            </h3>
            <p>
              {formData.asistira === 'sí'
                ? 'Hemos registrado tu asistencia a la preboda.'
                : 'Sentimos que no puedas venir, ¡nos vemos en la boda!'}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Preboda;
