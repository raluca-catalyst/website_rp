# Contact Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a `/contact` page on ralucapaduraru.ro with contact details and a form that emails Raluca at raluca@upvance.global with subject "HOT LEAD!" via the Resend API.

**Architecture:** Static `contact.html` page with an inline `fetch` call to a Vercel serverless function at `api/contact.js`. The function validates required fields and sends a formatted email via the Resend SDK. All nav links across the site that currently point to `mailto:` for Contact get updated to `contact.html`.

**Tech Stack:** Vanilla HTML/CSS/JS, Vercel serverless functions (Node.js), Resend SDK v4, existing `css/style.css` + `js/main.js`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `api/contact.js` | Create | Vercel serverless function — validate POST body, send email via Resend |
| `contact.html` | Create | Contact page — contact info + form, full site template |
| `css/style.css` | Modify | Add `.contact-*` styles for the two-column layout, form fields, checkboxes, states |
| `vercel.json` | Modify | Add `/contact` → `/contact.html` rewrite |
| `about.html`, `faq.html`, `impact.html`, `reflectii.html`, + 11 others | Modify | Replace `mailto:` Contact nav links with `contact.html` |

---

## Task 1: Vercel Serverless Function — `api/contact.js`

**Files:**
- Create: `api/contact.js`

- [ ] **Step 1: Create the file**

```js
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  // Only accept POST
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
  } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !role || !company || !message || !gdpr) {
    return res.status(400).json({ error: 'Câmpuri obligatorii lipsă.' });
  }

  // Format contact preferences
  const prefsLabel = Array.isArray(contactPrefs) && contactPrefs.length > 0
    ? contactPrefs.join(', ')
    : 'Nicio preferință selectată';

  const newsletterLabel = newsletter ? 'Da' : 'Nu';

  const emailBody = `
<h2 style="color:#00D4FF;font-family:Inter,sans-serif;margin:0 0 24px">HOT LEAD! — Formular de contact</h2>
<table style="font-family:Inter,sans-serif;font-size:15px;color:#333;border-collapse:collapse;width:100%">
  <tr><td style="padding:8px 16px 8px 0;color:#666;font-weight:600;white-space:nowrap">Nume</td><td style="padding:8px 0">${escapeHtml(name)}</td></tr>
  <tr><td style="padding:8px 16px 8px 0;color:#666;font-weight:600;white-space:nowrap">E-mail</td><td style="padding:8px 0">${escapeHtml(email)}</td></tr>
  <tr><td style="padding:8px 16px 8px 0;color:#666;font-weight:600;white-space:nowrap">Telefon</td><td style="padding:8px 0">${escapeHtml(phone)}</td></tr>
  <tr><td style="padding:8px 16px 8px 0;color:#666;font-weight:600;white-space:nowrap">Rol</td><td style="padding:8px 0">${escapeHtml(role)}</td></tr>
  <tr><td style="padding:8px 16px 8px 0;color:#666;font-weight:600;white-space:nowrap">Companie</td><td style="padding:8px 0">${escapeHtml(company)}</td></tr>
  <tr><td style="padding:8px 16px 8px 0;color:#666;font-weight:600;white-space:nowrap">Prefer să fiu contactat prin</td><td style="padding:8px 0">${escapeHtml(prefsLabel)}</td></tr>
  <tr><td style="padding:8px 16px 8px 0;color:#666;font-weight:600;white-space:nowrap">Abonat newsletter</td><td style="padding:8px 0">${newsletterLabel}</td></tr>
</table>
<h3 style="font-family:Inter,sans-serif;color:#333;margin:24px 0 8px">Mesaj</h3>
<p style="font-family:Inter,sans-serif;font-size:15px;color:#333;white-space:pre-wrap;background:#f5f5f5;padding:16px;border-radius:8px">${escapeHtml(message)}</p>
`.trim();

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

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
```

- [ ] **Step 2: Verify the file was created**

Run: `ls api/`
Expected: `contact.js` appears

- [ ] **Step 3: Commit**

```bash
git add api/contact.js
git commit -m "feat: add /api/contact serverless function via Resend"
```

---

## Task 2: Contact Page CSS — `css/style.css`

**Files:**
- Modify: `css/style.css` (append at end, before the final `@media` blocks — actually append after line 1000 `/* RESPONSIVE */`)

- [ ] **Step 1: Append contact page styles to `css/style.css`**

Add the following block just before the `/* ============================\n   RESPONSIVE` comment (currently around line 1001):

```css
/* ============================
   CONTACT PAGE
   ============================ */
.contact-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 64px;
  align-items: start;
}
.contact-info {
  position: sticky;
  top: 120px;
}
.contact-info h2 {
  font-size: 1.3rem;
  margin-bottom: 24px;
}
.contact-detail {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
.contact-detail-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(0,212,255,0.08);
  border: 1px solid rgba(0,212,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.contact-detail-icon svg { color: var(--cyan); }
.contact-detail-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.contact-detail-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.contact-detail-value {
  font-size: 0.95rem;
  color: var(--text);
  font-weight: 500;
}
.contact-detail-value a {
  color: var(--text);
  transition: color var(--transition);
}
.contact-detail-value a:hover { color: var(--cyan); }

/* Form */
.contact-form-wrap {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 40px;
}
.contact-form-intro {
  margin-bottom: 32px;
}
.contact-form-intro p {
  font-size: 1rem;
  color: var(--text-sec);
  line-height: 1.65;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}
.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-sec);
  letter-spacing: 0.02em;
}
.form-group label .required-star {
  color: var(--magenta);
  margin-left: 2px;
}
.form-group input,
.form-group textarea {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-family: var(--font-body);
  font-size: 0.95rem;
  padding: 12px 16px;
  transition: border-color var(--transition), box-shadow var(--transition);
  outline: none;
  width: 100%;
}
.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--text-muted);
}
.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--cyan);
  box-shadow: 0 0 0 3px rgba(0,212,255,0.08);
}
.form-group textarea {
  resize: vertical;
  min-height: 140px;
  line-height: 1.6;
}
.form-section-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-sec);
  margin-bottom: 12px;
  letter-spacing: 0.02em;
}
.form-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}
.form-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  position: relative;
}
.form-checkbox input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.form-checkbox-box {
  width: 20px;
  height: 20px;
  min-width: 20px;
  border: 1px solid var(--border-alt);
  border-radius: 5px;
  background: var(--surface);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
  margin-top: 1px;
}
.form-checkbox input[type="checkbox"]:checked + .form-checkbox-box {
  background: var(--cyan);
  border-color: var(--cyan);
}
.form-checkbox input[type="checkbox"]:checked + .form-checkbox-box svg {
  display: block;
}
.form-checkbox-box svg {
  display: none;
  color: #000;
  flex-shrink: 0;
}
.form-checkbox input[type="checkbox"]:focus-visible + .form-checkbox-box {
  box-shadow: 0 0 0 3px rgba(0,212,255,0.25);
}
.form-checkbox-text {
  font-size: 0.9rem;
  color: var(--text-sec);
  line-height: 1.5;
}
.form-checkbox-text a {
  color: var(--cyan);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.form-divider {
  height: 1px;
  background: var(--border);
  margin: 24px 0;
}
.form-submit-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
  flex-wrap: wrap;
}
.form-status {
  font-size: 0.9rem;
  display: none;
}
.form-status.success {
  display: block;
  color: var(--lime);
}
.form-status.error {
  display: block;
  color: var(--magenta);
}
.btn-submit {
  background: var(--cyan);
  color: #000;
  box-shadow: 0 0 30px rgba(0,212,255,0.3);
  position: relative;
}
.btn-submit:hover {
  background: #00e8ff;
  box-shadow: 0 0 50px rgba(0,212,255,0.5);
  transform: translateY(-2px);
}
.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 900px) {
  .contact-layout {
    grid-template-columns: 1fr;
  }
  .contact-info {
    position: static;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 600px) {
  .contact-form-wrap {
    padding: 24px 20px;
  }
}
```

- [ ] **Step 2: Verify styles appended correctly**

Check that the file ends with the new block and the responsive breakpoints still close properly (no unclosed braces).

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "feat: add contact page styles to style.css"
```

---

## Task 3: Create `contact.html`

**Files:**
- Create: `contact.html`

- [ ] **Step 1: Create the file**

```html
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="author" content="Raluca Păduraru" />
  <meta name="robots" content="index, follow" />
  <title>Contact — Raluca Păduraru</title>

<!-- 1. Google Consent Mode defaults (must be FIRST) -->
<script data-cookieconsent="ignore">
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag("consent", "default", {
        ad_personalization: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        analytics_storage: "denied",
        functionality_storage: "denied",
        personalization_storage: "denied",
        security_storage: "granted",
        wait_for_update: 500,
    });
    gtag("set", "ads_data_redaction", true);
    gtag("set", "url_passthrough", false);
</script>

<!-- 2. Cookiebot CMP -->
<script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="8f162324-b38d-4877-916f-0a08bd2fa970" type="text/javascript"></script>

<!-- 2b. Cookiebot → GA consent update -->
<script>
  function updateGAConsent() {
    if (typeof Cookiebot === 'undefined') return;
    gtag('consent', 'update', {
      ad_personalization:      Cookiebot.consent.marketing   ? 'granted' : 'denied',
      ad_storage:              Cookiebot.consent.marketing   ? 'granted' : 'denied',
      ad_user_data:            Cookiebot.consent.marketing   ? 'granted' : 'denied',
      analytics_storage:       Cookiebot.consent.statistics  ? 'granted' : 'denied',
      functionality_storage:   Cookiebot.consent.preferences ? 'granted' : 'denied',
      personalization_storage: Cookiebot.consent.preferences ? 'granted' : 'denied',
    });
  }
  window.addEventListener('CookiebotOnAccept',       updateGAConsent, false);
  window.addEventListener('CookiebotOnDecline',      updateGAConsent, false);
  window.addEventListener('CookiebotOnConsentReady', updateGAConsent, false);
</script>

<!-- 3. Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-HPPWXR6NTD"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-HPPWXR6NTD');
</script>

  <meta name="description" content="Contactează-o pe Raluca Păduraru pentru training AI, strategie sau foresight. Completează formularul sau scrie direct la raluca@upvance.global." />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="ro_RO" />
  <meta property="og:site_name" content="Raluca Păduraru" />
  <meta property="og:title" content="Contact — Raluca Păduraru" />
  <meta property="og:description" content="Contactează-o pe Raluca Păduraru pentru training AI, strategie sau foresight." />
  <meta property="og:url" content="https://ralucapaduraru.ro/contact" />
  <meta property="og:image" content="https://ralucapaduraru.ro/images/portrait.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Contact — Raluca Păduraru" />
  <meta name="twitter:description" content="Contactează-o pe Raluca Păduraru pentru training AI, strategie sau foresight." />
  <meta name="twitter:image" content="https://ralucapaduraru.ro/images/portrait.png" />
  <link rel="canonical" href="https://ralucapaduraru.ro/contact" />
  <link rel="icon" type="image/png" href="/images/logo.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" />
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>

  <!-- ====================== NAVIGATION ====================== -->
  <nav class="nav" id="nav" aria-label="Main navigation">
    <div class="container nav-inner">
      <a href="index.html" class="nav-logo" aria-label="Raluca Păduraru home">
        <img src="images/logo.png" alt="RP Logo" />
      </a>
      <ul class="nav-links" role="list">
        <li><a href="index.html#services">Servicii</a></li>
        <li><a href="index.html#frameworks">Framework-uri</a></li>
        <li><a href="about.html">Despre</a></li>
        <li><a href="faq.html">FAQ</a></li>
        <li><a href="impact.html">Impact</a></li>
        <li><a href="reflectii.html">Reflecții</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
      <div class="nav-right">
        <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Mobile Menu -->
  <nav class="mobile-menu" id="mobile-menu" aria-label="Mobile navigation">
    <a href="index.html#services">Servicii</a>
    <a href="index.html#frameworks">Framework-uri</a>
    <a href="about.html">Despre</a>
    <a href="faq.html">FAQ</a>
    <a href="impact.html">Impact</a>
    <a href="reflectii.html">Reflecții</a>
    <a href="contact.html">Contact</a>
  </nav>

  <main>

    <!-- ====================== PAGE HEADER ====================== -->
    <header class="page-header">
      <div class="container">
        <h1>Contact</h1>
        <p>Scrie-mi direct sau completează formularul de mai jos.</p>
      </div>
    </header>

    <!-- ====================== CONTACT SECTION ====================== -->
    <section class="section" aria-label="Contact">
      <div class="container">
        <div class="contact-layout">

          <!-- Left column: contact info -->
          <aside class="contact-info fade-up">
            <h2>Date de contact</h2>

            <div class="contact-detail">
              <div class="contact-detail-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div class="contact-detail-text">
                <span class="contact-detail-label">E-mail</span>
                <span class="contact-detail-value">
                  <a href="mailto:raluca@upvance.global">raluca@upvance.global</a>
                </span>
              </div>
            </div>

            <div class="contact-detail">
              <div class="contact-detail-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 5.55 5.55l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div class="contact-detail-text">
                <span class="contact-detail-label">Telefon</span>
                <span class="contact-detail-value">
                  <a href="tel:+40766441476">+40.766.441.476</a>
                </span>
              </div>
            </div>
          </aside>

          <!-- Right column: form -->
          <div class="contact-form-wrap fade-up delay-2">
            <div class="contact-form-intro">
              <p>Completează acest formular dacă vrei să mă contactezi sau să afli mai multe despre programele pe care le susțin. Toate câmpurile sunt obligatorii, mai puțin bifele de la final.</p>
            </div>

            <form id="contact-form" novalidate>

              <div class="form-row">
                <div class="form-group">
                  <label for="cf-name">Numele tău <span class="required-star">*</span></label>
                  <input type="text" id="cf-name" name="name" placeholder="Prenume Nume" required autocomplete="name" />
                </div>
                <div class="form-group">
                  <label for="cf-email">Adresa ta de e-mail <span class="required-star">*</span></label>
                  <input type="email" id="cf-email" name="email" placeholder="tu@companie.ro" required autocomplete="email" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="cf-phone">Numărul tău de telefon <span class="required-star">*</span></label>
                  <input type="tel" id="cf-phone" name="phone" placeholder="+40 700 000 000" required autocomplete="tel" />
                </div>
                <div class="form-group">
                  <label for="cf-role">Rolul tău actual <span class="required-star">*</span></label>
                  <input type="text" id="cf-role" name="role" placeholder="ex. HR Manager" required />
                </div>
              </div>

              <div class="form-group">
                <label for="cf-company">Compania în cadrul căreia activezi <span class="required-star">*</span></label>
                <input type="text" id="cf-company" name="company" placeholder="Numele companiei" required autocomplete="organization" />
              </div>

              <div class="form-group">
                <label for="cf-message">Mesajul tău <span class="required-star">*</span></label>
                <textarea id="cf-message" name="message" placeholder="Spune-mi cu ce te pot ajuta..." required></textarea>
              </div>

              <div class="form-divider"></div>

              <div class="form-section-label">Cum preferi să te contactez?</div>
              <div class="form-checkboxes">
                <label class="form-checkbox">
                  <input type="checkbox" name="contactPrefs" value="Telefon" />
                  <span class="form-checkbox-box">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="2,6 5,9 10,3"/></svg>
                  </span>
                  <span class="form-checkbox-text">Telefon</span>
                </label>
                <label class="form-checkbox">
                  <input type="checkbox" name="contactPrefs" value="E-mail" />
                  <span class="form-checkbox-box">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="2,6 5,9 10,3"/></svg>
                  </span>
                  <span class="form-checkbox-text">E-mail</span>
                </label>
                <label class="form-checkbox">
                  <input type="checkbox" name="contactPrefs" value="WhatsApp" />
                  <span class="form-checkbox-box">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="2,6 5,9 10,3"/></svg>
                  </span>
                  <span class="form-checkbox-text">WhatsApp</span>
                </label>
              </div>

              <div class="form-divider"></div>

              <div class="form-checkboxes">
                <label class="form-checkbox">
                  <input type="checkbox" id="cf-gdpr" name="gdpr" required />
                  <span class="form-checkbox-box">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="2,6 5,9 10,3"/></svg>
                  </span>
                  <span class="form-checkbox-text">Sunt de acord să folosești datele mele de contact ca să mă contactezi în vederea rezolvării mesajului pe care ți l-am trimis. <span class="required-star" style="color:var(--magenta)">*</span></span>
                </label>
                <label class="form-checkbox">
                  <input type="checkbox" id="cf-newsletter" name="newsletter" />
                  <span class="form-checkbox-box">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="2,6 5,9 10,3"/></svg>
                  </span>
                  <span class="form-checkbox-text">Sunt de acord să folosești datele mele de contact ca să mă înscrii la newsletter-ul bi-lunar The Leadership Catalyst.</span>
                </label>
              </div>

              <div class="form-submit-row">
                <button type="submit" class="btn btn-submit" id="cf-submit">
                  Trimite formularul
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
                <span class="form-status" id="cf-status" role="alert" aria-live="polite"></span>
              </div>

            </form>
          </div>

        </div>
      </div>
    </section>

  </main>

  <!-- ====================== FOOTER ====================== -->
  <footer>
    <div class="container">
      <div class="footer-inner">
        <div class="footer-left">
          <a href="index.html" class="footer-logo">
            <img src="images/logo.png" alt="Raluca Păduraru" />
          </a>
          <p class="footer-copy">© 2026 Raluca Păduraru. All rights reserved.</p>
        </div>
        <nav class="footer-links" aria-label="Footer navigation">
          <a href="https://www.linkedin.com/in/paduraru-raluca/" target="_blank" rel="noopener">LinkedIn</a>
          <a href="https://ralucapaduraru.substack.com/" target="_blank" rel="noopener">Newsletter</a>
          <a href="mailto:raluca@upvance.global">Email</a>
          <a href="about.html">Despre</a>
          <a href="faq.html">FAQ</a>
          <a href="impact.html">Impact</a>
          <a href="reflectii.html">Reflecții</a>
          <a href="contact.html">Contact</a>
        </nav>
      </div>
    </div>
  </footer>

  <script src="js/main.js"></script>
  <script>
  (function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('cf-submit');
    const status = document.getElementById('cf-status');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear status
      status.className = 'form-status';
      status.textContent = '';

      // Collect values
      const name    = form.querySelector('#cf-name').value.trim();
      const email   = form.querySelector('#cf-email').value.trim();
      const phone   = form.querySelector('#cf-phone').value.trim();
      const role    = form.querySelector('#cf-role').value.trim();
      const company = form.querySelector('#cf-company').value.trim();
      const message = form.querySelector('#cf-message').value.trim();
      const gdpr    = form.querySelector('#cf-gdpr').checked;
      const newsletter = form.querySelector('#cf-newsletter').checked;
      const contactPrefs = Array.from(
        form.querySelectorAll('input[name="contactPrefs"]:checked')
      ).map(cb => cb.value);

      // Client-side required field check
      if (!name || !email || !phone || !role || !company || !message) {
        status.textContent = 'Te rog completează toate câmpurile obligatorii.';
        status.className = 'form-status error';
        return;
      }
      if (!gdpr) {
        status.textContent = 'Acordul de utilizare a datelor de contact este obligatoriu.';
        status.className = 'form-status error';
        return;
      }

      // Disable button while sending
      submitBtn.disabled = true;
      submitBtn.textContent = 'Se trimite...';

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, role, company, message, gdpr, newsletter, contactPrefs }),
        });

        const data = await res.json();

        if (res.ok && data.ok) {
          status.textContent = 'Mesajul a fost trimis! Te contactez în curând.';
          status.className = 'form-status success';
          form.reset();
        } else {
          status.textContent = data.error || 'A apărut o eroare. Încearcă din nou sau scrie direct la raluca@upvance.global.';
          status.className = 'form-status error';
        }
      } catch (err) {
        status.textContent = 'A apărut o eroare de rețea. Încearcă din nou sau scrie direct la raluca@upvance.global.';
        status.className = 'form-status error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Trimite formularul <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
      }
    });
  })();
  </script>
</body>
</html>
```

- [ ] **Step 2: Verify the file exists**

Run: `ls | grep contact`
Expected: `contact.html`

- [ ] **Step 3: Commit**

```bash
git add contact.html
git commit -m "feat: add contact.html page with contact info and form"
```

---

## Task 4: Update `vercel.json` — Add `/contact` rewrite

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1: Add rewrite rule**

Current `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/viitoruri", "destination": "/viitoruri.html" }
  ],
  ...
}
```

Updated `rewrites` array:
```json
"rewrites": [
  { "source": "/viitoruri", "destination": "/viitoruri.html" },
  { "source": "/contact",   "destination": "/contact.html"   }
]
```

- [ ] **Step 2: Verify JSON is valid**

Run: `node -e "require('./vercel.json'); console.log('OK')"`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "feat: add /contact URL rewrite to vercel.json"
```

---

## Task 5: Update Nav Links in All HTML Files

**Files (15 files):** `about.html`, `faq.html`, `impact.html`, `reflectii.html`, `romania-ai-viteza-fara-centura.html`, `riscul-ai-imm-guvernanta.html`, `context-personal-ai-3-fisiere.html`, `ai-industrie-productie-romania.html`, `romania-irelevanta-era-ai.html`, `resources/ai-evolution-arc/index.html`, `resources/blueprint-ai-fluency/index.html`, `resources/state-of-ai-romania/index.html`, `frameworks/model-framework/index.html`, `frameworks/4d-framework/index.html`, `frameworks/force-matrix/index.html`

- [ ] **Step 1: Replace nav Contact links in all files**

In each file, replace:
```html
<li><a href="mailto:raluca@upvance.global">Contact</a></li>
```
with:
```html
<li><a href="/contact">Contact</a></li>
```

And in mobile menus, replace:
```html
<a href="mailto:raluca@upvance.global">Contact</a>
```
with:
```html
<a href="/contact">Contact</a>
```

> Note: Files in subdirectories (`resources/*/index.html`, `frameworks/*/index.html`) use the same patterns — verify with grep after.

> **Why `/contact` not `contact.html`**: Root-relative paths work from any depth in the directory tree. Relative paths would break in subdirectories.

- [ ] **Step 2: Verify no `mailto` Contact links remain in nav**

Run:
```bash
grep -r 'mailto:raluca@upvance.global.*>Contact<' --include="*.html" .
```
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add about.html faq.html impact.html reflectii.html romania-ai-viteza-fara-centura.html riscul-ai-imm-guvernanta.html context-personal-ai-3-fisiere.html ai-industrie-productie-romania.html romania-irelevanta-era-ai.html resources/ai-evolution-arc/index.html resources/blueprint-ai-fluency/index.html resources/state-of-ai-romania/index.html frameworks/model-framework/index.html frameworks/4d-framework/index.html frameworks/force-matrix/index.html
git commit -m "fix: update Contact nav links to /contact page across all pages"
```

---

## Task 6: Set `RESEND_API_KEY` in Vercel

This is a manual step (cannot be automated via code).

- [ ] **Step 1: Tell Raluca to add the env var**

In the Vercel dashboard for `ralucapaduraru.ro`:
1. Go to **Settings → Environment Variables**
2. Add: `RESEND_API_KEY` = (the Resend API key from resend.com dashboard)
3. Set environment: **Production** (and optionally Preview)
4. Save and redeploy

---

## Self-Review Checklist

**Spec coverage:**
- Contact info (email + phone) on the page — Task 3
- Form with all required short fields — Task 3
- Textarea for message — Task 3
- Contact preference checkboxes (Telefon, E-mail, WhatsApp) — Task 3
- GDPR required checkbox — Task 3
- Newsletter optional checkbox — Task 3
- Submit button — Task 3
- Email to `raluca@upvance.global` with "HOT LEAD!" subject — Task 1
- All form data in email body — Task 1
- Look & feel matches rest of site — Tasks 2 + 3
- Nav links updated — Task 5
- `/contact` URL works — Task 4
- Env var documented — Task 6

**No gaps found.**
