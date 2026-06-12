# Form gated de download — AI Business Translator Framework

**Data:** 2026-06-12
**Status:** Aprobat de Raluca (design verbal), în implementare

## Scop

Captare lead (nume, email, companie, rol) pe pagina `/frameworks/ai-business-translator/` în schimbul PDF-ului „AI Business Translator Framework". Mecanism identic cu /viitoruri: formul trimite datele la API, PDF-ul ajunge pe email.

## Decizii luate

- **Livrare:** pe email, ca la /viitoruri (validează adresa, lead curat).
- **Câmpuri:** identice cu /viitoruri — Nume*, Email*, Companie, Rol + checkbox consimțământ.
- **Lead-uri:** același Google Sheet ca viitoruri, cu câmp nou `sursa` (`viitoruri` / `ai-business-translator`).
- **Backend:** extindem `api/download.js` existent (nu endpoint nou) — map `RESOURCES` per resursă.

## Componente

### 1. PDF
- Sursă: `C:\Users\keimy\wiki\frameworks\AI Business Translator Framework.pdf` (146 KB)
- Destinație: `downloads/ai-business-translator-framework.pdf` (URL-safe, lowercase)
- Link-ul direct rămâne tehnic public dar nu se afișează nicăieri pe site (nici în schema JSON-LD).

### 2. Frontend — `frameworks/ai-business-translator/index.html`
- Secțiune nouă `#descarca` înainte de footer CTA: heading + form.
- Markup și CSS portate din `viitoruri.html` (`.download-form`, `.form-field`, `.form-check`, `.download-form-msg`), adaptate la tokenii paginii.
- Honeypot: input ascuns (ex. `name="website"`, `tabindex="-1"`, `autocomplete="off"`, poziționat off-screen); dacă e completat, API-ul respinge.
- JS: submit → `POST /api/download` cu `{ resource: 'ai-business-translator', name, email, company, role, website }`.
- Mesaje succes/eroare în română, identice ca stil cu viitoruri.
- CTA-urile existente pe pagină primesc link ancoră spre `#descarca` unde are sens.
- GA: `gtag('event','form_submit', {event_category:'download', event_label:'ai-business-translator'})` la submit și `pdf_download` la succes.

### 3. Backend — `api/download.js`
- Map `RESOURCES` cu config per resursă:
  - `viitoruri` (default când `resource` lipsește — comportament neschimbat): PDF, subiect și template existente.
  - `ai-business-translator`: PDF nou, subiect „Framework-ul tău: AI Business Translator", template email adaptat (același schelet vizual: header Upvance, CTA lavender `#9B8AF0`, invitație de reply, P.S. cu link booking, footer cu sursa formularului).
- `resource` necunoscut → 400.
- Honeypot completat → răspuns 200 fals (nu dăm indicii boților), fără email.
- Notificare către `raluca@upvance.global`: subiect `Nou download AI Business Translator: {name} ({company})`.
- Payload Apps Script: se adaugă `sursa` la obiectul existent `{nume, prenume, email, rol, companie}`.

### 4. Apps Script (manual, în afara repo-ului)
- Coloană nouă `Sursa` în Sheet + o linie în script care scrie `data.sursa || 'viitoruri'`.
- Claude livrează snippet-ul exact; Raluca îl lipește în editorul Apps Script și re-deployează.
- Până la update, câmpul e ignorat fără efecte negative.

### 5. Verificare (după deploy)
- Fetch pagina live → secțiunea există.
- Submit test cu email real → emailul de livrare ajunge, link-ul PDF funcționează.
- Notificarea către Raluca ajunge.
- Rândul apare în Sheets (cu sursă, după update-ul Apps Script).
- Regression: formul /viitoruri funcționează neschimbat.

## Erori
- Email invalid / nume lipsă → 400 cu mesaj în română (logică existentă, neschimbată).
- Resend eșuează → 500, mesaj „Încearcă din nou".
- Apps Script / notificare eșuează → ignorat (non-critic), emailul către lead are prioritate.

## Out of scope
- Download instant în browser.
- Gating pentru celelalte framework-uri (rămân cu link direct).
- Schema.org update cu URL-ul PDF (intenționat omis — nu expunem link-ul).
