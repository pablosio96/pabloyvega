import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';

function normalize(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nombre, apellidos, llevaAcompanante } = req.body ?? {};

  if (!nombre || !apellidos) {
    return res.status(400).json({ error: 'Nombre y apellidos son obligatorios' });
  }

  const sql = neon(process.env.DATABASE_URL!);
  const targetNombre = normalize(String(nombre));
  const targetApellidos = normalize(String(apellidos));

  try {
    const asistentes = await sql`SELECT * FROM asistencia`;
    const match = asistentes.find((row) =>
      normalize(String(row.nombre)) === targetNombre &&
      normalize(String(row.apellidos)) === targetApellidos,
    );

    if (!match) {
      return res.status(404).json({ error: 'No se ha encontrado una confirmación de boda con esos datos' });
    }

    const acompanantes = llevaAcompanante ? String(match.acompanantes || '') : '';
    const email = String(match.email || '');

    if (!email) {
      return res.status(500).json({ error: 'El correo del invitado no está disponible' });
    }

    await sql`
      CREATE TABLE IF NOT EXISTS preboda (
        id serial PRIMARY KEY,
        nombre text NOT NULL,
        apellidos text NOT NULL,
        acompanantes text,
        created_at timestamptz DEFAULT now()
      )
    `;

    await sql`
      INSERT INTO preboda (nombre, apellidos, acompanantes)
      VALUES (${match.nombre}, ${match.apellidos}, ${acompanantes})
    `;

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const ACCENT = '#4A6FA5';

      try {
        await resend.emails.send({
          from: 'Pablo y Vega <hola@pabloyvega.com>',
          to: ['bodapabloyvega@gmail.com'],
          subject: `🔔 Confirmación de preboda: ${match.nombre} ${match.apellidos}`,
          html: `
            <div style="font-family:Arial,Helvetica,sans-serif;color:#111;line-height:1.5;">
              <h2 style="color:${ACCENT};">Nueva confirmación de preboda</h2>
              <p><strong>Nombre:</strong> ${match.nombre} ${match.apellidos}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Acompañantes:</strong> ${acompanantes || 'No'}</p>
              <p>Revisa el panel para ver la lista de asistentes a la preboda.</p>
            </div>
          `,
        });

        await resend.emails.send({
          from: 'Pablo y Vega <hola@pabloyvega.com>',
          to: [email],
          subject: 'Confirmación de preboda recibida',
          html: `
            <div style="font-family:Arial,Helvetica,sans-serif;color:#111;line-height:1.5;">
              <h2 style="color:${ACCENT};">¡Gracias por confirmar tu asistencia!</h2>
              <p>Hemos registrado tu asistencia a la preboda.</p>
              <p><strong>Nombre:</strong> ${match.nombre} ${match.apellidos}</p>
              <p><strong>Acompañantes:</strong> ${acompanantes || 'No'}</p>
              <p>Nos vemos el día 21 de agosto.</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Error al enviar emails de preboda:', emailError);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Preboda API error:', error);
    return res.status(500).json({ error: 'Error al procesar la confirmación de preboda' });
  }
}
