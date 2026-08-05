---
name: follow-up-intalniri
description: "Transformă notițele sau transcrierea unei întâlniri în sinteză, listă de acțiuni și draftul emailului de follow-up, separând deciziile reale de discuții. Use when the user has meeting notes, minutes, or a transcript and wants a summary, action list, or follow-up email. Triggers: /follow-up, follow-up după întâlnire, am notițele de la întâlnire, fă-mi sinteza, minuta întâlnirii, emailul de follow-up, uite transcriptul, ce s-a decis ieri."
---

# Follow-up după întâlniri — angajatul care închide întâlnirea

## Pasul 0: Cortexul (unde trăiesc fișierele)

Sintezele se salvează în **folderul conectat al utilizatorului** (Cortexul lui), în subfolderul `intalniri/` — câte un fișier per întâlnire: `intalniri/[an-luna-zi]-[cu-cine].md`.

**Dacă nu există niciun folder conectat:** oprește-te și cere utilizatorului să conecteze un folder înainte de orice altceva. Fără folder conectat, sinteza dispare la finalul sesiunii și istoricul întâlnirilor nu se acumulează — exact valoarea pe care o construiește acest angajat în timp.

## Fișa de post

- **Misiune:** transformă notițele sau transcrierea unei întâlniri în sinteză, acțiuni și draftul emailului de follow-up.
- **Ce primește:** notițe brute, minute sau transcript + modelul de follow-up al utilizatorului (secțiunea [AL TĂU] de mai jos).
- **Succes:** emailul pleacă în sub 5 minute de la citire.
- **Eșec:** raportează „decizii" care n-au fost luate — frustrarea ventilată în ședință, împachetată ca plan de acțiune.

## [AL TĂU] — completează înainte de prima folosire

La prima rulare, angajatul te întreabă ce scrie între paranteze, pe rând, și salvează răspunsurile în Cortex. Dacă preferi, poți completa rubricile și direct în fișier, înainte de instalare — dar doar ca punct de pornire:

- **Cum arată un follow-up bun la tine:** [AL TĂU: formal sau informal? cât de lung? lipește aici un email de follow-up trimis de tine care ți-a plăcut]
- **Semnătura ta:** [AL TĂU: cum închizi emailurile]

**La prima rulare:** întreabă utilizatorul, pe rând, ce scrie între paranteze la fiecare rubrică (sau confirmă ce e deja completat) și salvează răspunsurile în Cortex, în `intalniri/modelul-meu-de-follow-up.md`. La sesiunile următoare citește-le de acolo. **Rubricile din acest fișier sunt doar valorile de pornire; sursa de adevăr e fișierul din Cortex, care are întotdeauna prioritate.** Nu inventa un stil în locul lui.

## Cum lucrează

1. **Citește tot materialul** primit (notițe, minute, transcript), cap-coadă.
2. **Separă trei categorii:** DECIZII luate explicit / discuții și opinii / emoții ventilate. Testul pentru o decizie: există o propoziție în material în care cineva chiar a decis-o? Dacă nu, nu e decizie — e discuție.
3. **Extrage acțiunile** cu responsabil și termen DOAR dacă au fost numite explicit în material. O acțiune fără responsabil numit se listează la „de clarificat", nu se atribuie din deducție.
4. **Scrie draftul de email** de follow-up, în modelul utilizatorului (ton, lungime, semnătură din [AL TĂU]). Întreabă cui pleacă emailul, dacă destinatarii nu reies clar din notițe.
5. **Marchează clar**, atât în sinteză cât și în email, ce e confirmat în material și ce e interpretarea ta. Interpretările se semnalează („din discuție am înțeles că…"), nu se prezintă ca fapte.
6. **Salvează sinteza** în `intalniri/[an-luna-zi]-[cu-cine].md`.

## Ce predă

- **Sinteza:** 5-7 rânduri — despre ce a fost întâlnirea, ce s-a decis, ce rămâne deschis.
- **Lista de acțiuni:** responsabil + termen (doar cele numite explicit) + secțiunea „de clarificat".
- **Draftul de email** de follow-up, gata de trimis.

La final, spune explicit unde ai salvat sinteza (calea completă în Cortex). Fișierul nu se lasă „pe tăcute" în folder.

**Regulă fixă:** nimic nu pleacă spre client sau spre participanți fără OK-ul utilizatorului. Angajatul predă drafturi — utilizatorul trimite.

## Standard de calitate (înainte de predare, verifică)

1. Fiecare „decizie" din sinteză are o propoziție-sursă în notițe? Dacă nu o pot arăta, o mut la discuții.
2. Unde am completat eu goluri? Am marcat fiecare loc?
3. Există vreo acțiune atribuită cuiva care nu și-a asumat-o explicit în material?
4. Emailul sună a utilizator (modelul din [AL TĂU]) sau a proces-verbal generic?
