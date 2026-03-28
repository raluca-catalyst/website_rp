// api/subscribe.js — Waiting list subscription
// Adds contact to Resend audience + sends confirmation email

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Cache audience ID in-memory (persists while function is warm)
let audienceId = null;

async function getOrCreateAudience() {
  if (audienceId) return audienceId;

  const { data, error } = await resend.audiences.list();
  if (error) throw new Error('Could not list audiences: ' + error.message);

  const existing = data?.data?.find(a => a.name === 'Viitoruri 2030');
  if (existing) {
    audienceId = existing.id;
    return audienceId;
  }

  const { data: created, error: createErr } = await resend.audiences.create({
    name: 'Viitoruri 2030',
  });
  if (createErr) throw new Error('Could not create audience: ' + createErr.message);

  audienceId = created.id;
  return audienceId;
}

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

  const { email } = req.body || {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Email invalid.' });
  }

  try {
    // 1. Get or create Resend audience
    const aid = await getOrCreateAudience();

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
      subject: 'Esti pe lista. Pe 3 aprilie primesti raportul.',
      html: CONFIRMATION_EMAIL_HTML(email),
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
