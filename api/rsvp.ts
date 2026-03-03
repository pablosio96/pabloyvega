import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  console.log('API Key configurada:', process.env.RESEND_API_KEY ? 'SÍ' : 'NO');

  const sql = neon(process.env.DATABASE_URL!);

  const {
    nombre,
    apellidos,
    acompanantes,
    telefono,
    email,
    bus,
    parada,
    talla,
    preferencias,
  } = req.body;

  if (!nombre || !apellidos || !telefono || !email) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    await sql`
      INSERT INTO asistencia (
        nombre, apellidos, acompanantes, telefono, email, bus, parada, talla, preferencias
      ) VALUES (
        ${nombre}, ${apellidos}, ${acompanantes}, ${telefono}, ${email}, ${bus}, ${parada}, ${talla}, ${preferencias}
      )
    `;

    // Enviar emails de notificación si existe la API KEY
    if (process.env.RESEND_API_KEY) {
      try {
        // 1. Notificación para vosotros
        await resend.emails.send({
          from: 'Boda Pablo y Vega <onboarding@resend.dev>',
          to: ['bodapabloyvega@gmail.com'], // Vuestro email
          subject: `🔔 Nueva confirmación de asistencia: ${nombre} ${apellidos}`,
          html: `
            <h2>Nueva confirmación de asistencia</h2>
            <p><strong>Nombre:</strong> ${nombre} ${apellidos}</p>
            <p><strong>Acompañantes:</strong> ${acompanantes || 'Ninguno'}</p>
            <p><strong>Teléfono:</strong> ${telefono}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Autobús:</strong> ${bus === 'sí' ? 'Sí' : 'No'} (${parada || 'N/A'})</p>
            <p><strong>Talla zapatos:</strong> ${talla || 'N/A'}</p>
            <p><strong>Preferencias:</strong> ${preferencias || 'Sin preferencias'}</p>
          `,
        });

        // 2. Confirmación para el invitado
        // NOTA: Resend en modo gratuito solo permite enviar a tu email verificado.
        // Si ya tienes un dominio configurado, esto funcionará para todos.
        await resend.emails.send({
          from: 'Pablo y Vega <onboarding@resend.dev>',
          to: [email],
          subject: '¡Confirmación recibida! Boda Pablo y Vega',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2c3e50;">¡Hola ${nombre}!</h2>
              <p>Hemos recibido correctamente tu confirmación de asistencia para nuestra boda.</p>
              <p>Estamos muy ilusionados de que nos acompañes el próximo <strong>22 de agosto de 2026</strong> en la <strong>Rectoral de Cobres</strong>.</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 0.9em; color: #666;">
                Si necesitas cambiar cualquier dato de tu confirmación, por favor ponte en contacto con nosotros.
              </p>
              <p style="margin-top: 30px;">¡Un abrazo!</p>
              <p><strong>Pablo y Vega</strong></p>
            </div>
          `,
        });
        console.log('Emails enviados correctamente');
      } catch (emailError) {
        console.error('Error al enviar emails:', emailError);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Error al guardar en la base de datos' });
  }
}
