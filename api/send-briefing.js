// api/send-briefing.js — Trimite briefing-ul zilnic al Ralucăi via Resend
// Apelat de remote trigger Claude la 07:50 EEST
// POST /api/send-briefing
// Body: { html: "...", subject: "...", secret: "..." }

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }

  const { html, subject, secret } = body || {};

  const BRIEFING_SECRET = process.env.BRIEFING_SECRET || 'briefing-raluca-2026';
  if (!secret || secret !== BRIEFING_SECRET) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!html || !subject) {
    return res.status(400).json({ message: 'Missing html or subject' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Briefing <contact@upvance.global>',
      to: ['raluca@upvance.global'],
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ message: error.message });
    }

    return res.status(200).json({ sent: 1, id: data?.id });
  } catch (err) {
    console.error('send-briefing error:', err);
    return res.status(500).json({ message: err.message });
  }
};
