# Update: mildere en motiverende scoring

## Waarom
Feedback na de proof of concept: de tool quoteerde te streng en las als een
afstraffing. Oorzaken: elk "hoog" punt kostte 20 punten, de aftrek was lineair
(vijf punten = score 0), lange teksten kregen geen compensatie en dezelfde fout
werd per voorkomen apart afgestraft.

## Wat er veranderde

**Score-formule** (`config/scoring.ts`, `lib/score.ts`)
- Gewichten verlaagd: hoog 20→10, middel 9→5, laag 4→2.
- Lengtecorrectie: boven 300 woorden telt de aftrek evenredig minder.
- Afvlakking: de aftrek nadert een plafond (softCap 85). De eerste punten wegen
  zwaar, elk volgend punt minder. Laagste score is nu 15, niet 0.
- Niveaugrenzen: 80 / 60 / 40 met motiverende labels ("Goed op weg",
  "Stevige basis, nog werk", "Herwerking loont").
- Simulatie zonder API-call: `npx tsx scripts/score-simulatie.ts`.

**Analyse-prompt** (`lib/claude.ts`)
- Herhaalde afwijkingen van dezelfde regel worden gebundeld tot één punt.
- Strakke kalibratie van hoog/middel/laag, bij twijfel het laagste niveau.
- Bij twijfel of iets écht afwijkt: niet flaggen. Richtcijfer max. 8 punten
  (korte tekst) / 12 (lange tekst).
- Nieuw veld `strengths`: 2–4 oprechte sterke punten, gekoppeld aan het stijlboek.
- Toon: collega-redacteur, geen examinator.

**Herschrijf-prompt**
- Een gebundeld punt wordt als patroon overal in de tekst toegepast.

**UI** (`components/ScoreCard.tsx`, `config/ui-text.ts`, `app/page.tsx`)
- Blok "Wat al goed zit" onder de score, plus de samenvatting.
- Labels herschreven: "Waarom dit helpt", "Zo kan het", "X verbeterpunten om
  de tekst nog sterker te maken".
- De rode disclaimerregel is nu neutraal grijs.

## Richtwaarden (tekst ≤ 300 woorden)
| Situatie | Oud | Nieuw |
|---|---|---|
| 1 hoog | 80 | 91 |
| 2 hoog + 2 middel | 42 | 75 |
| 4 hoog + 4 middel | 0 | 57 |
| 8 hoog + 6 middel | 0 | 38 |

---

# Update: kanaalkeuze

**Nieuw veld "Deze tekst wordt gebruikt op"** (`components/InputPanel.tsx`)
- Chips voor website, nieuwsbrief, social media, e-mail/brief, print;
  meerdere tegelijk mogelijk. Niets gekozen = website.

**Kanaalconfig** (`config/channels.ts`, nieuw, zonder code aanpasbaar)
- Per kanaal: prompt-guidance (wat telt, wat mag passeren), diepte
  (`volledig`/`licht`), richtcijfer verbeterpunten, milderingsfactor op de score.
- Social media: lichte controle (enkel aanspreking, toon, verboden constructies,
  dt, merkspelling), max. 4 punten, score 40 % milder. Emoji, losse zinnen en
  een informelere toon zijn geen afwijking.

**Analyse en herschrijving** (`lib/claude.ts`, `lib/score.ts`, beide API-routes)
- Kanaalblok gaat mee in de analyse-prompt; de herschrijving respecteert
  lengte en toon van het kanaal.
- Bij meerdere kanalen: strengste diepte, hoogste richtcijfer, gemiddelde
  milderingsfactor.

**Scorekaart**: toont "Beoordeeld voor: …".
