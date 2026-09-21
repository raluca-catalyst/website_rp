// api/subscribe.js — Waiting list subscription
// Adds contact to Resend audience + sends confirmation email

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Liste de așteptare: fiecare cu propria audiență Resend și propriul email de confirmare.
// Body: { email, list? }  — list lipsă => 'viitoruri' (backwards compatible)
const LISTS = {
  'viitoruri': {
    audienceName: 'Viitoruri 2030',
    subject: 'Esti pe lista. Pe 3 aprilie primesti raportul.',
    html: (email) => CONFIRMATION_EMAIL_HTML(email),
  },
  'ghid-adoptie-ai': {
    audienceName: 'Ghid adoptie AI',
    subject: 'Ești pe listă. Pe 8 octombrie primești ghidul.',
    html: (email) => GHID_CONFIRMATION_EMAIL_HTML(email),
  },
};

// Cache audience IDs in-memory (persists while function is warm)
const audienceIds = {};

async function getOrCreateAudience(audienceName) {
  if (audienceIds[audienceName]) return audienceIds[audienceName];

  const { data, error } = await resend.audiences.list();
  if (error) throw new Error('Could not list audiences: ' + error.message);

  const existing = data?.data?.find(a => a.name === audienceName);
  if (existing) {
    audienceIds[audienceName] = existing.id;
    return existing.id;
  }

  const { data: created, error: createErr } = await resend.audiences.create({
    name: audienceName,
  });
  if (createErr) throw new Error('Could not create audience: ' + createErr.message);

  audienceIds[audienceName] = created.id;
  return created.id;
}

const GHID_CONFIRMATION_EMAIL_HTML = (email) => `
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
    .body ul { padding-left: 20px; margin: 0 0 20px; }
    .body ul li { font-size: 15px; color: #444; line-height: 1.7; margin-bottom: 6px; }
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
      <h2>Ești pe listă. Pe 8 octombrie primești ghidul.</h2>
    </div>
    <div class="body">
      <p>Bună,</p>
      <p>Ești pe lista celor care primesc ghidul „Ai primit mandatul să te ocupi de AI. De unde începi?” pe <strong>8 octombrie, la ora 8:45</strong>, direct pe email.</p>
      <p>Ce vei găsi în el:</p>
      <ul>
        <li>Traseul primelor 90 de zile: mandatul, echipa, regulile, primul pilot, măsurarea și raportul către conducere</li>
        <li>9 fișe de lucru, de la fișa de mandat la raportul de 90 de zile</li>
        <li>Un exemplu de onboarding pregătit cu AI, urmărit de la solicitare la planul final</li>
        <li>Ce trebuie clarificat cu fiecare stakeholder înainte de primul test, ancorat în legislația în vigoare</li>
      </ul>
      <p>Până atunci, dacă vrei să mă întrebi ceva despre adopția AI, dă un reply acestui mail.</p>
      <p class="sig-name">Raluca Păduraru</p>
      <p class="sig-title">Futures of Work Strategist</p>
    </div>
    <div class="footer">
      <p>Ai primit acest email deoarece te-ai înscris pe lista de așteptare pentru ghidul de adopție AI pe ralucapaduraru.ro/ghid-adoptie.<br>
      Pentru a te retrage de pe listă, trimite un email la <a href="mailto:contact@upvance.global" style="color:#9B8AF0">contact@upvance.global</a>.</p>
    </div>
  </div>
</body>
</html>
`;

const CONFIRMATION_EMAIL_HTML = (email) => `
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
    .body ul { padding-left: 20px; margin: 0 0 20px; }
    .body ul li { font-size: 15px; color: #444; line-height: 1.7; margin-bottom: 6px; }
    .cta { display: inline-block; background: #9B8AF0; color: #ffffff; text-decoration: none; padding: 13px 24px; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 8px 0 20px; }
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
      <h2>Esti pe lista. Pe 3 aprilie primesti raportul.</h2>
    </div>
    <div class="body">
      <p>Salutare,</p>
      <p>Ma bucur ca raportul despre viitorurile muncii in Romania este de interes pentru tine!</p>
      <p>Esti acum pe lista celor care vor primi raportul pe <strong>3 aprilie, la ora 13:00</strong>. Ce vei gasi in cele 62 de pagini:</p>
      <ul>
        <li>4 scenarii pentru viitorul muncii in Romania</li>
        <li>Date proaspete de la Eurostat, INS, WEF, ANIS, ABSL</li>
        <li>10 competente care te protejeaza in orice scenariu</li>
        <li>14 actiuni pe care le poti lua ca lider sau profesionist</li>
      </ul>
      <p>Pana pe 3 aprilie, daca vrei sa afli mai multe despre viitorurile muncii, ma gasesti pe LinkedIn:</p>
      <a class="cta" href="https://www.linkedin.com/in/paduraru-raluca/" target="_blank">LinkedIn &rarr;</a>
      <p>Ne auzim curand,</p>
      <p class="sig">
        Raluca Paduraru
        <span>Futures of Work Strategist | Building AI Agency in Organizations</span>
      </p>
    </div>
    <div class="footer">
      <p>Ai primit acest email deoarece te-ai inscris pe lista de asteptare pentru raportul "4 Viitoruri ale Muncii in Romania 2030" pe ralucapaduraru.ro.<br>
      Pentru a te retrage de pe lista, trimite un email la <a href="mailto:contact@upvance.global" style="color:#9B8AF0">contact@upvance.global</a>.</p>
    </div>
  </div>
</body>
</html>
`;

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://ralucapaduraru.ro');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { email, list } = req.body || {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Email invalid.' });
  }

  const cfg = LISTS[list || 'viitoruri'];
  if (!cfg) return res.status(400).json({ message: 'Listă necunoscută.' });

  try {
    // 1. Get or create Resend audience
    const aid = await getOrCreateAudience(cfg.audienceName);

    // 2. Add contact to audience
    const { error: contactErr } = await resend.contacts.create({
      email,
      audienceId: aid,
      unsubscribed: false,
    });

    // Ignore "already exists" gracefully — still send confirmation
    if (contactErr && !contactErr.message?.includes('already exists')) {
      console.error('Contact create error:', contactErr);
      return res.status(500).json({ message: 'Nu am putut inregistra emailul. Incearca din nou.' });
    }

    // 3. Send confirmation email
    const { error: emailErr } = await resend.emails.send({
      from: 'Raluca Paduraru <contact@upvance.global>',
      reply_to: 'contact@upvance.global',
      to: [email],
      subject: cfg.subject,
      html: cfg.html(email),
    });

    if (emailErr) {
      console.error('Email send error:', emailErr);
      // Don't fail — contact was already added
    }

    return res.status(200).json({ message: 'Inscris cu succes!' });

  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ message: 'Eroare interna. Incearca din nou.' });
  }
};
