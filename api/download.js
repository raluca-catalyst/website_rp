// api/download.js — Post-launch PDF delivery
// Called when user submits download form after launch date

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const PDF_URL = 'https://ralucapaduraru.ro/downloads/viitoruri-2030.pdf';

const DELIVERY_EMAIL_HTML = () => `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
    .wrap { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; }
    .header { background: #ffffff; padding: 32px 40px 24px; border-bottom: 1px solid #eee; }
    .header h1 { color: #9B8AF0; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; margin: 0 0 10px; }
    .header h2 { color: #111111; font-size: 22px; font-weight: 700; margin: 0; line-height: 1.3; }
    .body { padding: 36px 40px; }
    .body p { font-size: 15px; color: #444; line-height: 1.7; margin: 0 0 16px; }
    .cta { display: inline-block; background: #9B8AF0; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 16px; margin: 12px 0 24px; }
    .footer { background: #f9f9f9; padding: 24px 40px; border-top: 1px solid #eee; }
    .footer p { font-size: 12px; color: #888; line-height: 1.6; margin: 0; }
    .sig-name { font-size: 14px; color: #333; font-weight: 600; margin-top: 24px; margin-bottom: 2px; }
    .sig-title { font-size: 13px; color: #666; margin: 0; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>Upvance Global</h1>
      <h2>Raportul tău: Patru viitoruri ale muncii în România 2030</h2>
    </div>
    <div class="body">
      <p>Salutare,</p>
      <p>Mulțumesc că ai cerut raportul. Îl găsești aici:</p>
      <a class="cta" href="${PDF_URL}" target="_blank">Descarcă raportul &rarr;</a>
      <p>Sunt 62 de pagini. Dacă ai 5 minute, citește sumarul executiv. Dacă ai 15, adaugă și scenariul care te intrigă cel mai mult. Dacă ai o oră, citește-l integral. Fiecare nivel de lectură oferă ceva util.</p>
      <p>Dar, indiferent cât citești, am o invitație: dă-mi un reply cu o singură propoziție. <strong>Ce te-a surprins cel mai mult?</strong> Fiecare răspuns pe care îl primesc mă ajută să înțeleg ce e cu adevărat relevant pentru profesioniștii din România și să construiesc materiale și mai bune.</p>
      <p>P.S. Dacă vrei să explorezi implicațiile raportului cu echipa ta, pot organiza o sesiune de debrief de 30 de minute, fără obligații. Poți rezerva un slot aici: <a href="https://calendar.app.google/97NFSpQYzKkJmkuL9" style="color:#9B8AF0">https://calendar.app.google/97NFSpQYzKkJmkuL9</a></p>
      <p>Mulțumesc și lectură plăcută,</p>
      <p class="sig-name">Raluca Păduraru</p>
      <p class="sig-title">Futures of Work Strategist | Building AI Agency in Organizations</p>
    </div>
    <div class="footer">
      <p>Ai primit acest email deoarece ai completat formularul de pe ralucapaduraru.ro/viitoruri.<br>
      Întrebări? Scrie la <a href="mailto:contact@upvance.global" style="color:#9B8AF0">contact@upvance.global</a></p>
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
      from: 'Raluca P\u0103duraru <contact@upvance.global>',
      reply_to: 'contact@upvance.global',
      to: [email],
      subject: 'Raportul t\u0103u: Patru viitoruri ale muncii \u00een Rom\u00e2nia 2030',
      html: DELIVERY_EMAIL_HTML(),
    });

    if (error) {
      console.error('Email send error:', error);
      return res.status(500).json({ message: 'Nu am putut trimite emailul. Încearcă din nou.' });
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
    return res.status(500).json({ message: 'Eroare internă. Încearcă din nou.' });
  }
};
