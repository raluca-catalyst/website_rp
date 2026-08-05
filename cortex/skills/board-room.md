---
name: board-room
description: "Consiliul tău strategic virtual: 5 consilieri dezbat o decizie de business în două runde (poziții + contraargumente), votează și predau un dosar de decizie — un fișier .md + un one-pager HTML. Use when the user invokes /board-room, asks the board a question, or wants a decision debated. Triggers: /board-room, board room, boardroom, consiliul meu, întreabă consiliul, dezbate decizia, vreau mai multe perspective pe decizia asta, ce zice boardul."
---

# Board Room — Consiliul tău strategic virtual

## Pasul 0: Cortexul (unde trăiesc fișierele)

Toate fișierele board-ului (`board/consiliul-meu.md`, `board/context-board.md`, `board/decizii/`) se scriu în **folderul conectat al utilizatorului** (Cortexul lui), în subfolderul `board/`.

**Dacă nu există niciun folder conectat:** oprește-te și cere utilizatorului să conecteze un folder înainte de orice altceva. Fără folder conectat, consiliul și contextul dispar la finalul sesiunii și interviul s-ar relua de la zero data viitoare — exact ce vrem să evităm.

## Fișa de post

- **Misiune:** dezbate o decizie de business din mai multe perspective și predă un dosar vizual de decizie.
- **Ce primește:** o decizie reală, formulată într-o propoziție („intru sau nu pe piața X", „angajez sau externalizez Y") + contextul din Cortex.
- **Succes:** utilizatorul vede în dosar cel puțin un argument la care nu se gândise.
- **Eșec:** toți consilierii sunt de acord între ei; dosarul îi confirmă doar ce credea deja.

## Pasul 1: Consiliul

Componența consiliului trăiește în Cortexul utilizatorului, în fișierul `board/consiliul-meu.md`.

**Dacă fișierul există:** citește-l și folosește consilierii de acolo, ca atare. Utilizatorul poate cere oricând să schimbe sau să înlocuiască un consilier.

**Dacă fișierul NU există (prima rulare):** propune consiliul default de mai jos și întreabă utilizatorul, înainte de prima dezbatere:

> „Îți propun un consiliu de 5 roluri. Poți să le păstrezi așa, să le dai nume, sau să înlocuiești oricare cu o persoană reală a cărei gândire o admiri (un antreprenor, un autor, un fost șef bun). Pe cine vrei în consiliul tău?"

Consiliul default (roluri-arhetip):

1. **Financiarul sceptic** — gândește în cifre: cost, venit, marjă, cash. Cere calculul din spatele oricărui entuziasm. Bias: poate subestima valoarea care se construiește lent (brand, relații).
2. **Avocatul clientului** — gândește din scaunul celui care plătește: ce problemă îi rezolvi, de ce ar alege asta și ar plăti pentru ea. Bias: poate supraestima cât de mult le pasă clienților de detaliile interne.
3. **Operatorul pragmatic** — gândește în execuție: cine face, cât durează, ce se rupe primul când planul întâlnește realitatea. Bias: tendința de a reduce ambiția la ce e comod de livrat.
4. **Vizionarul** — gândește la 3 ani distanță: unde duce decizia asta, ce devine posibil dacă iese. Bias: optimism; subestimează drumul până acolo.
5. **Avocatul diavolului** — atacă asumpțiile nespuse din întrebare. Caută motivul pentru care planul eșuează și sunk cost-ul care ține decizia în viață. Bias: poate bloca decizii bune care au date incomplete.

Pentru fiecare persoană reală adăugată de utilizator: caută online și construiește un profil scurt (cum gândește, ce prioritizează, ce bias-uri are), arată-i-l utilizatorului, apoi salvează-l. Profilurile se cercetează O SINGURĂ DATĂ, la creare — la sesiunile următoare se folosesc din fișier.

La final scrie/actualizează `board/consiliul-meu.md` cu cei 5 consilieri și profilurile lor.

## Pasul 2: Contextul

Contextul de business al consiliului trăiește în Cortexul utilizatorului, în fișierul `board/context-board.md`.

**Dacă fișierul există:** citește-l + CLAUDE.md + folderele relevante pentru decizia curentă (obiective, clienți, cifre — ce există). Dacă pare vechi sau contrazice ce spune utilizatorul acum, întreabă ce s-a schimbat și actualizează fișierul.

**Dacă fișierul NU există (prima rulare): interviul de context.** Înainte de prima dezbatere, intervievezi utilizatorul — întrebările se pun UNA CÂTE UNA, aștepți răspunsul, iar la răspunsuri vagi ceri concretul („mult" nu e o cifră; „curând" nu e o dată).

Reguli de interviu:

- **Skip permis.** La început anunță: „Poți sări peste orice întrebare — zi «skip» și trecem mai departe." O întrebare sărită se marchează `[nerăspuns]` în fișier și se trece la următoarea, fără insistență.
- **Salvare incrementală.** După fiecare răspuns, actualizează `board/context-board.md` cu ce ai până acum, plus o secțiune „Interviu în curs" cu întrebările rămase. Dacă utilizatorul abandonează la mijloc, nimic nu se pierde — la sesiunea următoare, dacă fișierul are întrebări nerăspunse, reia DE ACOLO, nu de la început.
- **Prag minim: 6 din 11 răspunse** înainte de prima dezbatere. Sub prag, spune concret ce riscă: consilierii vor lucra pe estimări în loc de cifrele lui reale, iar dosarul va fi mai generic. Dacă insistă să continue sub prag, continuă, dar marchează în dosar că contextul e incomplet.

Cele 11 întrebări:

1. Descrie-mi businessul tău în 2-3 propoziții: ce vinzi, cui, și ce te face diferit.
2. Cum intră banii, concret? (produse/servicii, tarifele reale practicate, cine plătește)
3. Care a fost venitul pe ultimele 3 luni, aproximativ, și cât din el e recurent?
4. Care e obiectivul tău financiar pe 12 luni, în cifre?
5. Cine lucrează în business? (tu solo, angajați, colaboratori — și câte ore pe săptămână ai TU disponibile realist)
6. Cine sunt clienții tăi cei mai valoroși acum și de ce te aleg?
7. Care sunt cele mai mari 3 provocări ale businessului în acest moment?
8. Ce ai încercat deja și n-a mers? Ce ai învățat de acolo?
9. Unde simți că ai cel mai mare unghi mort — zona în care te-ar putea surprinde ceva?
10. Ce tip de decizii iei cel mai des și te consumă cel mai mult? (pricing, clienți noi, produse, timp, parteneriate)
11. Ce NU e negociabil pentru tine? (valori, limite de timp, tipuri de clienți sau de muncă refuzate)

**După interviu, finalizează `board/context-board.md`** (scris deja incremental pe parcurs): șterge secțiunea „Interviu în curs" dacă totul e răspuns, păstrează marcajele `[nerăspuns]` pentru ce a fost sărit, și organizează răspunsurile pe secțiuni (business & poziționare / cifre / echipă & capacitate / clienți / provocări & unghiuri moarte / non-negociabile). Arată-i utilizatorului fișierul și spune-i că orice sesiune viitoare de board pornește de aici — îl poate edita oricând.

**Regulă de ancorare:** scenariile și estimările din dezbatere se construiesc pe cifrele reale din context (tarife, venituri, targeturi). Unde nu există o cifră reală, consilierul spune explicit „estimare" și arată calculul.

## Pasul 3: RUNDA 1 — Pozițiile

Fiecare consilier, pe rând, își argumentează poziția față de decizie (300-600 de cuvinte fiecare), în vocea și logica profilului său. Fiecare poziție include obligatoriu:

- **Vot explicit: DA / NU / CONDIȚIONAT** (la CONDIȚIONAT, condiția e concretă și verificabilă). Un vot CONDIȚIONAT nu se numără nici la DA, nici la NU.
- **Cifre specifice:** cost estimat, venit potențial, efort, timeline — pe cifrele reale din Pasul 2
- **Două scenarii:** optimist și pesimist, cu ce le-ar declanșa pe fiecare

## Pasul 4: RUNDA 2 — Contraargumentele

După ce toate cele 5 poziții sunt scrise, fiecare consilier răspunde celorlalți (150-300 de cuvinte fiecare):

- Cu cine e cel mai puternic în dezacord și de ce, cu referire directă la argumentul celuilalt
- Dacă vreun argument din Runda 1 i-a schimbat perspectiva și în ce sens
- **VOTUL FINAL** — poate diferi de votul din Runda 1; schimbarea se justifică

## Pasul 5: Livrabilele

Construiește livrabilele pe rând, fișier cu fișier — întâi dosarul `.md` complet, abia apoi one-pager-ul HTML. Nu le genera pe amândouă dintr-o suflare.

Creează în Cortex folderul `board/decizii/[nume-scurt-decizie]/` cu două fișiere:

**1. `dosar.md` — Dosarul deciziei**
- Tabelul voturilor: Runda 1 vs. votul final, cu schimbările marcate. Scorul se raportează în formatul „X DA · Y NU · Z CONDIȚIONAT — cu condiția fiecăruia listată". Un CONDIȚIONAT devine DA doar dacă utilizatorul acceptă explicit condiția, iar asta se notează în dosar. Nicio variantă de „majoritate" nu include voturile CONDIȚIONAT.
- Consensul: unde sunt de acord toți sau majoritatea (CONDIȚIONAT nu se pune la socoteală)
- Tensiunea principală: cel mai mare dezacord și miza lui reală
- Argumentele esențiale, rezumate pe consilier
- Recomandarea consiliului + condițiile în care decizia ar fi probabil greșită
- Ce ar trebui aflat înainte de a decide (informația lipsă cu cea mai mare miză)

**2. `dosar.html` — Dashboardul interactiv**
Un singur fișier HTML, self-contained (tot CSS-ul și JS-ul inline, fără biblioteci externe), care se deschide direct în browser:
- Decizia, sus, într-o propoziție
- **Sliderele de ipoteze (obligatoriu — inima dashboardului):** 3-5 slidere pentru variabilele-cheie ale deciziei (ex: preț, număr de clienți/participanți, rată de conversie, ore investite — alege-le pe cele relevante pentru decizia ASTA), care recalculează dinamic, în JavaScript, proiecțiile de venit/cost/efort din scenariile dezbaterii. Valorile de pornire = cifrele reale din context. Utilizatorul trebuie să poată mișca un slider și să vadă instant cum se schimbă concluzia numerică.
- Cardurile celor 5 consilieri: rol, votul Runda 1 → votul final (schimbările marcate vizibil), argumentul esențial într-o frază, cel mai mare dezacord al lor
- Scorul final al voturilor, vizibil dintr-o privire, în formatul „X DA · Y NU · Z CONDIȚIONAT — cu condiția fiecăruia listată" (niciun CONDIȚIONAT nu intră în majoritate)
- Recomandarea + riscurile majore + „de aflat înainte să decizi"
- Stil: o singură familie de fonturi, o culoare de accent. Dacă utilizatorul are un brand definit în Cortex, folosește culorile lui.

La final, prezintă în conversație:

1. **Fișierele create, explicit** — calea completă a fiecăruia (`board/decizii/[nume]/dosar.md` și `dosar.html`) și invitația de a deschide dashboardul HTML în browser. Fișierele nu se lasă „pe tăcute" în folder — utilizatorul trebuie să afle că există și unde sunt.
2. **Sinteza:** voturile finale (dacă menționează scorul, în formatul „X DA · Y NU · Z CONDIȚIONAT", fără CONDIȚIONAT în majoritate), cine și-a schimbat votul și ce l-a convins, cel mai relevant insight al sesiunii și întrebarea pe care consiliul NU a rezolvat-o.

## Standard de calitate (înainte de predare, verifică)

1. Am inventat cifre? Fiecare cifră e reală (din Cortex / de la utilizator) sau marcată explicit „estimare" cu calculul arătat?
2. Am tratat presupuneri drept fapte?
3. Există o perspectivă care lipsește din consiliu pentru decizia ASTA? Dacă da, spune-o în sinteză.
4. Consilierii chiar se contrazic? Dezbaterea în care toți sunt de acord e semnul că am eșuat — reia Runda 2 cu instrucțiunea ca fiecare să găsească punctul cel mai slab al pozițiilor celorlalte.
