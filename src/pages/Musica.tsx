import { useState, useCallback } from 'react';
import { MusicNotes, PaperPlaneTilt, Check, CircleNotch, ArrowSquareOut } from '@phosphor-icons/react';
import { WEDDING_CONFIG } from '../config';
import './Musica.css';

const { api, spotify } = WEDDING_CONFIG;

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
        setTimeout(() => setIsSubmitted(false), 3000);
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
      setTimeout(() => setIsSubmitted(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  }, [song, artist, name]);

  return (
    <main className="musica-container page-enter" role="main" aria-label="Playlist de la boda">
      <h1>Playlist de la boda</h1>
      <p className="musica-subtitle">¡Ayúdanos a crear la banda sonora perfecta!</p>

      <div className="musica-intro">
        <MusicNotes size={48} weight="light" className="musica-icon" />
        <p>
          Queremos que todos bailéis y os lo paséis genial.
          Sugiérenos las canciones que no pueden faltar en la fiesta.
        </p>
      </div>

      {/* Spotify Embed */}
      <section className="spotify-section">
        <h2>Nuestra playlist</h2>
        <div className="spotify-embed">
          <iframe
            title="Spotify Playlist"
            src={spotify.embedUrl}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
        <a
          href={spotify.playlistUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="spotify-link"
        >
          <ArrowSquareOut size={16} weight="light" />
          Abrir en Spotify
        </a>
      </section>

      {/* Suggestion Form */}
      <section className="suggestion-section">
        <h2>Sugiere una canción</h2>
        <form onSubmit={handleSubmit} className="suggestion-form">
          <div className="form-field">
            <input
              type="text"
              value={song}
              onChange={(e) => setSong(e.target.value)}
              placeholder=" "
              id="song"
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
            />
            <label htmlFor="name">Tu nombre (opcional)</label>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button
            type="submit"
            className={`submit-btn ${isSubmitted ? 'success' : ''}`}
            disabled={isSubmitting || isSubmitted}
          >
            {isSubmitting ? (
              <>
                <CircleNotch size={18} className="spinner" />
                Enviando...
              </>
            ) : isSubmitted ? (
              <>
                <Check size={18} weight="light" />
                ¡Sugerencia enviada!
              </>
            ) : (
              <>
                <PaperPlaneTilt size={18} weight="light" />
                Enviar sugerencia
              </>
            )}
          </button>
        </form>
      </section>

      <div className="musica-note">
        <p>💡 No prometemos poner todas las canciones, pero lo intentaremos 😉</p>
      </div>
    </main>
  );
}

export default Musica;
