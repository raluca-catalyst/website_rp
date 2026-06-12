# AI Business Translator — Form gated de download: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Form de captare lead pe `/frameworks/ai-business-translator/` care livrează PDF-ul framework-ului pe email, refolosind mecanismul /viitoruri.

**Architecture:** Endpoint-ul existent `api/download.js` devine multi-resource printr-un map `RESOURCES` (cheie = slug, valoare = PDF + subiect + template email). Frontend-ul adaugă o secțiune `#descarca` pe pagina framework-ului cu form identic funcțional cu /viitoruri + honeypot anti-spam. Lead-urile merg în același Google Sheet, cu câmp nou `sursa`.

**Tech Stack:** HTML/CSS/JS static, Vercel serverless (CommonJS), Resend, Google Apps Script webhook.

**Spec:** `docs/superpowers/specs/2026-06-12-abt-framework-download-form-design.md`

---

## File Structure

- Copy: `C:\Users\keimy\wiki\frameworks\AI Business Translator Framework.pdf` → `downloads/ai-business-translator-framework.pdf`
- Rewrite: `api/download.js` (multi-resource, honeypot, sursa)
- Modify: `frameworks/ai-business-translator/index.html` (CSS form + CTA în header + secțiune `#descarca` + JS submit)
- Manual (în afara repo): Apps Script — coloană `Sursa` (snippet livrat în chat la final)

Nota repo: site static fără framework de teste — verificarea se face cu `node --check` pe API și fetch pe live după deploy. Nu se adaugă infrastructură de teste (YAGNI).

---

### Task 1: PDF în downloads/

**Files:**
- Create: `downloads/ai-business-translator-framework.pdf`

- [ ] **Step 1: Copiază PDF-ul cu nume URL-safe**

Run (PowerShell):
```powershell
Copy-Item "C:\Users\keimy\wiki\frameworks\AI Business Translator Framework.pdf" "C:\Users\keimy\.claude\website_rp\downloads\ai-business-translator-framework.pdf"
```

- [ ] **Step 2: Verifică dimensiunea**

Run: `Get-Item "C:\Users\keimy\.claude\website_rp\downloads\ai-business-translator-framework.pdf" | Select-Object Length`
Expected: ~149230 bytes

- [ ] **Step 3: Commit**

```powershell
git -C "C:\Users\keimy\.claude\website_rp" add "downloads/ai-business-translator-framework.pdf"
git -C "C:\Users\keimy\.claude\website_rp" commit -m "Add AI Business Translator Framework PDF to downloads"
```

---

### Task 2: api/download.js multi-resource

**Files:**
- Rewrite: `api/download.js` (conținut complet mai jos)

Comportament:
- `resource` lipsă → `'viitoruri'` (backwards compatible, formul viitoruri nu se schimbă).
- `resource` necunoscut → 400.
- `website` (honeypot) completat → 200 fals, fără email, fără log.
- Payload Apps Script primește `sursa`.
- Emailul de notificare folosește subiect per resursă.

- [ ] **Step 1: Înlocuiește integral conținutul `api/download.js` cu:**

```js
// api/download.js — PDF delivery prin email, multi-resource
// Body: { resource?, name, email, company, role, website (honeypot) }
// resource lipsă => 'viitoruri' (backwards compatible)

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const SHEETS_WEBHOOK = 'https://script.google.com/macros/s/AKfycbxJjD_2faU9XQLxOOlWDzYUXLp4Vs0aa-895GJ5rXj9GnZ5U1rQsQMMfptEXLVVQG5_/exec';
const BOOKING_URL = 'https://calendar.app.google/97NFSpQYzKkJmkuL9';

// Schelet comun de email (header Upvance, CTA lavender, footer)
const emailShell = ({ title, bodyHtml, footerNote }) => `
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
    .cta { display: inline-block; background: #9B8AF0; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 16px; margin: 12px 0 24px; }
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
      <h2>${title}</h2>
    </div>
    <div class="body">
      ${bodyHtml}
      <p>Mulțumesc și lectură plăcută,</p>
      <p class="sig-name">Raluca Păduraru</p>
      <p class="sig-title">Futures of Work Strategist | Building AI Agency in Organizations</p>
    </div>
    <div class="footer">
      <p>${footerNote}<br>
      Întrebări? Scrie la <a href="mailto:contact@upvance.global" style="color:#9B8AF0">contact@upvance.global</a></p>
    </div>
  </div>
</body>
</html>
`;

const RESOURCES = {
  'viitoruri': {
    pdfUrl: 'https://ralucapaduraru.ro/downloads/viitoruri-2030.pdf',
    subject: 'Raportul tău: Patru viitoruri ale muncii în România 2030',
    notifySubject: (name, company) => `Nou download: ${name} (${company || 'N/A'})`,
    emailHtml: function () {
      return emailShell({
        title: 'Raportul tău: Patru viitoruri ale muncii în România 2030',
        footerNote: 'Ai primit acest email deoarece ai completat formularul de pe ralucapaduraru.ro/viitoruri.',
        bodyHtml: `
      <p>Salutare,</p>
      <p>Mulțumesc că ai cerut raportul. Îl găsești aici:</p>
      <a class="cta" href="${this.pdfUrl}" target="_blank">Descarcă raportul &rarr;</a>
      <p>Sunt 62 de pagini. Dacă ai 5 minute, citește sumarul executiv. Dacă ai 15, adaugă și scenariul care te intrigă cel mai mult. Dacă ai o oră, citește-l integral. Fiecare nivel de lectură oferă ceva util.</p>
      <p>Dar, indiferent cât citești, am o invitație: dă-mi un reply cu o singură propoziție. <strong>Ce te-a surprins cel mai mult?</strong> Fiecare răspuns pe care îl primesc mă ajută să înțeleg ce e cu adevărat relevant pentru profesioniștii din România și să construiesc materiale și mai bune.</p>
      <p>P.S. Dacă vrei să explorezi implicațiile raportului cu echipa ta, pot organiza o sesiune de debrief de 30 de minute, fără obligații. Poți rezerva un slot aici: <a href="${BOOKING_URL}" style="color:#9B8AF0">${BOOKING_URL}</a></p>`,
      });
    },
  },
  'ai-business-translator': {
    pdfUrl: 'https://ralucapaduraru.ro/downloads/ai-business-translator-framework.pdf',
    subject: 'Framework-ul tău: AI Business Translator',
    notifySubject: (name, company) => `Nou download AI Business Translator: ${name} (${company || 'N/A'})`,
    emailHtml: function () {
      return emailShell({
        title: 'Framework-ul tău: AI Business Translator',
        footerNote: 'Ai primit acest email deoarece ai completat formularul de pe ralucapaduraru.ro/frameworks/ai-business-translator/.',
        bodyHtml: `
      <p>Salutare,</p>
      <p>Mulțumesc că ai cerut framework-ul. Îl găsești aici:</p>
      <a class="cta" href="${this.pdfUrl}" target="_blank">Descarcă framework-ul &rarr;</a>
      <p>Framework-ul definește concret rolul de AI Business Translator: cele trei seturi de abilități, cele cinci activități și cele cinci milestone-uri prin care se construiește competența în echipă.</p>
      <p>După ce îl parcurgi, am o invitație: dă-mi un reply cu o singură propoziție. <strong>Care dintre cele cinci activități e cel mai puțin acoperită în echipa ta acum?</strong> Răspunsurile mă ajută să construiesc materiale tot mai relevante pentru profesioniștii din România.</p>
      <p>P.S. Dacă vrei să construiești AI Business Translators în organizația ta, putem vorbi 30 de minute despre cum ar arăta un program adaptat la contextul vostru, fără obligații: <a href="${BOOKING_URL}" style="color:#9B8AF0">${BOOKING_URL}</a></p>`,
      });
    },
  },
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://ralucapaduraru.ro');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { resource, name, email, company, role, website } = req.body || {};

  // Honeypot: boții completează câmpul ascuns => răspuns 200 fals, fără acțiune
  if (website) return res.status(200).json({ message: 'OK' });

  const slug = resource || 'viitoruri';
  const cfg = RESOURCES[slug];
  if (!cfg) return res.status(400).json({ message: 'Resursă necunoscută.' });

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Email invalid.' });
  }
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ message: 'Numele este obligatoriu.' });
  }

  try {
    const { error } = await resend.emails.send({
      from: 'Raluca Păduraru <contact@upvance.global>',
      reply_to: 'contact@upvance.global',
      to: [email],
      subject: cfg.subject,
      html: cfg.emailHtml(),
    });

    if (error) {
      console.error('Email send error:', error);
      return res.status(500).json({ message: 'Nu am putut trimite emailul. Încearcă din nou.' });
    }

    // Log lead to Google Sheets (non-critical)
    fetch(SHEETS_WEBHOOK, {
      method: 'POST',
      body: JSON.stringify({ nume: name, prenume: '', email, rol: role, companie: company, sursa: slug }),
    }).catch(() => {}); // non-critical, ignore errors

    // Also notify Raluca of new lead
    await resend.emails.send({
      from: 'Site ralucapaduraru.ro <contact@upvance.global>',
      to: ['raluca@upvance.global'],
      subject: cfg.notifySubject(name, company),
      html: `<p><b>Nume:</b> ${name}<br><b>Email:</b> ${email}<br><b>Companie:</b> ${company || '-'}<br><b>Rol:</b> ${role || '-'}<br><b>Sursă:</b> ${slug}</p>`,
    }).catch(() => {}); // non-critical, ignore errors

    return res.status(200).json({ message: 'Trimis pe email!' });

  } catch (err) {
    console.error('Download error:', err);
    return res.status(500).json({ message: 'Eroare internă. Încearcă din nou.' });
  }
};
```

- [ ] **Step 2: Verifică sintaxa**

Run: `node --check "C:\Users\keimy\.claude\website_rp\api\download.js"`
Expected: fără output (exit 0)

- [ ] **Step 3: Commit**

```powershell
git -C "C:\Users\keimy\.claude\website_rp" add api/download.js
git -C "C:\Users\keimy\.claude\website_rp" commit -m "Extend api/download.js: multi-resource delivery, honeypot, sursa field"
```

---

### Task 3: Frontend — secțiunea #descarca pe pagina framework-ului

**Files:**
- Modify: `frameworks/ai-business-translator/index.html`
  - `<style>` block (linia ~33–44): adaugă CSS form
  - Page header (linia ~182–184): adaugă buton ancoră spre `#descarca`
  - Înainte de `<!-- ====================== FOOTER CTA ====================== -->` (linia ~334): inserează secțiunea
  - Înainte de `</body>` (după `<script src="../../js/main.js"></script>`, linia ~367): adaugă JS-ul de submit

- [ ] **Step 1: Adaugă CSS-ul în `<style>`-ul existent al paginii**

În blocul `<style>` (după regula `@media (max-width:480px) { .abt-act-grid ... }`), adaugă:

```css
    /* download form */
    .download-form-wrap { max-width: 600px; margin: 0 auto; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
    .form-field label {
      font-family: var(--font-mono); font-size: 0.7rem; font-weight: 600;
      letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-sec);
    }
    .form-field input {
      background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);
      padding: 13px 16px; font-family: var(--font-body, inherit); font-size: 0.95rem;
      color: var(--text); outline: none; transition: border-color 0.2s;
    }
    .form-field input:focus { border-color: var(--lavender); }
    .form-field input::placeholder { color: var(--text-muted); }
    .form-check { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 24px; }
    .form-check input[type="checkbox"] { width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px; accent-color: var(--lavender); cursor: pointer; }
    .form-check label { font-size: 0.85rem; color: var(--text-sec); line-height: 1.6; cursor: pointer; }
    .form-submit-wrap { display: flex; flex-direction: column; align-items: center; gap: 12px; }
    .form-submit-wrap .btn { width: 100%; justify-content: center; }
    .form-privacy { font-size: 0.75rem; color: var(--text-muted); text-align: center; }
    .hp-field { position: absolute; left: -9999px; opacity: 0; height: 0; overflow: hidden; }
    .download-form-msg { margin-top: 16px; font-size: 0.9rem; border-radius: var(--radius); padding: 12px 16px; text-align: center; display: none; }
    .download-form-msg.success { display: block; background: rgba(107,158,116,0.15); border: 1px solid rgba(107,158,116,0.4); color: #7BC78A; }
    .download-form-msg.error   { display: block; background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.3); color: var(--lavender-lt); }
    @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
```

- [ ] **Step 2: Adaugă butonul ancoră în page header**

După paragraful care se termină cu „...în ambele direcții." (linia ~184), înainte de `</div>` al containerului din header, adaugă:

```html
        <a href="#descarca" class="btn btn-primary" style="margin-top:1.5rem;"
           onclick="gtag('event','cta_click',{event_category:'hero',event_label:'ai-business-translator-pdf'})">
          Descarcă framework-ul (PDF)
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
        </a>
```

- [ ] **Step 3: Inserează secțiunea formului înainte de FOOTER CTA**

Imediat înainte de `<!-- ====================== FOOTER CTA ====================== -->`:

```html
    <!-- ====================== DOWNLOAD FORM ====================== -->
    <section class="section" id="descarca" aria-labelledby="descarca-heading">
      <div class="container">
        <div style="max-width:860px; margin:0 auto;">
          <div class="fade-up" style="text-align:center; margin-bottom:32px;">
            <div class="label" style="margin:0 auto 1rem;">Descarcă gratuit</div>
            <h2 id="descarca-heading">Descarcă framework-ul complet (PDF)</h2>
            <p style="color:var(--text-muted); margin-top:12px;">Completează formularul și primești framework-ul pe email.</p>
          </div>
          <div class="download-form-wrap fade-up">
            <form id="abt-download-form" novalidate>
              <div class="form-row">
                <div class="form-field">
                  <label for="abt-name">Nume complet *</label>
                  <input type="text" id="abt-name" name="name" required placeholder="Prenume Nume" autocomplete="name" />
                </div>
                <div class="form-field">
                  <label for="abt-email">Email profesional *</label>
                  <input type="email" id="abt-email" name="email" required placeholder="tu@companie.ro" autocomplete="email" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-field">
                  <label for="abt-company">Companie</label>
                  <input type="text" id="abt-company" name="company" placeholder="Compania ta" autocomplete="organization" />
                </div>
                <div class="form-field">
                  <label for="abt-role">Rol / Funcție</label>
                  <input type="text" id="abt-role" name="role" placeholder="Ex: Director, HR Manager..." autocomplete="organization-title" />
                </div>
              </div>
              <div class="hp-field" aria-hidden="true">
                <label for="abt-website">Website</label>
                <input type="text" id="abt-website" name="website" tabindex="-1" autocomplete="off" />
              </div>
              <div class="form-check">
                <input type="checkbox" id="abt-consent" name="consent" required />
                <label for="abt-consent">
                  Doresc să primesc actualizări despre AI și viitorul muncii.
                  Înțeleg că fără acordul meu nu voi primi framework-ul.
                </label>
              </div>
              <div class="form-submit-wrap">
                <button type="submit" class="btn btn-primary" id="abt-btn">
                  Vreau framework-ul
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                </button>
                <p class="form-privacy">Datele tale sunt în siguranță și nu vor fi distribuite terților.</p>
              </div>
              <div id="abt-form-msg" class="download-form-msg"></div>
            </form>
          </div>
        </div>
      </div>
    </section>

```

- [ ] **Step 4: Adaugă JS-ul de submit înainte de `</body>`**

După `<script src="../../js/main.js"></script>`:

```html
  <script>
    document.getElementById('abt-download-form').addEventListener('submit', async function(e) {
      e.preventDefault();
      const name    = document.getElementById('abt-name').value.trim();
      const email   = document.getElementById('abt-email').value.trim();
      const company = document.getElementById('abt-company').value.trim();
      const role    = document.getElementById('abt-role').value.trim();
      const website = document.getElementById('abt-website').value.trim();
      const consent = document.getElementById('abt-consent').checked;
      const btn     = document.getElementById('abt-btn');
      const msg     = document.getElementById('abt-form-msg');
      if (!name || !email || !consent) {
        msg.className = 'download-form-msg error';
        msg.textContent = 'Te rugăm completează câmpurile obligatorii și bifează acordul.';
        return;
      }
      btn.disabled = true;
      btn.textContent = 'Se trimite...';
      msg.className = 'download-form-msg';
      gtag('event', 'form_submit', { event_category: 'download', event_label: 'ai-business-translator' });
      try {
        const res = await fetch('/api/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resource: 'ai-business-translator', name, email, company, role, website })
        });
        const data = await res.json();
        if (res.ok) {
          msg.className = 'download-form-msg success';
          msg.innerHTML = 'Mulțumim! Framework-ul a fost trimis pe email. Verifică și în folderul de spam.';
          this.reset();
          btn.textContent = 'Trimis! ✓';
          gtag('event', 'pdf_download', { event_category: 'conversion', event_label: 'ai-business-translator' });
        } else { throw new Error(data.message || 'Eroare la trimitere'); }
      } catch (err) {
        msg.className = 'download-form-msg error';
        msg.textContent = 'Ceva nu a mers. Încearcă din nou sau scrie la contact@upvance.global';
        btn.disabled = false;
        btn.innerHTML = 'Vreau framework-ul <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>';
      }
    });
  </script>
```

- [ ] **Step 5: Verificare vizuală locală**

Deschide fișierul în browser (sau servește local) și verifică: butonul din header sare la `#descarca`, formul arată on-brand (lavender, card-uri), honeypot-ul e invizibil, validarea client-side afișează mesajul de eroare când lipsesc câmpuri.

- [ ] **Step 6: Commit**

```powershell
git -C "C:\Users\keimy\.claude\website_rp" add frameworks/ai-business-translator/index.html
git -C "C:\Users\keimy\.claude\website_rp" commit -m "Add gated download form to AI Business Translator framework page"
```

---

### Task 4: Snippet Apps Script (manual, pentru Raluca)

**Files:** niciun fișier în repo — snippet livrat în chat.

- [ ] **Step 1: Livrează în chat instrucțiunile + snippet-ul**

Instrucțiuni pentru Raluca (de livrat la final, în chat):
1. Deschide Sheet-ul de lead-uri viitoruri → adaugă coloana `Sursa` la finalul header-ului.
2. Extensions → Apps Script → în funcția `doPost`, acolo unde se construiește rândul (`appendRow([...])`), adaugă la final: `data.sursa || 'viitoruri'`.
3. Deploy → Manage deployments → Edit → New version → Deploy (URL-ul rămâne același).

Până la acest update, câmpul `sursa` trimis de API e pur și simplu ignorat — nimic nu se strică.

---

### Task 5: Deploy + verificare live

- [ ] **Step 1: Deploy** — cu acordul Ralucăi, folosind skill-ul `/deploy` (git push + verificare live, conform CLAUDE.md).

- [ ] **Step 2: Verificare live după deploy:**
- `https://ralucapaduraru.ro/frameworks/ai-business-translator/` conține secțiunea `#descarca`.
- `https://ralucapaduraru.ro/downloads/ai-business-translator-framework.pdf` răspunde 200.
- Submit de test cu un email real al Ralucăi → emailul de livrare ajunge, link-ul PDF din email funcționează.
- Notificarea „Nou download AI Business Translator" ajunge la raluca@upvance.global.
- Regression /viitoruri: submit de test pe formul existent → emailul raportului ajunge neschimbat.
- După update-ul Apps Script: rândul apare în Sheets cu `sursa` corectă.
