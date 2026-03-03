// ⚠️ Sustituye este ID por el de tu Google Spreadsheet
// Lo encuentras en la URL: docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit
const SPREADSHEET_ID = 'TU_SPREADSHEET_ID_AQUI';

function getSheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function doPost(e) {
  try {
    const ss = getSheet();
    const data = JSON.parse(e.postData.contents);

    if (data.tipo === 'sugerencia_musica') {
      let sheetMusica = ss.getSheetByName('Musica');
      if (!sheetMusica) {
        sheetMusica = ss.insertSheet('Musica');
        sheetMusica.appendRow(['Fecha', 'Canción', 'Artista', 'Sugerido por']);
        sheetMusica.getRange(1, 1, 1, 4).setFontWeight('bold');
      }
      sheetMusica.appendRow([
        new Date(),
        data.cancion || '',
        data.artista || '',
        data.nombre || 'Anónimo'
      ]);

    } else if (data.tipo === 'preboda') {
      let sheetPreboda = ss.getSheetByName('Preboda');
      if (!sheetPreboda) {
        sheetPreboda = ss.insertSheet('Preboda');
        sheetPreboda.appendRow(['Fecha', 'Nombre', 'Asistirá', 'Acompañantes']);
        sheetPreboda.getRange(1, 1, 1, 4).setFontWeight('bold');
      }
      sheetPreboda.appendRow([
        new Date(),
        data.nombre || '',
        data.asistira || '',
        data.acompanantes || ''
      ]);

    } else {
      // Asistencia boda
      let sheet = ss.getSheetByName('Asistencia');
      if (!sheet) {
        sheet = ss.insertSheet('Asistencia');
        sheet.appendRow(['Fecha', 'Nombre', 'Apellidos', 'Acompañantes', 'Teléfono', 'Email', 'Bus', 'Parada', 'Talla', 'Preferencias']);
        sheet.getRange(1, 1, 1, 10).setFontWeight('bold');
      }
      sheet.appendRow([
        new Date(),
        data.nombre,
        data.apellidos,
        data.acompanantes,
        data.telefono,
        data.email,
        data.bus,
        data.parada,
        data.talla,
        data.preferencias
      ]);
      enviarEmailConfirmacion(data);
    }

    return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function enviarEmailConfirmacion(data) {
  const ACCENT = '#6f2439';

  const cuerpoHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f5f0ee;font-family:Georgia,serif;">
      <div style="background-color:#f5f0ee;padding:40px 16px;">
        <div style="background:#ffffff;max-width:560px;margin:0 auto;border-radius:4px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

          <!-- Header -->
          <div style="background:${ACCENT};padding:40px 32px;text-align:center;">
            <p style="margin:0 0 6px 0;font-family:Georgia,serif;font-size:13px;font-weight:normal;color:rgba(255,255,255,0.7);letter-spacing:0.25em;text-transform:uppercase;">
              22 · 08 · 2026
            </p>
            <h1 style="margin:0;font-family:Georgia,serif;font-size:38px;font-weight:normal;color:#ffffff;letter-spacing:3px;">
              Pablo &amp; Vega
            </h1>
            <p style="margin:14px 0 0 0;font-family:Georgia,serif;font-size:15px;font-weight:normal;color:rgba(255,255,255,0.85);letter-spacing:0.05em;">
              Rectoral de Cobres · Pontevedra
            </p>
          </div>

          <!-- Saludo -->
          <div style="padding:36px 32px 24px 32px;text-align:center;border-bottom:1px solid #ede8e5;">
            <h2 style="margin:0 0 14px 0;font-family:Georgia,serif;font-size:24px;font-weight:normal;color:${ACCENT};">
              ¡Hola, ${data.nombre}!
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
                  <span style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333333;">${data.nombre} ${data.apellidos}</span>
                </td>
              </tr>

              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #ede8e5;vertical-align:top;">
                  <span style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;color:${ACCENT};letter-spacing:0.1em;text-transform:uppercase;">Acompañantes</span>
                </td>
                <td style="padding:10px 0;border-bottom:1px solid #ede8e5;text-align:right;vertical-align:top;">
                  <span style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333333;">${data.acompanantes || 'Ninguno'}</span>
                </td>
              </tr>

              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #ede8e5;vertical-align:top;">
                  <span style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;color:${ACCENT};letter-spacing:0.1em;text-transform:uppercase;">Autobús</span>
                </td>
                <td style="padding:10px 0;border-bottom:1px solid #ede8e5;text-align:right;vertical-align:top;">
                  <span style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333333;">${data.bus === 'sí' ? 'Sí, desde ' + data.parada : 'No necesito'}</span>
                </td>
              </tr>

              <tr>
                <td style="padding:10px 0;vertical-align:top;">
                  <span style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;color:${ACCENT};letter-spacing:0.1em;text-transform:uppercase;">Preferencias</span>
                </td>
                <td style="padding:10px 0;text-align:right;vertical-align:top;">
                  <span style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333333;">${data.preferencias || 'Sin preferencias'}</span>
                </td>
              </tr>

            </table>
          </div>

          <!-- Footer -->
          <div style="background:${ACCENT};padding:24px 32px;text-align:center;">
            <p style="margin:0;font-family:Georgia,serif;font-size:13px;font-weight:normal;color:rgba(255,255,255,0.7);letter-spacing:0.2em;text-transform:uppercase;">
              ¡Que empiece la fiesta... y que nunca se acabe!
            </p>
          </div>

        </div>
      </div>
    </body>
    </html>
  `;

  try {
    MailApp.sendEmail({
      to: data.email,
      subject: '¡Confirmación recibida! · Boda Pablo & Vega · 22 agosto 2026',
      htmlBody: cuerpoHtml
    });
    Logger.log('Email enviado correctamente a: ' + data.email);
  } catch (emailError) {
    Logger.log('ERROR al enviar email: ' + emailError.toString());
    throw emailError;
  }
}

// ── Utilidades ──────────────────────────────────────────────

function autorizarPermisos() {
  const ss = getSheet();
  Logger.log('Spreadsheet: ' + ss.getName());
  MailApp.getRemainingDailyQuota();
  Logger.log('Permisos de email OK');
}

function testEmail() {
  enviarEmailConfirmacion({
    nombre: 'Test',
    apellidos: 'Usuario',
    email: 'TU_EMAIL@gmail.com',
    acompanantes: 'María García',
    bus: 'sí',
    parada: 'Vigo',
    preferencias: 'Vegetariano'
  });
  Logger.log('Email de prueba enviado');
}

function testMusica() {
  const ss = getSheet();
  let sheet = ss.getSheetByName('Musica');
  if (!sheet) {
    sheet = ss.insertSheet('Musica');
    sheet.appendRow(['Fecha', 'Canción', 'Artista', 'Sugerido por']);
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
  }
  sheet.appendRow([new Date(), 'Despacito', 'Luis Fonsi', 'Test']);
  Logger.log('Sugerencia de música añadida');
}

function testPreboda() {
  const ss = getSheet();
  let sheet = ss.getSheetByName('Preboda');
  if (!sheet) {
    sheet = ss.insertSheet('Preboda');
    sheet.appendRow(['Fecha', 'Nombre', 'Asistirá', 'Acompañantes']);
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
  }
  sheet.appendRow([new Date(), 'Test Usuario', 'sí', 'María']);
  Logger.log('Preboda añadida');
}
