import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sql = neon(process.env.DATABASE_URL!);

  const { nombre, cancion, artista } = req.body;
  if (!cancion) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    await sql`
      INSERT INTO musica (nombre, cancion, artista)
      VALUES (${nombre}, ${cancion}, ${artista})
    `;
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Error al guardar en la base de datos' });
  }
}
