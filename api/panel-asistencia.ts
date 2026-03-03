import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const result = await sql`SELECT * FROM asistencia ORDER BY id DESC`;
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener asistentes' });
  }
}
