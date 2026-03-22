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
      const ACCENT = '#4A6FA5'; // Color azul principal de la web

      try {
        // 1. Notificación para vosotros
        await resend.emails.send({
          from: 'Boda Pablo y Vega <hola@pabloyvega.com>',
          to: ['bodapabloyvega@gmail.com'],
          subject: `🔔 Nueva confirmación de asistencia: ${nombre} ${apellidos}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin:0;padding:0;background-color:#ffffff;font-family:Georgia,serif;">
              <div style="background-color:#ffffff;padding:40px 16px;">
                <div style="background:#ffffff;max-width:520px;margin:0 auto;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.10);">
                  <div style="background:${ACCENT};padding:28px 24px;text-align:center;">
                    <h2 style="margin:0 0 8px 0;font-family:Georgia,serif;font-size:26px;font-weight:normal;color:#ffffff;letter-spacing:1px;">Nueva confirmación de asistencia</h2>
                    <p style="margin:0;font-size:15px;color:#ffffff;">22 · 08 · 2026 · Rectoral de Cobres</p>
                  </div>
                  <div style="padding:28px 24px 18px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#333;">
                      <tr>
                        <td style="padding:8px 0;font-weight:bold;color:${ACCENT};">Nombre</td>
                        <td style="padding:8px 0;text-align:right;">${nombre} ${apellidos}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;font-weight:bold;color:${ACCENT};">Acompañantes</td>
                        <td style="padding:8px 0;text-align:right;">${acompanantes || 'Ninguno'}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;font-weight:bold;color:${ACCENT};">Teléfono</td>
                        <td style="padding:8px 0;text-align:right;">${telefono}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;font-weight:bold;color:${ACCENT};">Email</td>
                        <td style="padding:8px 0;text-align:right;">${email}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;font-weight:bold;color:${ACCENT};">Autobús</td>
                        <td style="padding:8px 0;text-align:right;">${bus === 'sí' ? 'Sí, desde ' + parada : 'No necesita'}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;font-weight:bold;color:${ACCENT};">Talla zapatos</td>
                        <td style="padding:8px 0;text-align:right;">${talla || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;font-weight:bold;color:${ACCENT};">Preferencias</td>
                        <td style="padding:8px 0;text-align:right;">${preferencias || 'Sin preferencias'}</td>
                      </tr>
                    </table>
                  </div>
                  <div style="background:${ACCENT};padding:18px 24px;text-align:center;">
                    <p style="margin:0;font-size:13px;color:#ffffff;letter-spacing:0.1em;">¡Revisa el panel de administración para más detalles!</p>
                  </div>
                </div>
              </div>
            </body>
            </html>
          `,
        });

        // 2. Confirmación elegante para el invitado
        await resend.emails.send({
          from: 'Pablo y Vega <hola@pabloyvega.com>',
          to: [email],
          subject: '¡Confirmación recibida!',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <link href="https://fonts.googleapis.com/css2?family=Meow+Script&display=swap" rel="stylesheet">
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin:0;padding:0;background-color:#ffffff;font-family:Georgia,serif;">
              <div style="background-color:#ffffff;padding:40px 16px;">
                <div style="background:#ffffff;max-width:560px;margin:0 auto;border-radius:4px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

                  <!-- Header -->
                  <div style="background:${ACCENT};padding:40px 32px;text-align:center;">
                    <p style="margin:0 0 6px 0;font-family:Georgia,serif;font-size:13px;font-weight:normal;color:#ffffff;letter-spacing:0.25em;text-transform:uppercase;">
                      22 · 08 · 2026
                    </p>
                    <h1 style="margin:0;font-family:'Meow Script',cursive;font-size:38px;font-weight:normal;color:#ffffff;letter-spacing:3px;">
                      Pablo y Vega
                    </h1>
                    <p style="margin:14px 0 0 0;font-family:Georgia,serif;font-size:15px;font-weight:normal;color:#ffffff;letter-spacing:0.05em;">
                      Rectoral de Cobres · Pontevedra
                    </p>
                  </div>

                  <!-- Saludo -->
                  <div style="padding:36px 32px 24px 32px;text-align:center;border-bottom:1px solid #ede8e5;">
                    <h2 style="margin:0 0 14px 0;font-family:Georgia,serif;font-size:24px;font-weight:normal;color:${ACCENT};">
                      ¡Hola, ${nombre}!
                    </h2>
                    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#555555;">
                      Hemos recibido tu confirmación de asistencia.<br>
                      ¡Estamos muy felices de poder celebrarlo contigo!
                    </p>
                  </div>

                  <!-- Detalles -->
                  <div style="padding:28px 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">

                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #ede8e5;vertical-align:top;">
                          <span style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;color:${ACCENT};letter-spacing:0.1em;text-transform:uppercase;">Nombre</span>
                        </td>
                        <td style="padding:10px 0;border-bottom:1px solid #ede8e5;text-align:right;vertical-align:top;">
                          <span style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333333;">${nombre} ${apellidos}</span>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #ede8e5;vertical-align:top;">
                          <span style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;color:${ACCENT};letter-spacing:0.1em;text-transform:uppercase;">Acompañantes</span>
                        </td>
                        <td style="padding:10px 0;border-bottom:1px solid #ede8e5;text-align:right;vertical-align:top;">
                          <span style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333333;">${acompanantes || 'Ninguno'}</span>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #ede8e5;vertical-align:top;">
                          <span style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;color:${ACCENT};letter-spacing:0.1em;text-transform:uppercase;">Autobús</span>
                        </td>
                        <td style="padding:10px 0;border-bottom:1px solid #ede8e5;text-align:right;vertical-align:top;">
                          <span style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333333;">${bus === 'sí' ? 'Sí, desde ' + parada : 'No necesito'}</span>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:10px 0;vertical-align:top;">
                          <span style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;color:${ACCENT};letter-spacing:0.1em;text-transform:uppercase;">Preferencias</span>
                        </td>
                        <td style="padding:10px 0;text-align:right;vertical-align:top;">
                          <span style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333333;">${preferencias || 'Sin preferencias'}</span>
                        </td>
                      </tr>

                    </table>
                  </div>

                  <!-- Footer -->
                  <div style="background:${ACCENT};padding:24px 32px;text-align:center;">
                    <p style="margin:0;font-family:Georgia,serif;font-size:13px;font-weight:normal;color:#ffffff;letter-spacing:0.2em;text-transform:uppercase;">
                      ¡Empieza la cuenta atrás!
                    </p>
                    <img src="https://pabloyvega.com/images/wedding/00_coche.png" alt="Coche" style="width:120px;max-width:100%;margin:24px auto 0 auto;display:block;" />
                  </div>

                </div>
              </div>
            </body>
            </html>

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
