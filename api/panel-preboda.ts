import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sql = neon(process.env.DATABASE_URL!);

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS preboda (
        id serial PRIMARY KEY,
        nombre text NOT NULL,
        apellidos text NOT NULL,
        acompanantes text,
        created_at timestamptz DEFAULT now()
      )
    `;

    const result = await sql`SELECT * FROM preboda ORDER BY id DESC`;
    return res.status(200).json({ data: result });
  } catch (error) {
    console.error('Panel preboda API error:', error);
    return res.status(500).json({ error: 'Error al obtener asistentes de preboda' });
  }
}
