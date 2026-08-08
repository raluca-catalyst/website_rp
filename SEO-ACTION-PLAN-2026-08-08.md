# Plan de acțiune SEO — ralucapaduraru.ro

**Generat:** 8 august 2026
**Raport:** SEO-AUDIT-2026-08-08.md

---

## CRITICAL — fix imediat, impact direct pe vânzare

### C1. Leagă Build Your Cortex și Summer Mentoring de site

Ambele sunt orfane. Minim trei intrări:

1. **Meniu principal** (index.html + toate paginile, nav și mobile-menu):
   `<li><a href="/build-your-cortex">Build Your Cortex</a></li>`

2. **Homepage, secțiunea de servicii** — card dedicat pentru ediția din 16 octombrie, cu link.

3. **Legături contextuale** din paginile tematice:
   - `frameworks/cadru/` și `frameworks/stratul-uman/` → Build Your Cortex (se învață acolo)
   - `frameworks/index.html` → Build Your Cortex
   - `about.html` → Summer Mentoring

Test după:
```
grep -rl "build-your-cortex" --include=*.html . | grep -v "^./build-your-cortex.html"
```
Trebuie să întoarcă cel puțin 3 fișiere. (Fără filtru, pagina se găsește pe ea însăși și testul trece degeaba.)

### C2. Schimbă bara de anunț pe Build Your Cortex

`js/main.js`, `injectAnnounceBar()` — textul actual promovează white paper-ul din aprilie.

Copy propus (de validat cu Raluca formularea exactă):
```
Build Your Cortex, ediția 2 — 16 octombrie, București. 14 locuri.
```
link: `/build-your-cortex`

**O singură operație, varianta HTML static** (rezolvă și M5 din iunie: shift de layout + bară invizibilă pentru crawleri):

1. Șterge complet `injectAnnounceBar()` din `js/main.js`.
2. Adaugă bara ca HTML static, prima în `<body>`, pe toate paginile publice **mai puțin** `build-your-cortex.html` (n-are sens să se promoveze pe ea însăși):
   ```html
   <div class="announce-bar"><a href="/build-your-cortex">Build Your Cortex, ediția 2 — 16 octombrie, București. 14 locuri.</a></div>
   ```
3. Adaugă `has-announce-bar` direct pe `<body>` în aceleași pagini (clasa era pusă din JS).

Nu păstra și JS-ul, și HTML-ul static — bara ar apărea de două ori.

### C3. Asset og:image dedicat, 1200×630

Creează `images/og-default.jpg` — 1200×630, sub 500 KB, JPG (nu WebP: scraperele de social îl citesc inconsecvent).

`images/portrait.png` (12,3 MB, 3750×3750) apare în **13 fișiere**, dar ca `og:image` în **11**. În celelalte 2 e referit din alt context — verifică fiecare înainte de înlocuire:
```
grep -rn "portrait.png" --include=*.html . | grep -v node_modules
```

Înlocuire pe cele 11 tag-uri `og:image`:
```html
<meta property="og:image" content="https://www.ralucapaduraru.ro/images/og-default.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
```

Același tratament pentru `images/frameworks.jpg` (3,48 MB, 10 tag-uri og:image) și `images/build.png` (5,73 MB, 2 tag-uri). Total: 23 de tag-uri `og:image` de înlocuit.

Verificare: LinkedIn Post Inspector pe 3 URL-uri după deploy.

---

## HIGH — săptămâna 1

### H1. Extinde cele 4 framework-uri subțiri la 1.200+ cuvinte web-native

Ordinea (după potențial de căutare și diferențiere):

1. `frameworks/model-framework/` — 753 cuvinte. Cel mai căutat, cel mai folosit în workshopuri.
2. `frameworks/force-matrix/` — 792
3. `frameworks/4d-framework/` — 440. Are și cârlig de conformitate (EU AI Act).
4. `frameworks/ai-business-translator/` — 703. E teza centrală de poziționare.

Structura care produce citări AI (model: pagina C.A.D.R.U., 1.495 cuvinte):
- Ce problemă rezolvă, în 2-3 propoziții citabile
- Fiecare literă cu secțiune proprie, `<h2>`, definiție + exemplu concret
- Un exemplu complet aplicat, de la început la final
- Când NU se aplică (domeniu de valabilitate)
- Ce se schimbă în rezultat față de fără framework

PDF-ul rămâne ca lead magnet, dar conținutul trebuie să existe și pe pagină.

### H2. Scurtează cele 12 meta descriptions peste 160 de caractere

Prioritate: about.html (244), frameworks/stratul-uman/ (246), frameworks/cadru/ (229), resources/eu-ai-act-checklist/ (226), frameworks/model-framework/ (220).

Regulă: diferențiatorul în primele 120 de caractere.

### H3. Rescrie meta description pe impact.html în română

Actuala e în engleză pe un site românesc. Propunere:
```
1.000+ ore de workshop AI, 5.500+ profesioniști formați, 30+ conferințe.
Comunitate, AIResponsabil.ro și parteneriate educaționale.
```

### H4. Elimină schema HowTo deprecată

- `resources/ai-evolution-arc/` — scoate `HowToStep`, păstrează `Article` + `BreadcrumbList`
- `resources/eu-ai-act-checklist/` — scoate `HowToStep`, păstrează `DigitalDocument` + `BreadcrumbList`
- `resources/blueprint-ai-fluency/` — scoate `HowToSection`, înlocuiește cu `ItemList`

### H5. Google Fonts non-blocant pe 30 de pagini

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?...&display=swap"
      onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?...&display=swap"></noscript>
```

Adaugă `&display=swap` în URL dacă lipsește.

Conform preferinței din CLAUDE.md: fără sed în masă. Edit țintit per fișier, cu verificare vizuală după fiecare.

---

## MEDIUM — săptămânile 2-4

### M1. Schema pe impact.html și contact.html

Ambele au zero JSON-LD. Minim `WebPage` + `BreadcrumbList`. Pe contact.html se poate adăuga și `ContactPage`.

### M2. width/height pe cele 83 de imagini fără dimensiuni

Prioritate pe imaginile above-the-fold din homepage și din paginile de produs (build-your-cortex, summer-mentoring), unde shift-ul de layout se vede.

### M3. Alinează sitemap-ul cu canonical-ul pe contact

În `sitemap.xml`: `https://www.ralucapaduraru.ro/contact.html` → `https://www.ralucapaduraru.ro/contact`

### M4. Închide downloads/romanian-state-of-ai-sumar-executiv.html

```html
<link rel="canonical" href="https://www.ralucapaduraru.ro/romanian-state-of-ai/">
<meta name="robots" content="noindex, follow">
```

### M5. Comprimă PDF-urile din downloads/

- state-of-ai.pdf: 26,5 MB → țintă sub 3 MB
- M.O.D.E.L. Framework.pdf: 20,6 MB → sub 2 MB
- viitoruri-2030.pdf: 18,4 MB → sub 3 MB

Cauza aproape sigură: imagini necomprimate la rezoluție de print. Afectează rata de finalizare a descărcării pe mobil.

### M6. Legături interne spre Stratul uman

Un singur link intern acum. Adaugă din homepage și din articolele despre viitorul muncii.

### M7. Intro editorial pe reflectii.html

150-200 de cuvinte: despre ce e secțiunea, pentru cine, cât de des apare, link spre newsletter. Pagina are acum 355 de cuvinte în total.

---

## LOW — backlog

### L1. OG tags pe privacy.html
Singura pagină publică fără.

### L2. Verifică al doilea H1 din viitoruri.html
E în `#phase-landing` cu `display:none`. Dacă textul diferă de primul, aliniază-le.

### L3. Extinde impact.html
309 cuvinte. Cea mai subțire pagină publică. Lista aparițiilor media cu linkuri reale (L9 din iunie, încă nefăcut) ar rezolva și E-E-A-T, și lungimea.

### L4. IndexNow pentru Bing
Din planul de iunie, nefăcut. Beneficiu real doar dacă publicarea devine mai frecventă.

---

## Ordine recomandată

**Ziua 1:** C1 + C2 — legături interne + bara de anunț. Cel mai mare impact pe vânzare, cel mai puțin efort.
**Ziua 2:** C3 — asset og:image + înlocuire pe 23 de pagini.
**Săptămâna 1:** H2 + H3 + H4 + H5 — meta descriptions, HowTo, fonturi.
**Săptămânile 2-4:** H1 — cele 4 framework-uri, câte unul pe săptămână.
**În paralel:** M1-M7.

---

## Ce se măsoară după

- Impresiuni în Search Console pe `/build-your-cortex` (acum: aproape sigur zero)
- Impresiuni pe paginile de framework extinse, la 4-6 săptămâni după publicare
- Rata de finalizare a descărcării PDF-urilor după compresie
- Preview-ul link-ului pe LinkedIn după fixul og:image

---

*Nicio modificare nu a fost aplicată. Fiecare fix se verifică în browser înainte de deploy.*
