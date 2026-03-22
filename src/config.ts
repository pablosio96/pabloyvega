// Flag para mostrar/ocultar la página de la preboda
export const SHOW_PREBODA = false;
// ============================================
// CONFIGURACIÓN CENTRAL DE LA BODA
// Edita estos valores con tu información real
// ============================================

export const WEDDING_CONFIG = {
  // Información de la pareja
  couple: {
    name1: 'Pablo',
    name2: 'Vega',
    fullNames: 'Pablo y Vega',
    footerNames: 'Pablo + Vega',
  },

  // Fecha y hora
  date: {
    // Guardar como string y crear Date en el componente para evitar desfases
    full: '2026-08-22', // solo fecha
    display: '22 Agosto 2026',
    short: '22.08.26',
    time: '18:30',
    calendarStart: '20260822T183000',
    calendarEnd: '20260823T040000',
  },

  // Ubicación del venue
  venue: {
    name: 'Rectoral de Cobres',
    address: '36142 Vilaboa, Pontevedra (España)',
    city: 'Vigo',
    lat: 42.307742,
    lng: -8.661104,
    mapsUrl: 'https://www.google.com/maps/place/Rectoral+de+Cobres+1729/@42.3077417,-8.6636792,753m/data=!3m2!1e3!4b1!4m11!3m10!1s0xd2f64ab2f35f6d1:0x1276b1adb72a24ad!5m4!1s2026-03-19!2i2!4m1!1i2!8m2!3d42.3077417!4d-8.6611043!16s%2Fg%2F1tnl2pkk?entry=ttu&g_ep=EgoyMDI2MDIyNS4wIKXMDSoASAFQAw%3D%3D',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2942.8!2d-8.6636792!3d42.3077417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd2f64ab2f35f6d1%3A0x1276b1adb72a24ad!2sRectoral%20de%20Cobres%201729!5e0!3m2!1ses!2ses!4v1701700000000',
  },

  // Información de regalo
  gift: {
    message: 'Vuestra presencia es nuestro mejor regalo. Pero si deseáis hacernos un obsequio, podéis contribuir a nuestra luna de miel.',
    iban: 'ES55 2080 5043 9130 4007 9723',
    holder: 'Pablo y Vega',
  },

  // APIs
  api: {
    attendance: '/api/rsvp',
    musicSuggestions: '/api/song',
    preboda: '/api/preboda',
    quiz: '/api/quiz',
  },

  // Spotify
  spotify: {
    playlistUrl: 'https://open.spotify.com/playlist/TU_PLAYLIST_ID',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M',
  },

  // Contacto
  contact: {
    email: 'bodapabloyvega@gmail.com',
    contacts: [
      { name: 'Pablo', phone: '+34 677 171 977' },
      { name: 'Vega', phone: '+34 690 027 180' },
    ],
  },

  // Web
  web: {
    url: 'https://pabloyvega.com',
    title: 'Pablo y Vega - ¡Nos casamos!',
    description: 'Te invitamos a celebrar nuestra boda el 22 de agosto de 2026.',
  },

  // Programa del día
  timeline: [
    {
      time: '18:30',
      title: 'Ceremonia',
      description: 'Nos damos el "Sí, quiero". Os esperamos puntuales para no perderos ni un momento.',
      icon: 'rings',
    },
    {
      time: '19:30',
      title: 'Cóctel',
      description: 'Brindis y aperitivos mientras disfrutamos juntos de la puesta de sol.',
      icon: 'glass',
    },
    {
      time: '21:00',
      title: 'Cena',
      description: 'Cena especial para celebrar este día tan importante con todos vosotros.',
      icon: 'plate',
    },
    {
      time: '23:00',
      title: 'Fiesta',
      description: '¡A bailar! La pista de baile os espera para celebrar toda la noche.',
      icon: 'music',
    },
    {
      time: '04:00',
      title: 'Fin',
      description: '¡Gracias por acompañarnos hasta el final! Cerramos la pista a las 4:00.',
      icon: 'moon',
    },
  ],

  // Hoteles recomendados
  hotels: [
    {
      name: 'Hotel Atlántico',
      distance: 'Vigo',
      phone: '+34 986 220 530',
      website: 'https://www.hotelatlanticovigo.com/es/',
    },
    {
      name: 'B&B Hotel',
      distance: 'Vigo',
      phone: '+34 986 220 220',
      website: 'https://www.hotel-bb.com/es',
    },
    {
      name: 'Hotel Rías Bajas',
      distance: 'Pontevedra',
      phone: '+34 986 855 100',
      website: 'https://www.hotelriasbajas.com/es/',
    },
  ],

  // Preguntas frecuentes
  faq: [
    {
      question: '¿Hay parking disponible?',
      answer: 'Sí, el pazo dispone de parking gratuito para todos los invitados.',
    },
    {
      question: '¿Pueden asistir niños?',
      answer: 'Por supuesto, los más peques son bienvenidos.',
    },
    {
      question: '¿Hay opciones vegetarianas/veganas?',
      answer: 'Sí, indicadlo en el formulario de asistencia y lo tendremos en cuenta.',
    },
    {
      question: '¿Y si os queremos hacer un regalo?',
      answer: 'Os dejamos nuestra cuenta bancaria:<br><br><span class="tw-faq-icon"></span> Titular: Pablo y Vega<br>IBAN: <span class="tw-faq-copy" data-copy="ES55 2080 5043 9130 4007 9723">ES55 2080 5043 9130 4007 9723</span>',
    },
    {
      question: '¿Alguna pregunta más?',
      answer: '¡Aquí estamos! Podéis contactarnos en:<br><br><span class="tw-faq-icon">✉</span> <a href="mailto:bodapabloyvega@gmail.com">bodapabloyvega@gmail.com</a><br><span class="tw-faq-icon">✆</span> Pablo: <a href="tel:+34677171977">677 171 977</a><br><span class="tw-faq-icon">✆</span> Vega: <a href="tel:+34690027180">690 027 180</a>',
    },
  ],

  // Paradas de autobús
  busStops: ['Porriño', 'Vigo', 'Pontevedra'] as const,

  // Preboda
  preboda: {
    date: {
      full: new Date('2026-08-21T20:00:00'),
      display: '21 de Agosto de 2026',
    },
    time: {
      start: '20:00',
      end: '00:00',
    },
    venue: {
      name: 'Villa Pitusa',
      address: 'Casa de la abu de Pablo',
      mapsUrl: 'https://maps.app.goo.gl/Ja4uj7vc6Y6e1rc87?g_st=ic',
    },
    parking: {
      mapsUrl: 'https://maps.app.goo.gl/8kPirmUZUDi4ojPPA?g_st=ic',
    },
    description: 'Una noche para empezar a celebrar antes del gran día. Picoteo y unas cervecitas con los más cercanos.',
  },

  // Quiz sobre los novios
  quiz: {
    questions: [
      {
        question: '¿Cómo se conocieron Pablo y Vega?',
        options: ['En una fiesta', 'En el trabajo', 'Por amigos en común', 'Por una app de citas'],
        correctIndex: 3,
      },
      {
        question: '¿Dónde fue su primera cita?',
        options: ['Cena en un restaurante', 'Chiringuito en la playa', 'Cine', 'Concierto'],
        correctIndex: 1,
      },
      {
        question: '¿Cuál es la película favorita de ambos?',
        options: ['Titanic', 'The Notebook', 'Up', 'La La Land'],
        correctIndex: 2,
      },
      {
        question: '¿Cuál es el destino de la luna de miel de la pareja?',
        options: ['Japón', 'Kenia', 'Bali', 'Nueva York'],
        correctIndex: 0,
      },
      {
        question: '¿Qué comida les gusta compartir?',
        options: ['Pizza', 'Sushi', 'Tacos', 'Pasta'],
        correctIndex: 0,
      },
      {
        question: '¿Cuántos años llevan juntos?',
        options: ['3 años', '5 años', '7 años', '8 años'],
        correctIndex: 1,
      },
      {
        question: '¿Cuál es su canción?',
        options: ['Perfect - Ed Sheeran', 'Thinking Out Loud', 'All of Me', 'A Thousand Years'],
        correctIndex: 0,
      },
      {
        question: '¿Dónde fue la pedida de mano?',
        options: ['En casa', 'En un viaje', 'En la playa', 'Es la montaña'],
        correctIndex: 2,
      },
      {
        question: '¿Qué mascota tienen?',
        options: ['Un perro', 'Un gato', 'Un conejo', 'Ninguna'],
        correctIndex: 3,
      },
      {
        question: '¿Cuál es el hobby que comparten?',
        options: ['Viajar', 'Cocinar', 'Ver series', 'Todas las anteriores'],
        correctIndex: 3,
      },
    ],
  },

  // Historia de la pareja
  milestones: [
    {
      year: '2021',
      title: 'Nos conocimos',
      description: 'Todo empezó en una noche de verano. Un encuentro casual que cambiaría nuestras vidas para siempre.',
    },
    {
      year: '2021',
      title: 'Primera cita',
      description: 'Después de meses hablando, por fin quedamos. Nervios, risas y la certeza de que algo especial estaba empezando.',
    },
    {
      year: '2021',
      title: 'Primer viaje juntos',
      description: 'Descubrimos que viajando juntos todo era mejor. Nuevos lugares, nuevas aventuras, nuevos recuerdos.',
    },
    {
      year: '2023',
      title: 'Nos fuimos a vivir juntos',
      description: 'Dimos el paso de compartir un hogar. Aprendimos a convivir, a cuidarnos y a construir nuestro pequeño mundo.',
    },
    {
      year: '2025',
      title: 'La pedida',
      description: 'En un momento mágico, la pregunta más importante. Y la respuesta más esperada: ¡Sí, quiero!',
    },
  ],
} as const;

export type WeddingConfig = typeof WEDDING_CONFIG;
