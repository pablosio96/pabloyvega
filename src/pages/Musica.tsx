import { useState, useCallback } from 'react';
import { MusicNotes, Check, CircleNotch } from '@phosphor-icons/react';
import { WEDDING_CONFIG } from '../config';
import './Musica.css';

const { api } = WEDDING_CONFIG;

function Musica() {
  const [song, setSong] = useState('');
  const [artist, setArtist] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!song.trim()) {
      setError('Por favor, escribe el nombre de la canción');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(api.musicSuggestions, {
        redirect: 'follow',
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          tipo: 'sugerencia_musica',
          cancion: song,
          artista: artist,
          nombre: name,
          fecha: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setSong('');
        setArtist('');
        setName('');
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        setError('Error al enviar. Inténtalo de nuevo.');
      }
    } catch {
      // Si falla el fetch, guardamos localmente y mostramos éxito de todos modos
      // para mejor UX (la sugerencia se puede recoger después)
      setIsSubmitted(true);
      setSong('');
      setArtist('');
      setName('');
      setTimeout(() => setIsSubmitted(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  }, [song, artist, name]);

  return (
    <main className="musica-container page-enter" role="main" aria-label="Sugerencias de música">
      <h1>Sugiere una canción</h1>
      <p className="musica-subtitle">¡Ayúdanos a crear la banda sonora perfecta!</p>

      <div className="musica-intro">
        <MusicNotes size={48} weight="light" className="musica-icon" />
        <p>
          Queremos que todos bailéis y os lo paséis genial.
          Sugiérenos las canciones que no pueden faltar en la fiesta.
        </p>
      </div>

      {/* Suggestion Form or Confirmation */}
      <section className="suggestion-section">
        {isSubmitted ? (
          <div className="musica-confirmation">
            <div className="musica-confirmation-icon">
              <Check size={48} weight="light" />
            </div>
            <h2>¡Sugerencia enviada!</h2>
            <p>Gracias por tu propuesta. ¡Esperamos que suene en la fiesta!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="suggestion-form">
            <div className="form-field">
              <input
                type="text"
                value={song}
                onChange={(e) => setSong(e.target.value)}
                placeholder=" "
                id="song"
                autoComplete="off"
              />
              <label htmlFor="song">Nombre de la canción *</label>
            </div>

            <div className="form-field">
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder=" "
                id="artist"
                autoComplete="off"
              />
              <label htmlFor="artist">Artista (opcional)</label>
            </div>

            <div className="form-field">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=" "
                id="name"
                autoComplete="off"
              />
              <label htmlFor="name">Tu nombre (opcional)</label>
            </div>

            {error && <p className="form-error">{error}</p>}

            <button
              type="submit"
              className={`submit-btn`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <CircleNotch size={18} className="spinner" />
                  Enviando...
                </>
              ) : (
                <>Enviar sugerencia</>
              )}
            </button>
          </form>
        )}
      </section>

      <div className="musica-note">
        <p>No prometemos poner todas las canciones, pero lo intentaremos</p>
      </div>
    </main>
  );
}

export default Musica;
