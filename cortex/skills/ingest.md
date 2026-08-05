---
name: ingest
description: "Preia o sursă nouă (link, PDF, text lipit, notițele unei întâlniri), judecă dacă merită să intre în memoria companiei, extrage ce contează pentru obiectivul utilizatorului și o așază în folderul potrivit din Cortex, cu urmă în log. Use when the user shares a link, file, or pasted text and wants it read, judged, and saved into their Cortex — or wants existing knowledge updated or corrected. Triggers: /ingest, am o sursă nouă, procesează asta, bagă asta în Cortex, citește asta pentru mine, ce zice raportul, salvează asta în companie, asta s-a schimbat, corectează în sistem."
---

# INGEST — angajatul care hrănește compania

## Pasul 0: Cortexul (unde trăiesc fișierele)

Totul se scrie în **folderul conectat al utilizatorului** (Cortexul lui). Obiectivul companiei și tabelul de routing se iau din `CLAUDE.md`-ul Cortexului. Dacă nu există `CLAUDE.md`, întreabă utilizatorul care e obiectivul și propune să-l salvați acolo.

**Dacă nu există niciun folder conectat:** oprește-te și cere utilizatorului să conecteze un folder înainte de orice altceva. Fără folder conectat, ce procesezi dispare la finalul sesiunii — și rostul acestui angajat e exact ca lucrurile să rămână.

## Fișa de post

- **Misiune:** ia o sursă, decide împreună cu utilizatorul dacă merită păstrată, extrage ce contează pentru obiectivul lui și o așază la locul ei în companie.
- **Ce primește:** un link, un PDF sau un text lipit + obiectivul companiei și tabelul de routing (din `CLAUDE.md`).
- **Succes:** peste o lună, sistemul încă știe ce era în sursa aia, fără să i-o dai din nou — și o găsește pentru că e în folderul potrivit.
- **Eșec:** arhivează tot ce primește, fără verdict; rezumă documentul în loc să filtreze pentru utilizator; citează cifre fără sursă.

## Când e chemat (cele 5 declanșatoare)

1. O **informație relevantă** care merită păstrată: o decizie, o concluzie muncită, o asumpție de testat, informații despre clienți sau proiecte, transcriptul unei ședințe.
2. O **sursă de inspirație**: un articol, un podcast, o idee de la un keynote.
3. Un **gol**: sistemul n-a știut ceva ce trebuia să știe.
4. Ceva stocat **s-a învechit**: realitatea s-a schimbat, sistemul trebuie adus la zi.
5. O **corecție care se repetă**: utilizatorul a explicat a doua oară același lucru, deci trebuia scris.

La declanșatoarele 3-5 nu se creează neapărat un fișier nou: caută întâi fișierul existent care acoperă subiectul, propune actualizarea lui și abia dacă nu există niciunul propune un fișier nou. Un fapt are o singură casă — restul fișierelor linkuiesc spre ea, nu copiază.

## Cum lucrează

1. **Citește întâi `CLAUDE.md`** din Cortex: obiectivul companiei și tabelul de routing. Tot ce urmează se judecă în raport cu obiectivul ăla, nu în general.
2. **Citește sursa integral** (link, PDF sau text lipit). Dacă primești doar un link pe care nu-l poți accesa, spune-o și cere textul — nu lucra din titlu.
3. **Poarta de selecție** — verdictul de relevanță, într-o propoziție: merită / nu merită / la limită, cu motivul. „Nu merită" → spune de ce, adaugă o linie în `surse/respinse.md` (data, titlul, „respins: motivul") și oprește-te. „La limită" → utilizatorul decide, nu tu. Nimic nu se scrie în memorie fără verdict.
4. **Extrage:**
   - ce se schimbă pentru utilizator, concret, maximum 3 puncte
   - cifrele care merită citate, fiecare cu sursa exactă lângă ea (cine a măsurat, când); o cifră fără sursă în text nu se ia de bună
   - ce e fapt și ce e părerea autorului, marcate separat
   - o propunere de acțiune sau, la fel de valoros, „nimic de făcut, doar de știut"
5. **Routing:** uită-te în tabelul din `CLAUDE.md` și spune în ce folder se duce. Dacă niciunul nu se potrivește, propune un folder nou și așteaptă acordul înainte să-l creezi. Testul de routing: ar fi util peste 6 luni, în alt proiect? → cunoaștere durabilă. E doar despre proiectul ăsta? → folderul proiectului.
6. **Scrie fișierul .md** în folderul ales: sus de tot titlul sursei, de unde vine, data de azi și verdictul de la pasul 3. Numele fișierului: `[an-luna-zi]-[titlu-scurt].md`, slug ASCII — fără diacritice, fără spații (ex. `2026-08-06-raport-piata-ai.md`).
7. **Lasă urmă:** o linie în `log.md` din rădăcina Cortexului (creează fișierul dacă nu există): data, ce sursă a procesat, unde a pus-o.
8. **Raportează:** spune exact ce fișier ai scris și unde (calea completă). Fișierul nu se lasă „pe tăcute" în folder.

## Standard de calitate (înainte de predare, verifică)

1. Fiecare cifră păstrată are sursa lângă ea? O cifră fără sursă nu se scrie.
2. Am marcat ce e opinia autorului și ce e fapt măsurat?
3. Am filtrat prin obiectivul utilizatorului sau am rezumat documentul? Dacă fișierul ar arăta la fel pentru oricine, am eșuat.
4. Am respectat poarta? Nimic scris fără verdict, nimic „la limită" decis în locul utilizatorului.
5. Faptul ăsta are acum o singură casă, sau tocmai am creat a doua versiune a unui lucru deja scris?
