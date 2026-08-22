// api/feedback.js — formular feedback materiale descărcate
// Body: { email, motive[], motivAltceva, folosit, teme, maimulte, material, website (honeypot) }
// Fiecare răspuns pleacă pe email către Raluca prin Resend.

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    email,
    motive,
    motivAltceva,
    folosit,
    teme,
    maimulte,
    material,
    website
  } = req.body || {};

  // Honeypot: bot a completat câmpul ascuns — respinge silențios
  if (website) {
    return res.status(200).json({ ok: true });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Adresă de email invalidă.' });
  }

  const motiveList = Array.isArray(motive) ? motive : (motive ? [motive] : []);
  const hasContent = motiveList.length > 0 || motivAltceva || folosit || (teme && teme.trim()) || (maimulte && maimulte.trim());
  if (!hasContent) {
    return res.status(400).json({ error: 'Răspunde la întrebări înainte să finalizezi.' });
  }

  const motiveLabel = motiveList.length > 0 ? motiveList.join(' · ') : '(fără răspuns)';
  const row = (label, value) => `
      <tr style="border-bottom:1px solid #f0f0f0">
        <td style="padding:10px 16px 10px 0;color:#888;font-weight:600;white-space:nowrap;vertical-align:top">${label}</td>
        <td style="padding:10px 0;font-weight:500">${escapeHtml(value || '(fără răspuns)')}</td>
      </tr>`;

  const emailBody = `
<html>
<body style="font-family:Inter,Arial,sans-serif;background:#f9f9f9;padding:32px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e5e5;">
    <h2 style="color:#7c3aed;margin:0 0 24px;font-size:22px;">Feedback materiale</h2>
    <table style="font-size:15px;color:#333;border-collapse:collapse;width:100%">
      ${row('E-mail', email)}
      ${row('Material', material)}
      ${row('De ce a descărcat', motiveLabel)}
      ${motivAltceva ? row('Altceva (motiv)', motivAltceva) : ''}
      ${row('L-a folosit?', folosit)}
      ${row('Teme dorite', teme)}
      ${row('Vrea să spună mai multe', maimulte)}
    </table>
  </div>
</body>
</html>`.trim();

  try {
    await resend.emails.send({
      from: 'Site ralucapaduraru.ro <contact@upvance.global>',
      to: 'raluca@upvance.global',
      replyTo: email,
      subject: `Feedback materiale: ${email}`,
      html: emailBody,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Eroare la trimiterea răspunsului.' });
  }
};
