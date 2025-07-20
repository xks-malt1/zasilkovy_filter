# Zásielkový filter

Jednoduché rozšírenie pre prehliadač Chrome/Chromium, ktoré uľahčuje prácu so stránkou obsahujúcou zoznam zásielok. Po výbere dátumového intervalu zobrazí prehľad vyhovujúcich zásielok a umožní počítať počet balíkov podľa výberu.

## Inštalácia

1. Stiahnite alebo naklonujte tento repozitár.
2. V prehliadači Chrome otvorte `chrome://extensions` a zapnite režim vývojára.
3. Kliknite na **Načítať rozbalené** a vyberte priečinok s rozšírením.

## Použitie

1. Navštívte stránku so zoznamom zásielok (tabuľka musí obsahovať riadky so stĺpcami číslo, dátum vytvorenia/zmeny, klient a počet balíkov).
2. Kliknite na ikonu rozšírenia v paneli prehliadača.
3. V dialógovom okne zvoľte dátum "Od" a "Do" a stlačte **Načítať zásielky**.
4. Zobrazí sa modálne okno s tabuľkou zásielok v danom rozsahu. Pomocou checkboxov môžete výber meniť, pričom sa priebežne aktualizuje suma balíkov.

## Súbory

- `manifest.json` – definícia rozšírenia, povolení a scriptov.
- `background.js` – service worker, ktorý po kliknutí na ikonku spustí content skript.
- `content.js` – kód vykonávaný na stránke; zobrazuje dialóg, filtruje tabuľku a počíta balíky.
- `icon.png`, `icon-16.png`, `icon-48.png`, `icon-128.png` – ikony rozšírenia v rôznych veľkostiach.

Rozšírenie je určené na uľahčenie správy zásielok a neuchováva žiadne údaje mimo otvorenej stránky.
