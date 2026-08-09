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
    .cta { display: inline-block; background: #9B8AF0; color: #111111; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 16px; margin: 12px 0 24px; }
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
      <a class="cta" style="color:#111111" href="${this.pdfUrl}" target="_blank">Descarcă raportul &rarr;</a>
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
      <a class="cta" style="color:#111111" href="${this.pdfUrl}" target="_blank">Descarcă framework-ul &rarr;</a>
      <p>Framework-ul definește concret rolul de AI Business Translator: cele trei seturi de abilități, cele cinci activități și cele cinci milestone-uri prin care se construiește competența în echipă.</p>
      <p>După ce îl parcurgi, am o invitație: dă-mi un reply cu o singură propoziție. <strong>Care dintre cele cinci activități e cel mai puțin acoperită în echipa ta acum?</strong> Răspunsurile mă ajută să construiesc materiale tot mai relevante pentru profesioniștii din România.</p>
      <p>P.S. Dacă vrei să construiești AI Business Translators în organizația ta, putem vorbi 30 de minute despre cum ar arăta un program adaptat la contextul vostru, fără obligații: <a href="${BOOKING_URL}" style="color:#9B8AF0">${BOOKING_URL}</a></p>`,
      });
    },
  },
  'romanian-state-of-ai-sumar': {
    pdfUrl: 'https://ralucapaduraru.ro/downloads/romanian-state-of-ai-sumar-executiv.pdf',
    subject: 'Sumarul tău executiv: Romanian State of AI 2026',
    notifySubject: (name, company) => `Nou download Sumar RSAI 2026: ${name} (${company || 'N/A'})`,
    emailHtml: function () {
      return emailShell({
        title: 'Sumarul tău executiv: Romanian State of AI 2026',
        footerNote: 'Ai primit acest email deoarece ai completat formularul de pe ralucapaduraru.ro/romanian-state-of-ai/.',
        bodyHtml: `
      <p>Salutare,</p>
      <p>Mulțumesc că ai cerut sumarul executiv al studiului Romanian State of AI 2026. Îl găsești aici:</p>
      <a class="cta" style="color:#111111" href="${this.pdfUrl}" target="_blank">Descarcă sumarul &rarr;</a>
      <p>Sunt 2 pagini, construite pe cele două componente ale agency-ului: prima e partea de discernământ (cifrele-cheie și cele 4 constatări), a doua e partea de acțiune (3 intervenții cu efect maxim, fiecare cu primul pas în 30 de zile, plus un checklist de pornire).</p>
      <p>După ce îl parcurgi, am o invitație: dă-mi un reply cu o singură propoziție. <strong>Care dintre cele 3 intervenții e cea mai departe de realitatea organizației tale acum?</strong> Răspunsurile mă ajută să construiesc materiale tot mai relevante pentru profesioniștii din România.</p>
      <p>P.S. Dacă vrei să discutăm ce ar însemna aceste intervenții pentru echipa ta, putem vorbi 30 de minute, fără obligații: <a href="${BOOKING_URL}" style="color:#9B8AF0">${BOOKING_URL}</a></p>`,
      });
    },
  },
  '30-cifre-ai-munca': {
    pageUrl: 'https://ralucapaduraru.ro/resources/30-cifre-ai-munca/?acces=email',
    subject: 'Accesul tău: 30 de date verificate despre AI și muncă',
    notifySubject: (name, company) => `Nou unlock 30 cifre AI: ${name} (${company || 'N/A'})`,
    emailHtml: function () {
      return emailShell({
        title: 'Accesul tău: 30 de date verificate despre AI și muncă',
        footerNote: 'Ai primit acest email deoarece ai completat formularul de pe ralucapaduraru.ro/resources/30-cifre-ai-munca/.',
        bodyHtml: `
      <p>Salutare,</p>
      <p>Mulțumesc că ai cerut lista completă. Pagina s-a deblocat deja în browserul în care ai completat formularul, iar dacă vrei să revii de pe alt dispozitiv, folosește linkul de mai jos:</p>
      <a class="cta" style="color:#111111" href="${this.pageUrl}" target="_blank">Deschide lista completă &rarr;</a>
      <p>Sunt 30 de date verificate despre inteligența artificială și muncă, fiecare cu sursa originală și cu capcana, adică felul în care cifra e citată greșit de obicei. La final găsești și secțiunea în care demontăm cifrele care circulă cel mai des prin prezentări și ședințe.</p>
      <p>După ce le parcurgi, am o invitație: dă-mi un reply cu o singură propoziție. <strong>Care dintre cele 30 de date contrazice cel mai tare ceva ce s-a spus recent într-o ședință la tine?</strong> Răspunsurile mă ajută să construiesc materiale tot mai relevante pentru profesioniștii din România.</p>
      <p>P.S. Dacă vrei ca echipa ta să antreneze exact acest tip de discernământ, putem vorbi 30 de minute despre cum ar arăta un workshop adaptat la contextul vostru, fără obligații: <a href="${BOOKING_URL}" style="color:#9B8AF0">${BOOKING_URL}</a></p>`,
      });
    },
  },
  'build-your-cortex-oct': {
    subject: 'Ești pe lista de așteptare pentru Build Your Cortex, 16 octombrie',
    notifySubject: (name) => `Nouă înscriere pe lista de așteptare Build Your Cortex (16 oct): ${name}`,
    emailHtml: function (data) {
      const salut = data && data.prenume ? `Salutare, ${data.prenume},` : 'Salutare,';
      return emailShell({
        title: 'Build Your Cortex, 16 octombrie 2026',
        signoff: 'Pe curând,',
        footerNote: 'Ai primit acest email deoarece te-ai înscris prin formularul de pe ralucapaduraru.ro/build-your-cortex.',
        bodyHtml: `
      <p>${salut}</p>
      <p>Felicitări pentru că te-ai înscris pe lista de așteptare pentru <strong>Build Your Cortex</strong>! Uite tot ce trebuie să știi.</p>
      <p><strong>Când:</strong> 16 octombrie 2026, de la 9:30 la 18:30.<br>
      <strong>Unde:</strong> București. Îți confirm locația exactă în curând.</p>
      <p>Pentru că te-ai înscris pe lista de așteptare, la deschiderea înscrierilor beneficiezi de prețul special de <strong>1.197 lei</strong> (față de 1.710 lei, prețul standard).</p>
      <p>Când deschid înscrierile, revin către tine cu detaliile de plată. Cele 12 locuri disponibile se vor ocupa în ordinea efectuării plăților.</p>
      <p>Ulterior, lucrăm împreună pentru ca tu să poți deveni CEO-ul propriului sistem de lucru cu AI.</p>
      <p>Dacă ai întrebări până atunci, dă-mi un reply la acest email.</p>`,
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

  const { resource, name, email, company, role, website, prenume, nume, telefon } = req.body || {};

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
      html: cfg.emailHtml({ name, prenume, nume, email, telefon }),
    });

    if (error) {
      console.error('Email send error:', error);
      return res.status(500).json({ message: 'Nu am putut trimite emailul. Încearcă din nou.' });
    }

    // Log lead to Google Sheets (non-critical)
    fetch(SHEETS_WEBHOOK, {
      method: 'POST',
      body: JSON.stringify({ nume: nume || name, prenume: prenume || '', email, telefon: telefon || '', rol: role, companie: company, sursa: slug }),
    }).catch(() => {}); // non-critical, ignore errors

    // Also notify Raluca of new lead
    await resend.emails.send({
      from: 'Site ralucapaduraru.ro <contact@upvance.global>',
      to: ['raluca@upvance.global'],
      subject: cfg.notifySubject(name, company),
      html: `<p><b>Nume:</b> ${name}<br><b>Email:</b> ${email}<br><b>Telefon:</b> ${telefon || '-'}<br><b>Companie:</b> ${company || '-'}<br><b>Rol:</b> ${role || '-'}<br><b>Sursă:</b> ${slug}</p>`,
    }).catch(() => {}); // non-critical, ignore errors

    return res.status(200).json({ message: 'Trimis pe email!' });

  } catch (err) {
    console.error('Download error:', err);
    return res.status(500).json({ message: 'Eroare internă. Încearcă din nou.' });
  }
};
