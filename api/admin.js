// api/admin.js — View waiting list subscribers
// GET /api/admin?secret=YOUR_ADMIN_SECRET
// Returns JSON list of subscribers

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  const secret = req.query?.secret || req.headers?.['x-admin-secret'];
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { data: audienceList, error } = await resend.audiences.list();
    if (error) throw new Error(error.message);

    const audience = audienceList?.data?.find(a => a.name === 'Viitoruri 2030');
    if (!audience) {
      return res.status(200).json({ total: 0, subscribers: [], message: 'No audience found yet.' });
    }

    const { data: contacts, error: cErr } = await resend.contacts.list({ audienceId: audience.id });
    if (cErr) throw new Error(cErr.message);

    const subscribers = (contacts?.data || []).map(c => ({
      email: c.email,
      created_at: c.created_at,
      unsubscribed: c.unsubscribed,
    }));

    return res.status(200).json({
      total: subscribers.length,
      active: subscribers.filter(s => !s.unsubscribed).length,
      audience_id: audience.id,
      subscribers,
    });

  } catch (err) {
    console.error('Admin error:', err);
    return res.status(500).json({ message: err.message });
  }
};
