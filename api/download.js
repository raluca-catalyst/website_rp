// api/download.js — PDF delivery prin email, multi-resource
// Body: { resource?, name, email, company, role, website (honeypot) }
// resource lipsă => 'viitoruri' (backwards compatible)

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const SHEETS_WEBHOOK = 'https://script.google.com/macros/s/AKfycbxJjD_2faU9XQLxOOlWDzYUXLp4Vs0aa-895GJ5rXj9GnZ5U1rQsQMMfptEXLVVQG5_/exec';
const BOOKING_URL = 'https://calendar.app.google/97NFSpQYzKkJmkuL9';

// Schelet comun de email (header Upvance, CTA lavender, footer)
const emailShell = ({ title, bodyHtml, footerNote, signoff = 'Mulțumesc și lectură plăcută,' }) => `
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
      <h2>${title}</h2>
    </div>
    <div class="body">
      ${bodyHtml}
      <p>${signoff}</p>
      <p class="sig-name">Raluca Păduraru</p>
      <p class="sig-title">Futures of Work Strategist | Building AI Agency in Organizations</p>
    </div>
    <div class="footer">
      <p>${footerNote}<br>
      Întrebări? Scrie la <a href="mailto:contact@upvance.global" style="color:#9B8AF0">contact@upvance.global</a></p>
    </div>
  </div>
</body>
</html>
`;

const RESOURCES = {
  'viitoruri': {
    pdfUrl: 'https://ralucapaduraru.ro/downloads/viitoruri-2030.pdf',
    subject: 'Raportul tău: Patru viitoruri ale muncii în România 2030',
    notifySubject: (name, company) => `Nou download: ${name} (${company || 'N/A'})`,
    emailHtml: function () {
      return emailShell({
        title: 'Raportul tău: Patru viitoruri ale muncii în România 2030',
        footerNote: 'Ai primit acest email deoarece ai completat formularul de pe ralucapaduraru.ro/viitoruri.',
        bodyHtml: `
      <p>Salutare,</p>
      <p>Mulțumesc că ai cerut raportul. Îl găsești aici:</p>
      <a class="cta" href="${this.pdfUrl}" target="_blank">Descarcă raportul &rarr;</a>
      <p>Sunt 62 de pagini. Dacă ai 5 minute, citește sumarul executiv. Dacă ai 15, adaugă și scenariul care te intrigă cel mai mult. Dacă ai o oră, citește-l integral. Fiecare nivel de lectură oferă ceva util.</p>
      <p>Dar, indiferent cât citești, am o invitație: dă-mi un reply cu o singură propoziție. <strong>Ce te-a surprins cel mai mult?</strong> Fiecare răspuns pe care îl primesc mă ajută să înțeleg ce e cu adevărat relevant pentru profesioniștii din România și să construiesc materiale și mai bune.</p>
      <p>P.S. Dacă vrei să explorezi implicațiile raportului cu echipa ta, pot organiza o sesiune de debrief de 30 de minute, fără obligații. Poți rezerva un slot aici: <a href="${BOOKING_URL}" style="color:#9B8AF0">${BOOKING_URL}</a></p>`,
      });
    },
  },
  'ai-business-translator': {
    pdfUrl: 'https://ralucapaduraru.ro/downloads/ai-business-translator-framework.pdf',
    subject: 'Framework-ul tău: AI Business Translator',
    notifySubject: (name, company) => `Nou download AI Business Translator: ${name} (${company || 'N/A'})`,
    emailHtml: function () {
      return emailShell({
        title: 'Framework-ul tău: AI Business Translator',
        footerNote: 'Ai primit acest email deoarece ai completat formularul de pe ralucapaduraru.ro/frameworks/ai-business-translator/.',
        bodyHtml: `
      <p>Salutare,</p>
      <p>Mulțumesc că ai cerut framework-ul. Îl găsești aici:</p>
      <a class="cta" href="${this.pdfUrl}" target="_blank">Descarcă framework-ul &rarr;</a>
      <p>Framework-ul definește concret rolul de AI Business Translator: cele trei seturi de abilități, cele cinci activități și cele cinci milestone-uri prin care se construiește competența în echipă.</p>
      <p>După ce îl parcurgi, am o invitație: dă-mi un reply cu o singură propoziție. <strong>Care dintre cele cinci activități e cel mai puțin acoperită în echipa ta acum?</strong> Răspunsurile mă ajută să construiesc materiale tot mai relevante pentru profesioniștii din România.</p>
      <p>P.S. Dacă vrei să construiești AI Business Translators în organizația ta, putem vorbi 30 de minute despre cum ar arăta un program adaptat la contextul vostru, fără obligații: <a href="${BOOKING_URL}" style="color:#9B8AF0">${BOOKING_URL}</a></p>`,
      });
    },
  },
  'build-your-cortex': {
    subject: 'Ești pe lista Build Your Cortex',
    notifySubject: (name, company) => `Nou waitlist Build Your Cortex: ${name} (${company || 'N/A'})`,
    emailHtml: function () {
      return emailShell({
        title: 'Ești pe lista de early-access Build Your Cortex',
        signoff: 'Ne vedem curând,',
        footerNote: 'Ai primit acest email deoarece te-ai înscris pe lista de early-access de pe ralucapaduraru.ro/build-your-cortex.',
        bodyHtml: `
      <p>Salutare,</p>
      <p>Te-ai înscris pe lista de early-access pentru <strong>Build Your Cortex</strong>, ediția unică din 6 august, de la Palatul Universul (București), parte din lansarea ecosistemului KA-BOM.</p>
      <p>Ce înseamnă asta: ești printre primii anunțați când deschid înscrierile și ai prioritate la cele 16 locuri, la prețul de lansare.</p>
      <p>Pleci de la workshop cu un sistem AI personal care te cunoaște, lucrează pentru tine și produce, plus o echipă de specialiști gata de pus la treabă. Îți scriu în curând cu detaliile de înscriere.</p>
      <p>Până atunci, dacă vrei să vezi cum gândesc despre AI ca sistem personal, mă găsești pe LinkedIn:</p>
      <a class="cta" href="https://www.linkedin.com/in/paduraru-raluca/" target="_blank">LinkedIn &rarr;</a>`,
      });
    },
  },
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://ralucapaduraru.ro');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { resource, name, email, company, role, website } = req.body || {};

  // Honeypot: boții completează câmpul ascuns => răspuns 200 fals, fără acțiune
  if (website) return res.status(200).json({ message: 'OK' });

  const slug = resource || 'viitoruri';
  const cfg = RESOURCES[slug];
  if (!cfg) return res.status(400).json({ message: 'Resursă necunoscută.' });

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Email invalid.' });
  }
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ message: 'Numele este obligatoriu.' });
  }

  try {
    const { error } = await resend.emails.send({
      from: 'Raluca Păduraru <contact@upvance.global>',
      reply_to: 'contact@upvance.global',
      to: [email],
      subject: cfg.subject,
      html: cfg.emailHtml(),
    });

    if (error) {
      console.error('Email send error:', error);
      return res.status(500).json({ message: 'Nu am putut trimite emailul. Încearcă din nou.' });
    }

    // Log lead to Google Sheets (non-critical)
    fetch(SHEETS_WEBHOOK, {
      method: 'POST',
      body: JSON.stringify({ nume: name, prenume: '', email, rol: role, companie: company, sursa: slug }),
    }).catch(() => {}); // non-critical, ignore errors

    // Also notify Raluca of new lead
    await resend.emails.send({
      from: 'Site ralucapaduraru.ro <contact@upvance.global>',
      to: ['raluca@upvance.global'],
      subject: cfg.notifySubject(name, company),
      html: `<p><b>Nume:</b> ${name}<br><b>Email:</b> ${email}<br><b>Companie:</b> ${company || '-'}<br><b>Rol:</b> ${role || '-'}<br><b>Sursă:</b> ${slug}</p>`,
    }).catch(() => {}); // non-critical, ignore errors

    return res.status(200).json({ message: 'Trimis pe email!' });

  } catch (err) {
    console.error('Download error:', err);
    return res.status(500).json({ message: 'Eroare internă. Încearcă din nou.' });
  }
};
