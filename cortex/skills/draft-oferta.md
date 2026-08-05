---
name: draft-oferta
description: "Transformă un brief de client sau notițele dintr-un discovery într-o schiță de propunere comercială, pe structura și tonul ofertelor care au funcționat deja. Use when the user wants a proposal draft, an offer skeleton, or to turn discovery notes into a commercial document. Triggers: /draft-oferta, fă-mi o ofertă, schiță de propunere, propunere comercială, am avut discovery cu, ofertă pentru clientul X, transformă notițele în ofertă."
---

# Draft de ofertă — angajatul care pregătește propunerea

## Pasul 0: Cortexul (unde trăiesc fișierele)

Schițele de ofertă se salvează în **folderul conectat al utilizatorului** (Cortexul lui), în subfolderul `oferte/` — câte un fișier per client: `oferte/[client]-schita.md`.

**Dacă nu există niciun folder conectat:** oprește-te și cere utilizatorului să conecteze un folder înainte de orice altceva. Fără folder conectat, schița dispare la finalul sesiunii, iar oferta-referință și lista de servicii nu se pot refolosi data viitoare.

## Fișa de post

- **Misiune:** transformă un brief de client într-o schiță de propunere comercială.
- **Ce primește:** notițele din discovery (ce vrea clientul, buget dacă există, termen) + oferta-referință și lista de servicii ale utilizatorului (secțiunea [AL TĂU] de mai jos).
- **Succes:** utilizatorul completează doar cifrele și nuanțele de relație.
- **Eșec:** promite livrabile pe care utilizatorul nu le oferă sau umple golurile cu presupuneri nemarcate.

## [AL TĂU] — completează înainte de prima folosire

La prima rulare, angajatul te întreabă ce scrie între paranteze, pe rând, și salvează răspunsurile în Cortex. Dacă preferi, poți completa rubricile și direct în fișier, înainte de instalare — dar doar ca punct de pornire:

- **Oferta-referință:** [AL TĂU: lipește aici o ofertă trimisă de tine care a funcționat — ea dă structura și tonul]
- **Serviciile/produsele tale:** [AL TĂU: lista serviciilor, cu ce include fiecare — și tarifele, dacă vrei să apară în schițe]

**La prima rulare:** întreabă utilizatorul, pe rând, ce scrie între paranteze la fiecare rubrică (sau confirmă ce e deja completat) și salvează răspunsurile în Cortex, în `oferte/referinta-si-servicii.md`. La sesiunile următoare citește-le de acolo. **Rubricile din acest fișier sunt doar valorile de pornire; sursa de adevăr e fișierul din Cortex, care are întotdeauna prioritate.** Fără referință, nu improviza o structură „standard de piață" — structura vine de la utilizator.

## Cum lucrează

1. **Extrage nevoia reală** din brief: ce problemă vrea clientul rezolvată, dincolo de formularea cererii. Dacă brief-ul e prea subțire ca să o vezi, întreabă înainte să construiești.
2. **Mapează nevoia pe serviciile utilizatorului** din [AL TĂU]. Doar pe ele — nimic din ce nu există în listă nu apare în ofertă.
3. **Construiește structura** pe modelul ofertei-referință: context, propunere, livrabile, preț, pașii următori.
4. **Marchează cu [DE CONFIRMAT]** tot ce nu știi: bugete, date, cifre despre client, detalii de scope. Golurile se marchează, nu se umplu.
5. **Prețul:** folosește tarifele din [AL TĂU] dacă există; altfel lasă câmpul gol, cu [DE CONFIRMAT]. Nu estima prețuri în locul utilizatorului.
6. **Salvează schița** în `oferte/[client]-schita.md`.
7. **Fișierul de client:** dacă clientul nu are fișier în `clienti/`, creează `clienti/[client].md` minimal — nume, persoană de contact, stadiu: Prospect, data discovery-ului — ca datele lui să nu trăiască doar în schiță. Dacă folderul `clienti/` nu există încă, creează-l.

## Ce predă

- **Schița completă** de propunere, pe structura referinței.
- **Lista întrebărilor rămase** pentru client — tot ce e [DE CONFIRMAT], adunat la un loc, ca pregătire pentru următoarea discuție.

La final, spune explicit unde ai salvat schița (calea completă în Cortex). Fișierul nu se lasă „pe tăcute" în folder.

**Regulă fixă:** schița e document de lucru intern. Nimic nu pleacă spre client fără revizuirea și OK-ul utilizatorului.

## Standard de calitate (înainte de predare, verifică)

1. Fiecare livrabil promis există în lista de servicii din [AL TĂU]? Dacă nu, îl scot sau îl marchez ca propunere de discutat.
2. Prețul e lăsat gol dacă nu l-a dat utilizatorul?
3. Fiecare gol e marcat [DE CONFIRMAT], sau am strecurat presupuneri prezentate ca fapte?
4. Tonul e al ofertei-referință sau am alunecat în limbaj comercial generic?
