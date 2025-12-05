import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CaretLeft, CaretRight } from '@phosphor-icons/react';
import './Galeria.css';

// Importar imágenes - ACTUALIZAR con fotos reales
import foto1 from '../assets/fondo.jpg';

interface Photo {
  id: number;
  src: string;
  alt: string;
  caption?: string;
}

// Placeholder photos - REEMPLAZAR con fotos reales de la pareja
const PHOTOS: Photo[] = [
  { id: 1, src: foto1, alt: 'Pablo y Vega', caption: 'Nuestro primer viaje juntos' },
  { id: 2, src: foto1, alt: 'Pablo y Vega', caption: 'En la playa' },
  { id: 3, src: foto1, alt: 'Pablo y Vega', caption: 'La pedida' },
  { id: 4, src: foto1, alt: 'Pablo y Vega', caption: 'Navidades en familia' },
  { id: 5, src: foto1, alt: 'Pablo y Vega', caption: 'Escapada a la montaña' },
  { id: 6, src: foto1, alt: 'Pablo y Vega', caption: 'Celebrando juntos' },
  { id: 7, src: foto1, alt: 'Pablo y Vega', caption: 'Día especial' },
  { id: 8, src: foto1, alt: 'Pablo y Vega', caption: 'Momentos inolvidables' },
  { id: 9, src: foto1, alt: 'Pablo y Vega', caption: 'Amor verdadero' },
];

function Galeria() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = useCallback((photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedPhoto(null);
  }, []);

  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? PHOTOS.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setSelectedPhoto(PHOTOS[newIndex]);
  }, [currentIndex]);

  const goToNext = useCallback(() => {
    const newIndex = currentIndex === PHOTOS.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setSelectedPhoto(PHOTOS[newIndex]);
  }, [currentIndex]);

  // Bloquear scroll y manejar teclado
  useEffect(() => {
    if (selectedPhoto) {
      document.body.style.overflow = 'hidden';
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') goToPrevious();
        if (e.key === 'ArrowRight') goToNext();
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedPhoto, closeLightbox, goToPrevious, goToNext]);

  return (
    <main className="galeria-container page-enter" role="main" aria-label="Galería de fotos">
      <h1>Galería</h1>
      <p className="galeria-subtitle">Algunos de nuestros momentos favoritos</p>

      <div className="photo-grid">
        {PHOTOS.map((photo, index) => (
          <div 
            key={photo.id} 
            className="photo-item"
            onClick={() => openLightbox(photo, index)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <img src={photo.src} alt={photo.alt} loading="lazy" />
            <div className="photo-overlay">
              <span className="photo-caption">{photo.caption}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox - renderizado en body via portal */}
      {selectedPhoto && createPortal(
        <div 
          className="lightbox" 
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <button 
            className="lightbox-close" 
            onClick={closeLightbox}
            aria-label="Cerrar"
          >
            <X size={24} weight="light" />
          </button>
          
          <button 
            className="lightbox-nav lightbox-prev" 
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            aria-label="Anterior"
          >
            <CaretLeft size={32} weight="light" />
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedPhoto.src} alt={selectedPhoto.alt} />
            {selectedPhoto.caption && (
              <p className="lightbox-caption">{selectedPhoto.caption}</p>
            )}
            <p className="lightbox-counter">{currentIndex + 1} / {PHOTOS.length}</p>
          </div>

          <button 
            className="lightbox-nav lightbox-next" 
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            aria-label="Siguiente"
          >
            <CaretRight size={32} weight="light" />
          </button>
        </div>,
        document.body
      )}
    </main>
  );
}

export default Galeria;
