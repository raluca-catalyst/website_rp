// api/download.js — Post-launch PDF delivery
// Called when user submits download form after launch date

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const PDF_URL = 'https://ralucapaduraru.ro/downloads/viitoruri-2030.pdf';

const DELIVERY_EMAIL_HTML = (name) => `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
    .wrap { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; }
    .header { background: #0A0A0F; padding: 32px 40px; }
    .header h1 { color: #9B8AF0; font-size: 13px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; margin: 0 0 8px; }
    .header h2 { color: #ffffff; font-size: 22px; font-weight: 700; margin: 0; line-height: 1.3; }
    .body { padding: 36px 40px; }
    .body p { font-size: 15px; color: #444; line-height: 1.7; margin: 0 0 16px; }
    .cta { display: inline-block; background: #9B8AF0; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 16px; margin: 12px 0 24px; }
    .reading-tip { background: #f9f7ff; border-left: 3px solid #9B8AF0; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 20px 0; }
    .reading-tip p { margin: 0; font-size: 14px; color: #555; }
    .footer { background: #f9f9f9; padding: 24px 40px; border-top: 1px solid #eee; }
    .footer p { font-size: 12px; color: #888; line-height: 1.6; margin: 0; }
    .sig { font-size: 14px; color: #333; font-weight: 600; margin-top: 24px; }
    .sig span { display: block; font-weight: 400; color: #666; font-size: 13px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>Upvance Global</h1>
      <h2>Raportul tau: Patru viitoruri ale muncii in Romania 2030</h2>
    </div>
    <div class="body">
      <p>Salut${name ? `, ${name.split(' ')[0]}` : ''},</p>
      <p>Multumesc ca ai cerut raportul. Il gasesti aici:</p>
      <a class="cta" href="${PDF_URL}" target="_blank">Descarca raportul &rarr;</a>
      <div class="reading-tip">
        <p><strong>Cum sa il citesti:</strong> Sunt 62 de pagini. Daca ai 5 minute, citeste sumarul executiv. Daca ai 15, adauga si scenariul care te intriga cel mai mult. Daca ai o ora, citeste-l integral. Fiecare nivel de lectura ofera ceva util.</p>
      </div>
      <p>Dar, indiferent cat citesti, am o invitatie: da-mi un reply cu o singura propozitie. <strong>Ce te-a surprins cel mai mult?</strong></p>
      <p>Fiecare raspuns pe care il primesc ma ajuta sa inteleg ce e cu adevarat relevant pentru profesionistii din Romania si sa construiesc materiale si mai bune.</p>
      <p>P.S. Daca vrei sa explorezi implicatiile raportului cu echipa ta, pot organiza o sesiune de debrief de 30 de minute, fara obligatii. Poti rezerva un slot aici: <a href="https://calendar.app.google/97NFSpQYzKkJmkuL9" style="color:#9B8AF0">calendar.app.google</a></p>
      <p>Multumesc si lectura placuta,</p>
      <p class="sig">
        Raluca Paduraru
        <span>Futures of Work Strategist | Building AI Agency in Organizations</span>
      </p>
    </div>
    <div class="footer">
      <p>Link de descarcare: <a href="${PDF_URL}" style="color:#9B8AF0">${PDF_URL}</a><br>
      Ai primit acest email deoarece ai completat formularul de pe ralucapaduraru.ro/viitoruri.<br>
      Intrebari? Scrie la <a href="mailto:contact@upvance.global" style="color:#9B8AF0">contact@upvance.global</a></p>
    </div>
  </div>
</body>
</html>
`;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://ralucapaduraru.ro');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { name, email, company, role } = req.body || {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Email invalid.' });
  }
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ message: 'Numele este obligatoriu.' });
  }

  try {
    const { error } = await resend.emails.send({
      from: 'Raluca Paduraru <contact@upvance.global>',
      reply_to: 'contact@upvance.global',
      to: [email],
      subject: 'Raportul tau: Patru viitoruri ale muncii in Romania 2030',
      html: DELIVERY_EMAIL_HTML(name),
    });

    if (error) {
      console.error('Email send error:', error);
      return res.status(500).json({ message: 'Nu am putut trimite emailul. Incearca din nou.' });
    }

    // Also notify Raluca of new lead
    await resend.emails.send({
      from: 'Viitoruri Site <contact@upvance.global>',
      to: ['raluca@upvance.global'],
      subject: `Nou download: ${name} (${company || 'N/A'})`,
      html: `<p><b>Nume:</b> ${name}<br><b>Email:</b> ${email}<br><b>Companie:</b> ${company || '-'}<br><b>Rol:</b> ${role || '-'}</p>`,
    }).catch(() => {}); // non-critical, ignore errors

    return res.status(200).json({ message: 'Raportul a fost trimis pe email!' });

  } catch (err) {
    console.error('Download error:', err);
    return res.status(500).json({ message: 'Eroare interna. Incearca din nou.' });
  }
};
