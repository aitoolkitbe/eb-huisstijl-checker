---
titel: "Index van de kennisbasis (stijlboek)"
type: index
---

# Kennisbasis — Europabank Huisstijl Checker

Deze map is het **stijlboek** van de tool. Alle `.md`-bestanden in deze map
(behalve dit indexbestand en bestanden die met `_` beginnen, zoals het sjabloon)
worden bij elke analyse **automatisch** ingeladen in de systeemprompt. De tool
toetst aangeleverde content tegen deze stijlregels.

> **Belangrijk:** je hoeft **geen code** te wijzigen om het stijlboek aan te
> passen. Een bestand toevoegen, aanvullen of verwijderen volstaat. Commit je
> wijziging en Vercel zet de nieuwe versie automatisch live.

> **Principe:** de tool flagt **enkel wat het stijlboek dekt**. Staat een regel
> hier niet, dan flagt de tool die niet en verzint ze niet.

## Huidige inhoud (thematisch opgesplitst)

| Bestand | Thema |
|---|---|
| `tone-of-voice.md` | Kernprincipes van de toon |
| `aanspreking-en-stem.md` | 'u'-vorm ('je' bij jongeren), zij/haar, warm en actief |
| `titel.md` | Titelregels en richtlengte |
| `structuur-en-opbouw.md` | Belofte → Bewijs → Advies, CTA |
| `scanbaarheid-en-typografie.md` | Alinea-/zinsnormen, bullets, quotes |
| `verboden-constructies.md` | Wat de huisstijl vermijdt |
| `spreektaal-woordenlijst.md` | Verouderde woorden → spreektaal-alternatieven |
| `merkspecifieke-spelling.md` | Europabank, eb online, E-broker, pakketten, klanten |
| `getallen-bedragen-notatie.md` | Bedragen, getallen, data, telefoonnummers |
| `terugverwijzingen.md` | 'die/dat' i.p.v. 'dit/deze' |
| `begroeting-en-afsluiting.md` | Aanhef, onderwerp, slotformules (mails/brieven) |
| `hoofdletters-en-afkortingen.md` | Organen klein, afkortingen klein |
| `werkwoordspelling-dt.md` | dt-fouten en moeilijke werkwoorden |
| `beeldtaal.md` | Beeldrichtlijnen (alleen bij beeldcontent) |
| `voorbeelden.md` | Concrete voor/na-cases |

> Bronnen: de tone-of-voice-documenten van June20/Cards én de **Schrijfstijlgids
> Europabank (versie maart 2025)**. Bij een update van een van beide documenten
> pas je de betrokken bestanden hier aan.

> De map `_archive_tool1/` bevat oude bestanden van Tool 1 en wordt **niet**
> ingeladen. Je mag die map negeren of verwijderen.

## Een stijlregel toevoegen of aanpassen

1. Kopieer `_SJABLOON-stijlregel.md` naar een nieuw bestand met een duidelijke
   naam, bv. `spelling-getalnotatie.md`.
2. Vul de velden in (regel, toepassingsgebied, voorbeeld) en verwijs naar de bron.
3. Commit en push. De regel telt mee vanaf de volgende analyse.

## Schrijftips voor betrouwbare output

- Beschrijf regels **kort en concreet** ("doe dit", "vermijd dat").
- Geef telkens een **voor/na-voorbeeld**. Dat verhoogt de kwaliteit van de analyse sterk.
- Eén thema per bestand houdt het stijlboek overzichtelijk.
- Wil je een regel die de tool **niet** mag flaggen (puur context)? Zet `type: context` in de frontmatter en zeg het expliciet in de tekst (zoals bij `beeldtaal.md`).
