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

// Emailul oglindește pagina de rezultate, în varianta de print (fundal alb):
// cardul de nivel cu scala, profilul pe dimensiuni cu bare, tema de acasă.
// Graficele sunt tabele, nu div-uri, ca să arate la fel și în Outlook.
const MONO = "'JetBrains Mono','Courier New',monospace";
const VIOLET = '#7c3aed';

function kicker(text) {
  return `<p style="font-family:${MONO};font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${VIOLET};margin:0 0 6px">${text}</p>`;
}

function card(inner, featured) {
  const style = featured
    ? `background:#f6f2ff;border:1px solid #ddd0fb;border-top:2px solid ${VIOLET};`
    : 'background:#ffffff;border:1px solid #ddd0fb;';
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="${style}border-radius:12px;margin:0 0 16px">
    <tr><td style="padding:20px 22px">${inner}</td></tr></table>`;
}

function levelScale(current) {
  const cells = LEVELS.map((l, i) => {
    const on = i === current;
    const style = on
      ? `background:${VIOLET};color:#ffffff;border:1px solid ${VIOLET};`
      : 'background:#ffffff;color:#8a8a8a;border:1px solid #ddd0fb;';
    return `<td width="25%" style="padding:0 3px"><div style="${style}border-radius:6px;padding:7px 2px;text-align:center;font-family:${MONO};font-size:11px;line-height:1.4">${l.name}<br>${l.min}-${l.max}</div></td>`;
  }).join('');
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:16px 0 0"><tr>${cells}</tr></table>`;
}

function bar(score) {
  const pct = Math.round(score / 15 * 100);
  const fill = `<td width="${pct}%" style="background:${VIOLET};height:12px;border-radius:6px;font-size:0;line-height:0">&nbsp;</td>`;
  const rest = '<td style="height:12px;font-size:0;line-height:0">&nbsp;</td>';
  const cells = pct <= 0 ? rest : pct >= 100 ? fill.replace(` width="${pct}%"`, '') : fill + rest;
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ede9fe;border-radius:6px"><tr>${cells}</tr></table>`;
}

function emailHtml(p) {
  const lvl = LEVELS[p.level];
  const weakName = DIMS[p.weakest[0]];
  const nextLevel = p.level < LEVELS.length - 1
    ? `Ce ar trebui să fie adevărat peste 12 luni ca să ajungeți la nivelul următor, <strong style="color:#1a1a1a">${LEVELS[p.level + 1].name}</strong>?`
    : 'Ce ar trebui să fie adevărat peste 12 luni ca să rămâneți la nivelul <strong style="color:#1a1a1a">Integrat</strong> pe măsură ce AI avansează?';
  const date = new Date().toLocaleDateString('ro-RO', { timeZone: 'Europe/Bucharest' });
  const txt = 'font-size:14px;color:#555555;line-height:1.65';

  const levelCard = card(`
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr>
      <td valign="bottom">${kicker('Nivelul funcției HR')}
        <p style="font-family:${MONO};font-size:24px;font-weight:700;color:#1a1a1a;margin:0;line-height:1.2">${lvl.name}</p></td>
      <td valign="bottom" align="right" style="font-family:${MONO};font-size:40px;font-weight:700;color:${VIOLET};line-height:1;white-space:nowrap">${p.total}<span style="font-size:16px;color:#8a8a8a;font-weight:500"> / 60</span></td>
    </tr></table>
    ${levelScale(p.level)}
    <p style="${txt};margin:16px 0 0">${lvl.desc}</p>`, true);

  const bars = DIMS.map((d, i) => {
    const mark = p.weakest.includes(i) ? `<span style="color:${VIOLET};font-size:11px">&nbsp;&nbsp;· de lucrat</span>` : '';
    return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 14px">
      <tr><td style="font-family:${MONO};font-size:13px;color:#1a1a1a;padding:0 0 5px">${d}${mark}</td>
          <td align="right" style="font-family:${MONO};font-size:13px;color:${VIOLET};padding:0 0 5px">${p.dimScores[i]} / 15</td></tr>
      <tr><td colspan="2">${bar(p.dimScores[i])}</td></tr></table>`;
  }).join('');

  const dimsCard = card(`
    ${kicker('Profilul pe dimensiuni')}
    <p style="${txt};margin:0 0 14px">Fiecare dimensiune are maximum 15 puncte. Cele două cele mai slabe sunt marcate.</p>
    ${bars}`);

  const li = t => `<li style="${txt};margin:0 0 10px">${t}</li>`;
  const homeworkCard = card(`
    ${kicker('Pentru tema de acasă · Secțiunea 1 din blueprint')}
    <p style="font-family:${MONO};font-size:16px;font-weight:700;color:#1a1a1a;margin:0 0 12px">Punctul de plecare</p>
    <ol style="margin:0 0 6px;padding-left:20px">
      ${li(`<strong style="color:#1a1a1a">Unde e funcția HR azi?</strong> Pornește de la scorul tău (${p.total} din 60, nivelul ${lvl.name}), de la dimensiunea cea mai puternică (${DIMS[p.strongest]}) și de la cea mai slabă (${weakName}).`)}
      ${li(`<strong style="color:#1a1a1a">Ce ar schimba AI în mandatul HR la voi?</strong> Începe cu dimensiunea „${weakName}”.`)}
      ${li(`<strong style="color:#1a1a1a">Unde vreți să ajungeți?</strong> ${nextLevel}`)}
    </ol>
    <p style="font-size:13px;color:#555555;line-height:1.65;margin:0">Scorul e punctul de plecare pentru curs, o auto-evaluare. În cadrul lecției 9 o să îl atașezi în dashboardul pentru board, alături de obiectivul pe 12 luni și KPIs care arată dacă vă apropiați de el.</p>`);

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family:'Barlow','Helvetica Neue',Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;padding:28px 24px">
    <img src="https://www.ralucapaduraru.ro/images/logo.png" alt="Raluca Păduraru" height="28" style="height:28px;display:block">
    <p style="font-size:13px;color:#777777;line-height:1.5;margin:8px 0 20px">HR Maturity Assessment · HR Management în era AI: transformare, oameni și automatizări · Basetolearn · ${date}</p>
    ${levelCard}
    ${dimsCard}
    ${homeworkCard}
    <p style="font-size:14px;color:#333333;font-weight:600;margin:20px 0 2px">Raluca Păduraru</p>
    <p style="font-size:13px;color:#666666;margin:0 0 20px">Futures of Work Strategist</p>
    <p style="font-size:12px;color:#888888;line-height:1.6;margin:0;border-top:1px solid #eeeeee;padding-top:16px">Ai primit acest email pentru că ai cerut profilul pe ralucapaduraru.ro/hr-maturity, în cursul HR Management în era AI: transformare, oameni și automatizări (Basetolearn). Adresa ta nu a fost salvată și nu primești alte emailuri de la noi. Instrument adaptat după HR Automation Explorer 2030 (E. Corazzin).</p>
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
