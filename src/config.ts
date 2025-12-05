// ============================================
// CONFIGURACIÓN CENTRAL DE LA BODA
// Edita estos valores con tu información real
// ============================================

export const WEDDING_CONFIG = {
  // Información de la pareja
  couple: {
    name1: 'Pablo',
    name2: 'Vega',
    fullNames: 'Pablo & Vega',
  },

  // Fecha y hora
  date: {
    full: new Date('2026-08-22T17:00:00'),
    display: '22 de Agosto de 2026',
    short: '22.08.26',
    time: '17:00',
    calendarStart: '20260822T170000',
    calendarEnd: '20260823T040000',
  },

  // Ubicación del venue
  venue: {
    name: 'Rectoral de Cobres, 1729',
    address: '36142 Vilaboa, Pontevedra (España)',
    city: 'Vigo',
    lat: 42.307742,
    lng: -8.661104,
    mapsUrl: 'https://www.google.com/maps/place/Rectoral+de+Cobres+1729/@42.3077417,-8.6611043,17z',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2942.8!2d-8.6636792!3d42.3077417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd2f64ab2f35f6d1%3A0x1276b1adb72a24ad!2sRectoral%20de%20Cobres%201729!5e0!3m2!1ses!2ses!4v1701700000000',
  },

  // Información de regalo
  gift: {
    message: 'Vuestra presencia es nuestro mejor regalo. Pero si deseáis hacernos un obsequio, podéis contribuir a nuestra luna de miel.',
    iban: 'ES00 0000 0000 0000 0000 0000',
    holder: 'Pablo y Vega',
  },

  // APIs
  api: {
    attendance: 'https://script.google.com/macros/s/AKfycby_mnjj7CF8JG_yFLA8qGNEQTQEGnuE0Lkwqzkgw9vWNkGe71M8dkh73hJVMs3hgEiI/exec',
    musicSuggestions: 'https://script.google.com/macros/s/AKfycby_mnjj7CF8JG_yFLA8qGNEQTQEGnuE0Lkwqzkgw9vWNkGe71M8dkh73hJVMs3hgEiI/exec',
    preboda: 'https://script.google.com/macros/s/AKfycby_mnjj7CF8JG_yFLA8qGNEQTQEGnuE0Lkwqzkgw9vWNkGe71M8dkh73hJVMs3hgEiI/exec',
    quiz: 'https://script.google.com/macros/s/AKfycby_mnjj7CF8JG_yFLA8qGNEQTQEGnuE0Lkwqzkgw9vWNkGe71M8dkh73hJVMs3hgEiI/exec',
  },

  // Spotify
  spotify: {
    playlistUrl: 'https://open.spotify.com/playlist/TU_PLAYLIST_ID',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M',
  },

  // Contacto
  contact: {
    email: 'hola@pabloyvega.com',
    contacts: [
      { name: 'Pablo', phone: '+34 600 000 000' },
      { name: 'Vega', phone: '+34 600 000 001' },
    ],
  },

  // Web
  web: {
    url: 'https://pabloyvega.com',
    title: 'Pablo & Vega - ¡Nos casamos!',
    description: 'Te invitamos a celebrar nuestra boda el 22 de agosto de 2026.',
  },

  // Programa del día
  timeline: [
    {
      time: '17:00',
      title: 'Ceremonia',
      description: 'Nos damos el "Sí, quiero". Os esperamos puntuales para no perderos ni un momento.',
    },
    {
      time: '19:00',
      title: 'Cóctel',
      description: 'Brindis y aperitivos mientras disfrutamos juntos de la puesta de sol.',
    },
    {
      time: '21:00',
      title: 'Cena',
      description: 'Cena especial para celebrar este día tan importante con todos vosotros.',
    },
    {
      time: '23:00',
      title: 'Fiesta',
      description: '¡A bailar! La pista de baile os espera para celebrar toda la noche.',
    },
    {
      time: '00:00',
      title: 'Fin de fiesta',
      description: 'Barra libre y diversión hasta que el cuerpo aguante.',
    },
  ],

  // Hoteles recomendados
  hotels: [
    {
      name: 'Hotel Ejemplo 1',
      distance: 'A 5 min del venue',
      phone: '+34 600 000 000',
      website: 'https://ejemplo.com',
    },
    {
      name: 'Hotel Ejemplo 2',
      distance: 'A 10 min del venue',
      phone: '+34 600 000 001',
      website: 'https://ejemplo2.com',
    },
    {
      name: 'Hotel Ejemplo 3',
      distance: 'A 15 min del venue',
      phone: '+34 600 000 002',
      website: undefined,
    },
  ],

  // Preguntas frecuentes
  faq: [
    {
      question: '¿Hay parking disponible?',
      answer: 'Sí, el venue dispone de parking gratuito para todos los invitados.',
    },
    {
      question: '¿Pueden asistir niños?',
      answer: 'Por supuesto, los más pequeños son bienvenidos. Habrá una zona infantil.',
    },
    {
      question: '¿Cuál es el código de vestimenta?',
      answer: 'Elegante pero cómodo. Evitar el color blanco que está reservado para la novia.',
    },
    {
      question: '¿Hay opciones vegetarianas/veganas?',
      answer: 'Sí, indicadlo en el formulario de asistencia y lo tendremos en cuenta.',
    },
    {
      question: '¿Puedo llevar acompañante?',
      answer: 'Si tu invitación incluye acompañante, indícalo en el formulario de asistencia.',
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
      name: 'Nombre del lugar de la preboda',
      address: 'Dirección del lugar',
      mapsUrl: 'https://www.google.com/maps/place/TU_LUGAR_PREBODA',
    },
    parking: {
      mapsUrl: 'https://www.google.com/maps/place/TU_PARKING_PREBODA',
    },
    description: 'Una noche para empezar a celebrar antes del gran día. Cena informal y copas con los más cercanos.',
  },

  // Quiz sobre los novios
  quiz: {
    questions: [
      {
        question: '¿Dónde se conocieron Pablo y Vega?',
        options: ['En una fiesta', 'En el trabajo', 'Por amigos en común', 'En la universidad'],
        correctIndex: 2,
      },
      {
        question: '¿Cuál fue su primera cita?',
        options: ['Cena en un restaurante', 'Paseo por la playa', 'Cine', 'Concierto'],
        correctIndex: 0,
      },
      {
        question: '¿Cuál es la película favorita de ambos?',
        options: ['Titanic', 'The Notebook', 'Up', 'La La Land'],
        correctIndex: 2,
      },
      {
        question: '¿Cuál es el destino de viaje favorito de la pareja?',
        options: ['París', 'Roma', 'Bali', 'Nueva York'],
        correctIndex: 1,
      },
      {
        question: '¿Qué comida les gusta compartir?',
        options: ['Pizza', 'Sushi', 'Tacos', 'Pasta'],
        correctIndex: 1,
      },
      {
        question: '¿Cuántos años llevan juntos?',
        options: ['3 años', '5 años', '7 años', '8 años'],
        correctIndex: 2,
      },
      {
        question: '¿Cuál es su canción?',
        options: ['Perfect - Ed Sheeran', 'Thinking Out Loud', 'All of Me', 'A Thousand Years'],
        correctIndex: 0,
      },
      {
        question: '¿Dónde fue la pedida de mano?',
        options: ['En casa', 'En un viaje', 'En un restaurante', 'Es sorpresa'],
        correctIndex: 1,
      },
      {
        question: '¿Qué mascota tienen?',
        options: ['Un perro', 'Un gato', 'Ninguna', 'Un conejo'],
        correctIndex: 0,
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
      year: '2018',
      title: 'Nos conocimos',
      description: 'Todo empezó en una noche de verano. Un encuentro casual que cambiaría nuestras vidas para siempre.',
    },
    {
      year: '2019',
      title: 'Primera cita',
      description: 'Después de meses hablando, por fin quedamos. Nervios, risas y la certeza de que algo especial estaba empezando.',
    },
    {
      year: '2020',
      title: 'Primer viaje juntos',
      description: 'Descubrimos que viajando juntos todo era mejor. Nuevos lugares, nuevas aventuras, nuevos recuerdos.',
    },
    {
      year: '2022',
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
