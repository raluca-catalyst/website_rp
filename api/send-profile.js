// api/send-profile.js — Trimite profilul HR Maturity Assessment pe email (Future HR Leader, Basetolearn)
// POST /api/send-profile
// Body: { email, scores: [20 × 0-3], cfToken }
// Nu salvează nimic: adresa se folosește doar pentru trimiterea asta. Textul emailului e fix,
// singurele date variabile sunt scorurile (numere 0-3), deci funcția nu poate trimite alt conținut.

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const TURNSTILE_HOSTNAMES = new Set(
  (process.env.TURNSTILE_HOSTNAMES || '').split(',').map(s => s.trim()).filter(Boolean)
);

// Verifică token-ul Turnstile la Cloudflare. Aici se oprește spamul, nu în pagină.
async function verifyTurnstile(token, expectedAction, ip) {
  if (typeof token !== 'string' || !token || token.length > 2048) return false;
  if (TURNSTILE_HOSTNAMES.size === 0 || !process.env.TURNSTILE_SECRET) return false;
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: AbortSignal.timeout(10000),
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET,
        response: token,
        remoteip: ip || ''
      })
    });
    if (!r.ok) return false;
    const d = await r.json();
    return d.success === true && d.action === expectedAction && TURNSTILE_HOSTNAMES.has(d.hostname);
  } catch (err) {
    return false;
  }
}

// Aceleași dimensiuni și niveluri ca în hr-maturity.html. Ordinea scorurilor: P1-P5, D1-D5, C1-C5, K1-K5.
const DIMS = ['Procese', 'Date', 'Competențe', 'Cultură'];

const LEVELS = [
  { name: 'Administrativ', min: 0, max: 19, desc: 'Funcția HR e în mare parte manuală și tranzacțională. Timpul se duce pe operațiuni, iar AI-ul nu are încă pe ce să se sprijine: date, reguli, competențe.' },
  { name: 'Experimental', min: 20, max: 37, desc: 'Există încercări, dar inegale: câțiva oameni, câteva procese. Primul câștig vine din a pune ordine în date și în reguli, înainte de unelte noi.' },
  { name: 'Structurat', min: 38, max: 49, desc: 'Peste medie. AI-ul e folosit cu reguli pe câteva procese. Miza e să treci de la sarcini izolate la procese reproiectate.' },
  { name: 'Integrat', min: 50, max: 60, desc: 'La frontieră. AI-ul e parte din felul în care lucrează funcția, cu oameni în buclă. Miza devine guvernanța și rolul HR ca funcție care proiectează organizația.' },
];

function computeProfile(scores) {
  const dimScores = [0, 0, 0, 0];
  scores.forEach((s, i) => { dimScores[Math.floor(i / 5)] += s; });
  const total = dimScores.reduce((a, b) => a + b, 0);
  const ranked = dimScores.map((s, i) => ({ s, i })).sort((a, b) => a.s - b.s || a.i - b.i);
  const level = LEVELS.findIndex(l => total >= l.min && total <= l.max);
  return { dimScores, total, level, weakest: ranked.slice(0, 2).map(r => r.i), strongest: ranked[3].i };
}

function emailHtml(p) {
  const lvl = LEVELS[p.level];
  const weakName = DIMS[p.weakest[0]];
  const nextLevel = p.level < LEVELS.length - 1
    ? `Ce ar trebui să fie adevărat peste 12 luni ca să ajungeți la nivelul următor, <strong>${LEVELS[p.level + 1].name}</strong>?`
    : 'Ce ar trebui să fie adevărat peste 12 luni ca să rămâneți la nivelul <strong>Integrat</strong> pe măsură ce AI avansează?';

  const bars = DIMS.map((d, i) => {
    const pct = Math.round(p.dimScores[i] / 15 * 100);
    const mark = p.weakest.includes(i) ? ' <span style="color:#7c3aed;font-size:12px">· de lucrat</span>' : '';
    return `
      <tr><td style="padding:10px 0 4px;font-size:14px;color:#1a1a1a"><strong>${d}</strong>${mark}</td>
          <td style="padding:10px 0 4px;font-size:14px;color:#7c3aed;text-align:right"><strong>${p.dimScores[i]} / 15</strong></td></tr>
      <tr><td colspan="2" style="padding:0 0 4px">
        <div style="background:#ede9fe;border-radius:6px;height:10px;width:100%">
          <div style="background:#7c3aed;border-radius:6px;height:10px;width:${pct}%"></div>
        </div>
      </td></tr>`;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden">
    <div style="padding:32px 40px 24px;border-bottom:1px solid #eee">
      <p style="color:#7c3aed;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 10px">Future HR Leader · HR Maturity Assessment</p>
      <h1 style="color:#111111;font-size:22px;font-weight:700;margin:0;line-height:1.3">Nivelul funcției HR: ${lvl.name} (${p.total} din 60)</h1>
    </div>
    <div style="padding:32px 40px">
      <p style="font-size:15px;color:#444;line-height:1.7;margin:0 0 20px">${lvl.desc}</p>
      <p style="font-size:12px;color:#7c3aed;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 4px">Profilul pe dimensiuni</p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px">${bars}</table>
      <p style="font-size:12px;color:#7c3aed;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 8px">Pentru tema de acasă · Secțiunea 1 din blueprint</p>
      <ol style="padding-left:20px;margin:0 0 20px">
        <li style="font-size:15px;color:#444;line-height:1.7;margin-bottom:8px"><strong>Unde e funcția HR azi?</strong> Pornește de la scorul tău (${p.total} din 60, nivelul ${lvl.name}), de la dimensiunea cea mai puternică (${DIMS[p.strongest]}) și de la cea mai slabă (${weakName}).</li>
        <li style="font-size:15px;color:#444;line-height:1.7;margin-bottom:8px"><strong>Ce ar schimba AI în mandatul HR la voi?</strong> Începe cu dimensiunea „${weakName}”.</li>
        <li style="font-size:15px;color:#444;line-height:1.7;margin-bottom:8px"><strong>Unde vreți să ajungeți?</strong> ${nextLevel}</li>
      </ol>
      <p style="font-size:15px;color:#444;line-height:1.7;margin:0 0 16px">Păstrează emailul: scorul îl refolosești la Lecția 9, în dashboardul pentru board.</p>
      <p style="font-size:14px;color:#333;font-weight:600;margin:24px 0 2px">Raluca Păduraru</p>
      <p style="font-size:13px;color:#666;margin:0">Futures of Work Strategist</p>
    </div>
    <div style="background:#f9f9f9;padding:24px 40px;border-top:1px solid #eee">
      <p style="font-size:12px;color:#888;line-height:1.6;margin:0">Ai primit acest email pentru că ai cerut profilul pe ralucapaduraru.ro/hr-maturity, în programul Future HR Leader (Basetolearn). Adresa ta nu a fost salvată și nu primești alte emailuri de la noi. Instrument adaptat după HR Automation Explorer 2030 (E. Corazzin).</p>
    </div>
  </div>
</body>
</html>`;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }

  const { email, scores, cfToken } = body || {};

  if (typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Email invalid.' });
  }
  if (!Array.isArray(scores) || scores.length !== 20 || !scores.every(s => Number.isInteger(s) && s >= 0 && s <= 3)) {
    return res.status(400).json({ message: 'Profil incomplet.' });
  }

  const clientIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const humanOk = await verifyTurnstile(cfToken, 'hr_maturity', clientIp);
  if (!humanOk) {
    return res.status(400).json({ message: 'Verificarea de securitate a eșuat. Reîncarcă pagina și încearcă din nou.' });
  }

  const profile = computeProfile(scores);

  try {
    const { error } = await resend.emails.send({
      from: 'Raluca Păduraru <contact@upvance.global>',
      reply_to: 'contact@upvance.global',
      to: [email],
      subject: `Profilul funcției HR: ${LEVELS[profile.level].name} (${profile.total} din 60)`,
      html: emailHtml(profile),
    });
    if (error) {
      console.error('send-profile Resend error:', error);
      return res.status(500).json({ message: 'Nu am putut trimite emailul.' });
    }
    return res.status(200).json({ sent: true });
  } catch (err) {
    console.error('send-profile error:', err);
    return res.status(500).json({ message: 'Eroare internă.' });
  }
};
