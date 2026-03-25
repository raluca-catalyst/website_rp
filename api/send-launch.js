// api/send-launch.js — Send launch email to all waiting list subscribers
// Call manually on April 3 at 11:00: GET /api/send-launch?secret=YOUR_ADMIN_SECRET
// Returns { sent, failed, total }

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const PDF_URL = 'https://ralucapaduraru.ro/downloads/viitoruri-2030.pdf';

const LAUNCH_EMAIL_HTML = `
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
    .header h2 { color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; line-height: 1.3; }
    .body { padding: 36px 40px; }
    .body p { font-size: 15px; color: #444; line-height: 1.7; margin: 0 0 16px; }
    .body ul { padding-left: 20px; margin: 0 0 20px; }
    .body ul li { font-size: 15px; color: #444; line-height: 1.7; margin-bottom: 6px; }
    .cta { display: inline-block; background: #9B8AF0; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 700; font-size: 16px; margin: 12px 0 24px; }
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
      <h2>Raportul e gata. Descarcă-l acum.</h2>
    </div>
    <div class="body">
      <p>Salutare,</p>
      <p>Ți-am promis că pe 3 aprilie primești raportul. Iată-l.</p>
      <a class="cta" href="${PDF_URL}" target="_blank">Descarcă &ldquo;Patru viitoruri ale muncii în România 2030&rdquo; &rarr;</a>
      <p>Câteva cifre din raport, ca aperitiv:</p>
      <ul>
        <li>5,2% din companiile din România folosesc AI. Ultimul loc în UE.</li>
        <li>54% din locurile vacante sunt pentru necalificați. Doar 6,7% pentru cei cu studii superioare.</li>
        <li>Industria auto a pierdut deja peste 1.500 de locuri de muncă în 2025 și sângerează locuri de muncă și în 2026.</li>
        <li>82.000 de profesioniști din diaspora s-au repatriat în 2023.</li>
      </ul>
      <p>Raportul construiește 4 scenarii pe baza acestor date: <strong>Primăvara co-Pilot, Vara superputerilor, Toamna inerției și Iarna digitală</strong>. Plus 10 competențe care te protejează în orice scenariu și strategii acționabile imediat.</p>
      <p>Am o invitație pentru tine: după ce îl citești (sau chiar după ce parcurgi sumarul executiv), dă-mi un reply cu o impresie. Ce te-a surprins? Ce ți s-a părut cel mai relevant? Ce ai vrea să explorăm mai departe? Feedback-ul tău chiar contează pentru mine. Fiecare răspuns mă ajută să înțeleg mai bine ce e relevant pentru profesioniștii din România.</p>
      <p>P.S. Dacă raportul ți se pare util, trimite-l unui coleg care se gândește la viitorul carierei sale.<br>
      Link de descărcare: <a href="https://ralucapaduraru.ro/viitoruri" style="color:#9B8AF0">https://ralucapaduraru.ro/viitoruri</a></p>
      <p>Lectură plăcută,</p>
      <p class="sig">
        Raluca Păduraru
        <span>Futures of Work Strategist | Building AI Agency in Organizations</span>
      </p>
    </div>
    <div class="footer">
      <p>Ai primit acest email deoarece te-ai înscris pe lista de așteptare pe ralucapaduraru.ro/viitoruri.<br>
      Pentru a te dezabona, trimite un email la <a href="mailto:contact@upvance.global" style="color:#9B8AF0">contact@upvance.global</a> cu subiectul &ldquo;Dezabonare&rdquo;.</p>
    </div>
  </div>
</body>
</html>
`;

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  // Protect with admin secret
  const secret = req.query?.secret || req.headers?.['x-admin-secret'];
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Dry run mode: ?dry=1 to preview without sending
  const isDryRun = req.query?.dry === '1';

  try {
    // Find the Viitoruri 2030 audience
    const { data: audienceList, error: listErr } = await resend.audiences.list();
    if (listErr) throw new Error('Could not list audiences: ' + listErr.message);

    const audience = audienceList?.data?.find(a => a.name === 'Viitoruri 2030');
    if (!audience) {
      return res.status(404).json({ message: 'Audience "Viitoruri 2030" not found. Nobody subscribed yet?' });
    }

    // Fetch all contacts
    const { data: contacts, error: contactsErr } = await resend.contacts.list({
      audienceId: audience.id,
    });
    if (contactsErr) throw new Error('Could not list contacts: ' + contactsErr.message);

    const emails = (contacts?.data || [])
      .filter(c => !c.unsubscribed && c.email)
      .map(c => c.email);

    if (isDryRun) {
      return res.status(200).json({
        dry_run: true,
        total: emails.length,
        preview: emails.slice(0, 10),
        message: `Dry run: would send to ${emails.length} subscribers`,
      });
    }

    if (emails.length === 0) {
      return res.status(200).json({ message: 'No subscribers to send to.', sent: 0, total: 0 });
    }

    // Send in batches of 50 (Resend batch limit)
    const BATCH_SIZE = 50;
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);
      const messages = batch.map(email => ({
        from: 'Raluca P\u0103duraru <contact@upvance.global>',
        reply_to: 'contact@upvance.global',
        to: [email],
        subject: 'Raportul e gata. Desc\u0103rc\u0103-l acum.',
        html: LAUNCH_EMAIL_HTML,
      }));

      const { data, error } = await resend.batch.send(messages);
      if (error) {
        console.error(`Batch ${i / BATCH_SIZE} error:`, error);
        failed += batch.length;
      } else {
        sent += (data?.data?.length || batch.length);
      }

      // Small delay between batches to avoid rate limits
      if (i + BATCH_SIZE < emails.length) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    // Notify Raluca of completion
    await resend.emails.send({
      from: 'Viitoruri Bot <contact@upvance.global>',
      to: ['raluca@upvance.global'],
      subject: `Launch emails trimise: ${sent}/${emails.length}`,
      html: `<p>Launch email blast finalizat.<br><b>Trimise:</b> ${sent}<br><b>Eșecuri:</b> ${failed}<br><b>Total subscribers:</b> ${emails.length}</p>`,
    }).catch(() => {});

    return res.status(200).json({ sent, failed, total: emails.length });

  } catch (err) {
    console.error('Send-launch error:', err);
    return res.status(500).json({ message: err.message });
  }
};
