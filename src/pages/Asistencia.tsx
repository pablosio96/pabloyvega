import { useState, useCallback, useEffect } from 'react';
import {
  User,
  Check,
  X,
  Bus,
  Calendar,
  Sparkle,
  ArrowLeft,
  ArrowRight,
  CircleNotch,
  Clock
} from '@phosphor-icons/react';
import { useToast } from '../components/Toast';
import Confetti from '../components/Confetti';
import { WEDDING_CONFIG } from '../config';
import './Asistencia.css';

// Tipos
interface FormData {
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

type FormErrors = Partial<Record<keyof FormData, string>>;

// Constantes
const INITIAL_FORM_DATA: FormData = {
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

const WEDDING_DATE = new Date('2026-08-22T17:00:00');
// Fecha límite para confirmar asistencia - CONFIGURABLE
const RSVP_DEADLINE = new Date('2026-06-20T23:59:59');
const PARADAS = ['Porriño', 'Vigo', 'Pontevedra'] as const;
const PHONE_REGEX = /^\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STEPS = [
  { number: 1, title: 'Datos personales', icon: <User size={20} weight="light" /> },
  { number: 2, title: 'Detalles', icon: <Bus size={20} weight="light" /> },
];

// Mini countdown para la confirmación
function CountdownMini() {
  const [days, setDays] = useState(0);

  useEffect(() => {
    const updateDays = () => {
      const diff = WEDDING_DATE.getTime() - new Date().getTime();
      setDays(Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))));
    };
    updateDays();
    const timer = setInterval(updateDays, 60000);
    return () => clearInterval(timer);
  }, []);

  return <span className="countdown-days">{days} días</span>;
}

// Componente de aviso de fecha límite
function DeadlineNotice() {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const isDeadlinePassed = new Date() > RSVP_DEADLINE;
  const daysUntilDeadline = Math.ceil((RSVP_DEADLINE.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysUntilDeadline <= 7 && daysUntilDeadline > 0;

  if (isDeadlinePassed) {
    return (
      <div className="deadline-notice deadline-passed">
        <Clock size={18} weight="light" />
        <span>El plazo de confirmación ha finalizado</span>
      </div>
    );
  }

  return (
    <div className={`deadline-notice ${isUrgent ? 'deadline-urgent' : ''}`}>
      <Clock size={18} weight="light" />
      <span>
        Confirma antes del <strong>{formatDate(RSVP_DEADLINE)}</strong>
        {isUrgent && ` (¡Quedan ${daysUntilDeadline} días!)`}
      </span>
    </div>
  );
}

// Indicador de progreso
interface StepIndicatorProps {
  currentStep: number;
}

function StepIndicator({ currentStep }: StepIndicatorProps) {
  const stepIndex = currentStep === 1 ? 0 : 1;

  return (
    <div className="step-indicator">
      {STEPS.map((step, index) => (
        <div key={step.number} className="step-item-wrapper">
          <div
            className={`step-item ${index <= stepIndex ? 'active' : ''} ${index < stepIndex ? 'completed' : ''}`}
          >
            <div className="step-icon">
              {index < stepIndex ? <Check size={20} weight="light" /> : step.icon}
            </div>
            <span className="step-title">{step.title}</span>
          </div>
          {index < STEPS.length - 1 && (
            <div className={`step-connector ${index < stepIndex ? 'active' : ''}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// Componentes auxiliares
interface TextInputProps {
  label: string;
  name: keyof FormData;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: 'text' | 'email' | 'tel';
  placeholder?: string;
}

function TextInput({ label, name, value, onChange, error, type = 'text', placeholder }: TextInputProps) {
  return (
    <div className={`form-field ${error ? 'has-error' : ''} ${value ? 'has-value' : ''}`}>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || ' '}
        id={name}
      />
      <label htmlFor={name}>{label}</label>
      {error && <span className="error">{error}</span>}
    </div>
  );
}

interface RadioCardProps {
  label: string;
  name: keyof FormData;
  options: readonly string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icons?: React.ReactNode[];
}

function RadioCard({ label, name, options, value, onChange, error, icons }: RadioCardProps) {
  return (
    <div className="radio-card-group">
      <span className="radio-card-label">{label}</span>
      <div className="radio-cards">
        {options.map((option, index) => (
          <label
            key={option}
            className={`radio-card ${value === option ? 'selected' : ''}`}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={onChange}
            />
            {icons && <span className="radio-card-icon">{icons[index]}</span>}
            <span className="radio-card-text">{option}</span>
          </label>
        ))}
      </div>
      {error && <span className="error">{error}</span>}
    </div>
  );
}

interface TextAreaInputProps {
  label: string;
  name: keyof FormData;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  placeholder?: string;
  hint?: string;
}

function TextAreaInput({ label, name, value, onChange, rows = 3, placeholder, hint }: TextAreaInputProps) {
  return (
    <div className={`form-field textarea-field ${value ? 'has-value' : ''}`}>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder || ' '}
        id={name}
      />
      <label htmlFor={name}>{label}</label>
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}

function Asistencia() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormData;

    if (fieldName === 'telefono') {
      const onlyNums = value.replace(/\D/g, '').slice(0, 9);
      setFormData(prev => ({ ...prev, telefono: onlyNums }));
      setErrors(prev => ({ ...prev, telefono: undefined }));
      return;
    }

    setFormData(prev => {
      if (fieldName === 'bus' && value === 'no') {
        return { ...prev, bus: value, parada: '' };
      }
      return { ...prev, [fieldName]: value };
    });

    setErrors(prev => ({ ...prev, [fieldName]: undefined }));
  }, []);

  const validateStep = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.nombre.trim()) newErrors.nombre = 'Nombre requerido';
      if (!formData.apellidos.trim()) newErrors.apellidos = 'Apellidos requeridos';
      if (!formData.telefono.trim()) {
        newErrors.telefono = 'Teléfono requerido';
      } else if (!PHONE_REGEX.test(formData.telefono)) {
        newErrors.telefono = 'Teléfono inválido (9 dígitos)';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email requerido';
      } else if (!EMAIL_REGEX.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }
    }

    if (step === 3) {
      if (!formData.bus) newErrors.bus = 'Selecciona una opción';
      if (formData.bus === 'sí') {
        if (!formData.parada) newErrors.parada = 'Selecciona una parada';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [step, formData]);

  const handleNext = useCallback(() => {
    if (validateStep()) setStep(prev => prev + 2);
  }, [validateStep]);

  const handlePrev = useCallback(() => setStep(prev => prev - 2), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(WEDDING_CONFIG.api.attendance, {
        redirect: 'follow',
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStep(4);
      } else {
        showToast('Error al guardar los datos. Inténtalo de nuevo.', 'error');
      }
    } catch {
      showToast('Error de conexión. Inténtalo de nuevo más tarde.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="asistencia-container page-enter" role="main" aria-label="Formulario de confirmación de asistencia">
      <div className="header-fixed">
        <h1 className="step-header">Confirmar asistencia</h1>
        {step !== 4 && <DeadlineNotice />}
      </div>

      {step !== 4 && <StepIndicator currentStep={step} />}

      <div className="form-wrapper">
        {step !== 4 && (
          <form onSubmit={handleSubmit} className="form" noValidate>
            {step === 1 && (
              <div className="form-step">
                <div className="form-section">
                  <h3 className="section-label">¿Cómo te llamas?</h3>
                  <div className="form-row">
                    <TextInput
                      label="Nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      error={errors.nombre}
                      placeholder="Tu nombre"
                    />
                    <TextInput
                      label="Apellidos"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleChange}
                      error={errors.apellidos}
                      placeholder="Tus apellidos"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-label">¿Cómo contactamos contigo?</h3>
                  <div className="form-row">
                    <TextInput
                      label="Teléfono"
                      name="telefono"
                      type="tel"
                      value={formData.telefono}
                      onChange={handleChange}
                      error={errors.telefono}
                      placeholder="600 000 000"
                    />
                    <TextInput
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <TextAreaInput
                    label="¿Vienes acompañado/a?"
                    name="acompanantes"
                    value={formData.acompanantes}
                    onChange={handleChange}
                    placeholder="Nombres de tus acompañantes..."
                    hint="Indica los nombres de las personas que vendrán contigo"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-step">
                <div className="form-section">
                  <RadioCard
                    label="¿Necesitas servicio de autobús?"
                    name="bus"
                    options={['sí', 'no']}
                    value={formData.bus}
                    onChange={handleChange}
                    error={errors.bus}
                    icons={[<Bus size={16} key="bus" />, <X size={16} key="no" />]}
                  />
                </div>

                {formData.bus === 'sí' && (
                  <div className="form-section">
                    <RadioCard
                      label="¿Desde dónde saldrás?"
                      name="parada"
                      options={PARADAS}
                      value={formData.parada}
                      onChange={handleChange}
                      error={errors.parada}
                    />
                  </div>
                )}

                <div className="form-section">
                  <TextAreaInput
                    label="Tallas de zapatos (solo chicas)"
                    name="talla"
                    value={formData.talla}
                    onChange={handleChange}
                    placeholder="Ej: 38, 39..."
                    hint="Para las chanclas de baile"
                  />
                </div>

                <div className="form-section">
                  <TextAreaInput
                    label="Preferencias alimenticias"
                    name="preferencias"
                    value={formData.preferencias}
                    onChange={handleChange}
                    placeholder="Vegetariano, alergias, intolerancias..."
                    hint="Cuéntanos si tienes alguna necesidad especial"
                  />
                </div>
              </div>
            )}

            <div className="form-navigation">
              {step > 1 && (
                <button type="button" className="btn-secondary" onClick={handlePrev}>
                  <ArrowLeft size={16} weight="light" />
                  Atrás
                </button>
              )}
              {step === 1 && (
                <button type="button" className="btn-primary" onClick={handleNext}>
                  Siguiente
                  <ArrowRight size={16} weight="light" />
                </button>
              )}
              {step === 3 && (
                <button type="submit" className="btn-primary btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <CircleNotch size={16} className="spinner" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Check size={16} weight="light" />
                      Confirmar asistencia
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        )}

        {step === 4 && (
          <div className="thank-you-container">
            <Confetti />
            <div className="thank-you-icon">
              <Sparkle size={48} weight="light" />
            </div>
            <h2 className="thank-you-title">¡Nos vemos el 22 de agosto!</h2>
            <p className="thank-you-message">
              Gracias por confirmar tu asistencia, {formData.nombre}.
            </p>
            <div className="thank-you-details">
              <p>Te hemos enviado un email de confirmación a:</p>
              <strong>{formData.email}</strong>
            </div>
            <div className="thank-you-actions">
              <button 
                className="thank-you-btn"
                onClick={() => {
                  const startDate = '20260822T170000';
                  const endDate = '20260823T040000';
                  const title = encodeURIComponent('Boda Pablo & Vega');
                  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}`;
                  window.open(url, '_blank');
                }}
              >
                <Calendar size={16} weight="light" />
                Añadir al calendario
              </button>
              <button
                className="thank-you-btn secondary"
                onClick={() => window.location.href = '/info'}
              >
                Ver información del evento
              </button>
            </div>
            <div className="thank-you-countdown">
              <p>Solo quedan</p>
              <CountdownMini />
              <p>para el gran día</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Asistencia;
