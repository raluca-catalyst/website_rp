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
    name,
    email,
    phone,
    role,
    company,
    message,
    contactPrefs,
    gdpr,
    newsletter
  } = req.body || {};

  // Validate required fields
  if (!name || !email || !phone || !role || !company || !message || !gdpr) {
    return res.status(400).json({ error: 'Câmpuri obligatorii lipsă.' });
  }

  const prefsLabel = Array.isArray(contactPrefs) && contactPrefs.length > 0
    ? contactPrefs.join(', ')
    : 'Nicio preferință selectată';

  const newsletterLabel = newsletter ? 'Da' : 'Nu';

  const emailBody = `
<html>
<body style="font-family:Inter,Arial,sans-serif;background:#f9f9f9;padding:32px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e5e5;">
    <h2 style="color:#00D4FF;margin:0 0 24px;font-size:22px;">HOT LEAD! — Formular de contact</h2>
    <table style="font-size:15px;color:#333;border-collapse:collapse;width:100%">
      <tr style="border-bottom:1px solid #f0f0f0">
        <td style="padding:10px 16px 10px 0;color:#888;font-weight:600;white-space:nowrap;vertical-align:top">Nume</td>
        <td style="padding:10px 0;font-weight:500">${escapeHtml(name)}</td>
      </tr>
      <tr style="border-bottom:1px solid #f0f0f0">
        <td style="padding:10px 16px 10px 0;color:#888;font-weight:600;white-space:nowrap;vertical-align:top">E-mail</td>
        <td style="padding:10px 0"><a href="mailto:${escapeHtml(email)}" style="color:#00D4FF">${escapeHtml(email)}</a></td>
      </tr>
      <tr style="border-bottom:1px solid #f0f0f0">
        <td style="padding:10px 16px 10px 0;color:#888;font-weight:600;white-space:nowrap;vertical-align:top">Telefon</td>
        <td style="padding:10px 0">${escapeHtml(phone)}</td>
      </tr>
      <tr style="border-bottom:1px solid #f0f0f0">
        <td style="padding:10px 16px 10px 0;color:#888;font-weight:600;white-space:nowrap;vertical-align:top">Rol</td>
        <td style="padding:10px 0">${escapeHtml(role)}</td>
      </tr>
      <tr style="border-bottom:1px solid #f0f0f0">
        <td style="padding:10px 16px 10px 0;color:#888;font-weight:600;white-space:nowrap;vertical-align:top">Companie</td>
        <td style="padding:10px 0">${escapeHtml(company)}</td>
      </tr>
      <tr style="border-bottom:1px solid #f0f0f0">
        <td style="padding:10px 16px 10px 0;color:#888;font-weight:600;white-space:nowrap;vertical-align:top">Preferință contact</td>
        <td style="padding:10px 0">${escapeHtml(prefsLabel)}</td>
      </tr>
      <tr>
        <td style="padding:10px 16px 10px 0;color:#888;font-weight:600;white-space:nowrap;vertical-align:top">Newsletter</td>
        <td style="padding:10px 0">${newsletterLabel}</td>
      </tr>
    </table>
    <h3 style="color:#333;margin:28px 0 10px;font-size:16px;">Mesaj</h3>
    <div style="background:#f5f5f5;padding:16px;border-radius:8px;font-size:15px;color:#333;line-height:1.65;white-space:pre-wrap">${escapeHtml(message)}</div>
  </div>
</body>
</html>`.trim();

  try {
    await resend.emails.send({
      from: 'Raluca Păduraru <contact@upvance.global>',
      to: 'raluca@upvance.global',
      replyTo: email,
      subject: 'HOT LEAD!',
      html: emailBody,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Eroare la trimiterea mesajului.' });
  }
};
