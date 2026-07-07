# Design: redesign secțiuni Produse + Despre (ralucapaduraru.ro)

Data: 7 iulie 2026. Status: **în lucru**. Sesiune de brainstorming cu Raluca, se continuă a doua zi.

## Stadiu

- [x] Decizii strategice luate (vezi mai jos)
- [x] Design secțiunea Produse aprobat cu corecții de voce (integrate în acest doc)
- [ ] Copy final Produse: de validat cu Raluca pe textul din acest doc
- [ ] Design pagina Despre: schelet aprobat, copy-ul narativ NU e încă scris
- [ ] Implementare (abia după aprobarea copy-ului)

## Decizii luate (7 iulie)

1. **Naming:** rămâne „AI Agency for Leaders" / „AI Agency for Teams", cu subtitlu în română care fixează sensul: „discernământ și capacitate de acțiune cu AI".
2. **Produsele vechi se topesc în cele noi:** AI Strategy Session → AI Agency for Leaders; AI Fluency for Business → AI Agency for Teams. Secțiunea are 3 produse.
3. **Foresight:** produs dedicat „Futures of Work Lab" + se păstrează stratul existent de sub produse („Fiecare produs începe de la cum va arăta industria ta în 3 ani..."). NU se ancorează în raportul 4 Viitoruri (raportul e perisabil, au trecut 3 luni, ex. industria de armament nu era prinsă). Ancora e contextul de scenarii: te pregătești azi pentru viitorul în care ai putea ajunge mâine. Ideea centrală: foresight nu îți spune în ce viitor ajungi, te pregătește indiferent de viitorul în care ajungi. Raportul rămâne doar ca dovadă, printre altele.
4. **Retainerul se șterge** complet (HTML + Service din schema.org).
5. **Workshop → laborator, strategie SEO hibridă:**
   - text vizibil pe site: doar „laborator" / „keynote"
   - meta title, meta description, schema.org: rămâne „workshop" (volumul de căutare)
   - un singur ancoraj on-page per pagină, natural: „laboratoare aplicate de AI (workshop-uri hands-on)"
   - citatele din testimoniale NU se modifică
6. **Fără nume de clienți** în copy (NDA-uri). Descriptori anonimi + cifre (ex: „program de 2 zile pentru management, NPS 14/14 de 10/10"). Raluca întreabă Zitec și Mirro pentru acord de menționare (răspuns în minim 2 săptămâni); numele se inserează ulterior, nu blochează lansarea.
7. **Scanare de piață nouă: nu acum.** Analiza competitivă e din 13 iunie, poziționarea-master din 2 iulie, ambele sub pragul de 6 săptămâni. Se rulează după lansare sau înainte de următorul pitch.
8. Sursa wiki neprocesată `foresight-scan-7.07.2026.md` rămâne pe mai târziu.

## Reguli de voce (corecții Raluca, obligatorii pentru tot copy-ul)

- Fără juxtapunere negativă ca hook: „Nu predau butoane...", „nu X, ci Y". Framing pozitiv.
- Fără em dash / cratimă lungă / „--" în copy-ul în română.
- Fără calcuri din engleză. Testul: fraza trebuie să sune natural spusă cu voce tare în română. („Predau butoane" nu există în română.)
- Fără formule numerice AI-sounding gen „X laboratoare, un fir roșu". Mai bine simplu.
- „Pentru leadership" / „pentru lideri", nu „pentru conducere".
- Framework-urile menționate se linkuiesc spre paginile lor: 4D → /frameworks/4d-framework/, M.O.D.E.L. → /frameworks/model-framework/, F.O.R.C.E. → /frameworks/force-matrix/.
- Regulile generale din poziționare: fără „fără hype, fără jargon" (luat de Leadder), fără „practic, aplicat, ROI imediat" (table-stakes), fără framing determinist.

## Poziționarea din spate (din wiki, iunie-iulie 2026)

- Cadranul liber în piața RO: **discernământ × foresight**. Toți cei 6 concurenți vând tool + prezent.
- Golurile de mesaj: (1) AI fluency e competență de management, nu de tool; (2) întrebarea e spre ce viitor al muncii te duce felul în care folosești AI; (3) partea grea e omul, nu tehnologia.
- Dovezi disponibile (anonimizate): NPS 14/14 de 10/10 pe program de 2 zile pentru management; 800+ ore livrate, 5.000+ profesioniști; Certified Foresight Practitioner (TFSX); raportul 4 Viitoruri 2030; framework-uri proprii.

## Secțiunea Produse (index.html, #services) — draft de validat

**Titlu secțiune:** „Produse și servicii" (rămâne simplu, decizie Raluca).

**Intro secțiune (draft):** „Toate pornesc de la aceeași competență: judecata cu care decizi ce delegi cu AI, ce verifici și ce rămâne la oameni."

### 1. AI Agency for Leaders — label: „Pentru leadership"

- **Subtitlu:** Discernământ și capacitate de acțiune cu AI pentru lideri. *(formulare dată de Raluca, verbatim)*
- **Pitch (draft):** Claritate pentru deciziile de AI din organizația ta: de unde începi, ce prioritizezi, ce eviți și cum conduci oamenii prin schimbare. Pleci cu direcție, priorități și un plan de acțiune.
- **Pentru cine:** antreprenori, directori de IMM-uri, echipe de leadership din companii mari.
- **Ce primiți:** preia din Strategy Session: diagnostic de maturitate AI, roadmap, plan de acțiune 90 de zile (de confirmat cu Raluca ce rămâne).
- **Format:** Keynote 1–2 ore · Laborator de la o jumătate de zi la 2 zile.

### 2. AI Agency for Teams — label: „Cel mai popular"

- **Subtitlu (draft):** Echipa ta rezolvă sarcini reale cu AI, cu discernământ.
- **Pitch:** preia substanța de la AI Fluency for Business: training configurat pe industria, rolurile și workflow-urile reale ale echipei; participanții pleacă cu sarcini reale rezolvate.
- **Ce primiți:** training pe rol cu framework-urile [4D](/frameworks/4d-framework/), [M.O.D.E.L.](/frameworks/model-framework/), [F.O.R.C.E.](/frameworks/force-matrix/) (cu linkuri).
- **Format:** Keynote 1–2 ore · Laborator de la o jumătate de zi la 2 zile.
- Se păstrează nota: adaptare 100% la context, standardele EU AI Act.

### 3. Futures of Work Lab — label: „Foresight"

- **Subtitlu (draft):** Felul în care folosești AI azi te duce spre un viitor anume al muncii. Foresight-ul te pregătește pentru oricare dintre ele.
- **Pitch (draft):** Cum te pregătești azi pentru viitorul în care ai putea ajunge mâine: scenarii de viitor pentru industria ta, semnale slabe de urmărit, playbook strategic pentru echipa de leadership.
- **Pentru cine:** echipe de leadership care iau acum decizii cu orizont de 2–5 ani.
- **Dovezi în copy:** Certified Foresight Practitioner (TFSX); raportul 4 Viitoruri menționat ca una dintre dovezi, nu ca ancoră.
- **Format:** Keynote 1–2 ore · Laborator 1–2 zile.

**Sub cele 3 produse:** se păstrează blocul „Fiecare produs începe de la cum va arăta industria ta în 3 ani și ce trebuie să faci azi ca să fii pregătit." + CTA „Hai să vorbim".

## Pagina Despre (about.html) — schelet aprobat, copy de scris

Pagină substanțial mai lungă (SEO + credibilitate), ton matur, pentru antreprenori și directori. Structura aprobată:

1. **Deschidere pe teritoriul liber:** ce lipsește din piața de training AI din România și de ce stă Raluca exact acolo (discernământ + direcție, nu tool-uri). Atenție la regulile de voce: framing pozitiv, fără contrast negativ.
2. **Traseul care o face credibilă, narativ:** 17 ani de management operațional, apoi foresight certificat, apoi AI fluency. Povestit, nu listat.
3. **Cum lucrează Raluca:** framework-uri proprii (linkuite), latura umană a transformării (MSc Counselling & Leadership), agency în loc de anxietate.
4. **Dovezi concrete, fără nume:** descriptori anonimi pe sectoare + cifrele (NPS, ore, profesioniști). Numele Zitec/Mirro se adaugă doar după acordul lor.
5. **Cifrele și credențialele existente** (secțiunile actuale rămân, eventual completate).

Meta title / description: păstrează „workshop" pentru SEO; textul vizibil folosește „laborator".

## Checklist implementare (după aprobarea copy-ului)

- [ ] index.html: rescrie #services (3 produse), șterge retainerul
- [ ] index.html: actualizează schema.org (șterge Service „Strategic Retainer", redenumește/redescrie celelalte Service-uri)
- [ ] Global: „workshop" → „laborator" în textul vizibil pe TOT site-ul (index, about, faq, impact, contact, pagini frameworks/resources), cu excepția: meta tags, schema.org, citate din testimoniale, câte un ancoraj on-page per pagină
- [ ] about.html: rescriere completă pe scheletul de mai sus + meta description extinsă
- [ ] Verificare: fără em dash, fără „nu X, ci Y", fără calcuri EN în tot copy-ul nou
- [ ] Edit-uri targetate per fișier (nu bulk sed), verificare după fiecare
- [ ] Fără push/deploy fără OK explicit pe varianta finală văzută de Raluca

## Următorii pași (sesiunea de mâine)

1. Raluca validează copy-ul draft de la Produse (secțiunea de mai sus).
2. Claude scrie copy-ul narativ pentru Despre pe scheletul aprobat, secțiune cu secțiune, cu review.
3. Plan de implementare (writing-plans), apoi implementare cu preview per fișier înainte de aplicare.
