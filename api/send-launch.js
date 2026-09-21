// api/send-launch.js — Send launch email to all waiting list subscribers
// Call manually in launch day:
//   GET /api/send-launch?secret=YOUR_ADMIN_SECRET                        (viitoruri, implicit)
//   GET /api/send-launch?secret=YOUR_ADMIN_SECRET&list=ghid-adoptie-ai
// Add &dry=1 to preview the recipients without sending.
// Returns { sent, failed, total }

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const PDF_URL = 'https://ralucapaduraru.ro/downloads/viitoruri-2030.pdf';
const GHID_PDF_URL = 'https://ralucapaduraru.ro/downloads/ghid-adoptie-ai.pdf';

const LAUNCH_EMAIL_HTML = `
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
    .cta { display: inline-block; background: #9B8AF0; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 700; font-size: 16px; margin: 12px 0 24px; }
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
      <p class="sig-name">Raluca Păduraru</p>
      <p class="sig-title">Futures of Work Strategist | Building AI Agency in Organizations</p>
    </div>
    <div class="footer">
      <p>Ai primit acest email deoarece te-ai înscris pe lista de așteptare pe ralucapaduraru.ro/viitoruri.<br>
      Pentru a te dezabona, trimite un email la <a href="mailto:contact@upvance.global" style="color:#9B8AF0">contact@upvance.global</a> cu subiectul &ldquo;Dezabonare&rdquo;.</p>
    </div>
  </div>
</body>
</html>
`;

const GHID_LAUNCH_EMAIL_HTML = `
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
    .cta { display: inline-block; background: #9B8AF0; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 700; font-size: 16px; margin: 12px 0 24px; }
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
      <h2>Ghidul e gata. Descarcă-l acum.</h2>
    </div>
    <div class="body">
      <p>Bună,</p>
      <p>Ți-am promis că pe 8 octombrie primești ghidul. Iată-l.</p>
      <a class="cta" href="${GHID_PDF_URL}" target="_blank">Descarcă &bdquo;Ai primit mandatul să te ocupi de AI. De unde începi?&rdquo; &rarr;</a>
      <p>Ce găsești în cele 77 de pagini:</p>
      <ul>
        <li>Traseul primelor 90 de zile: mandatul, echipa, regulile, primul pilot, măsurarea și raportul către conducere</li>
        <li>9 fișe de lucru, de la fișa de mandat la raportul de 90 de zile</li>
        <li>Un exemplu practic de onboarding, urmărit de la solicitare până la planul final</li>
        <li>Ce trebuie clarificat cu fiecare stakeholder înainte de primul test, ancorat în legislația în vigoare</li>
      </ul>
      <p>După ce îl parcurgi, dă-mi un reply cu un gând. Ce ți-a fost cel mai greu de clarificat până acum în adopția AI? Răspunsurile mă ajută să construiesc materiale tot mai aproape de ce se întâmplă în organizații.</p>
      <p>P.S. Dacă ți se pare util, trimite-l unui coleg care a primit același mandat.<br>
      Link: <a href="https://ralucapaduraru.ro/ghid-adoptie" style="color:#9B8AF0">ralucapaduraru.ro/ghid-adoptie</a></p>
      <p>Lectură plăcută,</p>
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

// Lansări: fiecare cu audiența ei Resend și cu emailul ei.
// Query: ?list=<cheie> — lipsă => 'viitoruri' (backwards compatible)
const LAUNCHES = {
  'viitoruri': {
    audienceName: 'Viitoruri 2030',
    subject: 'Raportul e gata. Descărcă-l acum.',
    html: LAUNCH_EMAIL_HTML,
    botName: 'Viitoruri Bot',
  },
  'ghid-adoptie-ai': {
    audienceName: 'Ghid adoptie AI',
    subject: 'Ghidul e gata. Descărcă-l acum.',
    html: GHID_LAUNCH_EMAIL_HTML,
    botName: 'Ghid Bot',
  },
};

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  // Protect with admin secret
  const secret = req.query?.secret || req.headers?.['x-admin-secret'];
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Dry run mode: ?dry=1 to preview without sending
  const isDryRun = req.query?.dry === '1';

  // Which launch: ?list=viitoruri | ghid-adoptie-ai (default: viitoruri)
  const listKey = req.query?.list || 'viitoruri';
  const cfg = LAUNCHES[listKey];
  if (!cfg) {
    return res.status(400).json({ message: `Unknown list "${listKey}". Available: ${Object.keys(LAUNCHES).join(', ')}` });
  }

  try {
    // Find the audience for this launch
    const { data: audienceList, error: listErr } = await resend.audiences.list();
    if (listErr) throw new Error('Could not list audiences: ' + listErr.message);

    const audience = audienceList?.data?.find(a => a.name === cfg.audienceName);
    if (!audience) {
      return res.status(404).json({ message: `Audience "${cfg.audienceName}" not found. Nobody subscribed yet?` });
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
        list: listKey,
        audience: cfg.audienceName,
        subject: cfg.subject,
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
        subject: cfg.subject,
        html: cfg.html,
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
      from: `${cfg.botName} <contact@upvance.global>`,
      to: ['raluca@upvance.global'],
      subject: `Launch emails trimise (${listKey}): ${sent}/${emails.length}`,
      html: `<p>Launch email blast finalizat pentru <b>${cfg.audienceName}</b>.<br><b>Trimise:</b> ${sent}<br><b>Eșecuri:</b> ${failed}<br><b>Total subscribers:</b> ${emails.length}</p>`,
    }).catch(() => {});

    return res.status(200).json({ list: listKey, sent, failed, total: emails.length });

  } catch (err) {
    console.error('Send-launch error:', err);
    return res.status(500).json({ message: err.message });
  }
};
