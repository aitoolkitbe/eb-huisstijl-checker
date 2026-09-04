# Europabank Huisstijl Checker (Tool 2)

Een webtool die content **toetst aan de Europabank-huisstijl** en concrete
verbeteringen voorstelt. De gebruiker levert content aan (bestand, geplakte tekst
of URL), de tool vergelijkt die met het stijlboek en geeft een **huisstijl-score**,
een lijst **verbeterpunten**, en — op vraag — een **verbeterde versie** waarin
enkel de aangevinkte punten verwerkt zijn.

> **Geen black box.** Alles wat de beheerder zonder code moet kunnen aanpassen —
> het stijlboek, de branding, de scoring en alle teksten — staat in losse,
> becommentarieerde bestanden, strikt gescheiden van de applicatielogica.

> **Belangrijk principe.** De tool flagt **enkel wat het stijlboek dekt**. Staat
> een regel niet in het stijlboek, dan wordt ze niet beoordeeld en niet verzonnen.
> De tool vervangt geen menselijke eindredactie.

Deze tool deelt de architectuur, componenten en flow met **Tool 1 (Pre-compliance
Checker)**. Alleen de kennisbasis (het stijlboek) en de beoordelingsteksten
verschillen.

---

## Inhoud

1. [Hoe het werkt (schermflow)](#hoe-het-werkt-schermflow)
2. [Mappenstructuur](#mappenstructuur)
3. [Lokaal draaien](#lokaal-draaien)
4. [Deployen: GitHub → Vercel](#deployen-github--vercel)
5. [Hoe pas ik X aan zonder code](#hoe-pas-ik-x-aan-zonder-code)
   - [Het stijlboek / de kennisbasis](#a-het-stijlboek--de-kennisbasis-knowledge)
   - [De branding](#b-de-branding-configbrandingts)
   - [De scoring](#c-de-scoring-configscoringts)
   - [De teksten / disclaimer](#d-de-teksten--disclaimer-configui-textts)
6. [Een korte test met voorbeeldcontent](#een-korte-test-met-voorbeeldcontent)
7. [Het model wisselen / kosten besparen](#het-model-wisselen--kosten-besparen)
8. [Upgradepad: database + admin (toekomst)](#upgradepad-database--admin-toekomst)

---

## Hoe het werkt (schermflow)

1. **Invoer** — drie tabs: bestand uploaden (`.docx`, `.pdf`, `.txt`), tekst
   plakken, of een URL ingeven. De server zet alles om naar platte tekst.
2. **Controle** — de content gaat serverside naar Claude, samen met het volledige
   stijlboek (met prompt caching). Claude geeft gestructureerde JSON terug en
   flagt enkel wat het stijlboek dekt.
3. **Resultaat**, in vaste volgorde:
   1. **Score 0–100** + niveau-duiding, een korte samenvatting en **"Wat al
      goed zit"** (2–4 sterke punten, gekoppeld aan het stijlboek).
   2. **Genummerde verbeterpunten** (titel, stijlregel, exact fragment,
      waarom dit helpt, voorstel, impact), gesorteerd op impact (hoog → laag).
      Herhaalde patronen (bv. vijf keer 'dit' i.p.v. 'die') worden **gebundeld
      tot één punt**; de herschrijving past het patroon dan overal toe.
   3. **Checkbox** per punt, standaard aangevinkt.
   4. Knop **"Genereer verbeterde versie"** — herschrijft *pas dan*, en
      uitsluitend met de aangevinkte punten. Niet-aangevinkte punten blijven
      ongewijzigd.
4. **Verbeterde versie** — kopieerknop + download als `.docx` of `.txt`.

Architectuur: **Next.js (App Router) + TypeScript + Tailwind**. De Claude API
wordt enkel **serverside** aangesproken via `/api/analyze` en `/api/rewrite`. De
API-key staat nooit in de client.

---

## Mappenstructuur

```
europabank-huisstijl-checker/
├── app/
│   ├── page.tsx                 # hoofdscherm (UI-orkestratie)
│   ├── layout.tsx · globals.css
│   └── api/
│       ├── analyze/route.ts     # content → score + verbeterpunten (JSON)
│       └── rewrite/route.ts     # past enkel de aangevinkte punten toe
│
├── knowledge/        ← HET STIJLBOEK (platte Markdown, vrij aanpasbaar)
│   ├── 00-index.md
│   ├── tone-of-voice.md
│   ├── aanspreking-en-stem.md
│   ├── titel.md
│   ├── structuur-en-opbouw.md
│   ├── scanbaarheid-en-typografie.md
│   ├── verboden-constructies.md
│   ├── beeldtaal.md             # context: enkel relevant bij beeldcontent
│   ├── voorbeelden.md           # context: voor/na-cases
│   └── _SJABLOON-stijlregel.md  # sjabloon voor een nieuwe regel
│
├── config/           ← CONFIG (zonder code aanpasbaar, becommentarieerd)
│   ├── branding.ts              # kleuren, logo, fonts, footer
│   ├── scoring.ts               # drempels, gewichten per impact, niveau-teksten
│   └── ui-text.ts               # alle labels, koppen, knoppen, disclaimer
│
├── lib/  · components/  · public/  · README.md  · package.json  · …
```

> De map `knowledge/_archive_tool1/` (indien aanwezig) bevat oude bestanden van
> Tool 1 en wordt **niet** ingeladen. Je mag ze negeren of verwijderen.

De code bevat **geen** hardcoded stijlregels, drempels of teksten. Een wijziging
aan een bestand in `config/` of `knowledge/` vereist dus **nooit** een
codewijziging.

---

## Lokaal draaien

Vereist: Node.js 18.18+ (of 20+).

```bash
npm install
cp .env.local.example .env.local      # zet hierin je ANTHROPIC_API_KEY
npm run dev                            # open http://localhost:3000
```

Build & typecheck (zoals Vercel ze draait):

```bash
npm run build
npm run typecheck
```

---

## Deployen: GitHub → Vercel

1. **Push de repo naar GitHub** (een eigen repo, los van Tool 1).

   ```bash
   git init
   git add .
   git commit -m "Initiële versie Huisstijl Checker"
   git branch -M main
   git remote add origin https://github.com/<jouw-org>/europabank-huisstijl-checker.git
   git push -u origin main
   ```

2. **Importeer in Vercel** → *Add New… → Project* → kies de repo. Next.js wordt
   automatisch herkend.

3. **Zet de environment variable** (*Settings → Environment Variables*):

   | Name | Value | Environments |
   |---|---|---|
   | `ANTHROPIC_API_KEY` | `sk-ant-...` | Production, Preview, Development |

4. **Deploy.** Elke push naar `main` zet automatisch een nieuwe versie live —
   ook een wijziging aan het stijlboek of de config.

---

## Hoe pas ik X aan zonder code

> Algemeen patroon: open het juiste bestand, wijzig de tekst/waarde, **commit en
> push**. Vercel deployt automatisch. Je raakt de applicatielogica nooit aan.

### a) Het stijlboek / de kennisbasis (`/knowledge`)

Het stijlboek bepaalt **waartegen** de tool toetst. Alle `.md`-bestanden in
`/knowledge` worden automatisch ingeladen (behalve `00-index.md` en bestanden die
met `_` beginnen). De inhoud is thematisch opgesplitst (tone of voice,
aanspreking, titel, structuur, scanbaarheid/typografie, verboden constructies,
beeldtaal, voorbeelden).

**Een stijlregel toevoegen:**

1. Kopieer `knowledge/_SJABLOON-stijlregel.md` naar een nieuw bestand met een
   sprekende naam, bv. `spelling-getalnotatie.md`.
2. Vul de blokken in:
   - **Regel** — kort en concreet (wat moet, wat mag niet).
   - **Toepassingsgebied** — wanneer de regel geldt.
   - **Voorbeeld** — minstens één voor/na-voorbeeld.
   - Verwijs in de frontmatter naar de **bron** en kies het juiste **thema**.
3. Commit en push.

**Een regel die NIET geflagd mag worden** (alleen achtergrond): zet
`type: context` in de frontmatter en zeg het expliciet in de tekst — zoals bij
`beeldtaal.md`. De tool gebruikt zulke bestanden dan om de toon te begrijpen,
maar flagt er niet op.

**Een bestaande regel aanpassen** = de tekst in het bestand wijzigen. **Uitschakelen**
= het bestand verwijderen of de naam laten beginnen met `_`.

> Onthoud: de tool flagt enkel wat in het stijlboek staat. Wil je dat de tool
> iets nieuws opmerkt (bv. getalnotatie of datumnotatie), dan moet je daar een
> regel voor toevoegen.

### b) De branding (`config/branding.ts`)

Identiek aan Tool 1: kleuren (Europabank-geel `#FCE400`, zwart `#333333`), logo
(plaats je bestand in `/public` en zet het pad in `logo.src`), font (Acumin Pro
met systeem-fallback) en footertekst ("Een tool van De Content Studio x June20").

### c) De scoring (`config/scoring.ts`)

Bepaalt hoe de score (0–100) wordt berekend en welke duiding erbij hoort.
De score is bewust **niet lineair**: de eerste verbeterpunten wegen het zwaarst,
elk volgend punt weegt minder (afvlakking), en lange teksten krijgen een
lengtecorrectie. Zo landt een tekst met veel kleine opmerkingen niet op 0 en
blijft de score motiverend in plaats van afstraffend.

- **Strenger/soepeler** — pas `weights` aan: ruwe aftrek per verbeterpunt, per
  impact (`hoog`, `middel`, `laag`).
- **Lange teksten milder/strenger** — pas `referenceWords` aan (tot dat aantal
  woorden telt elk punt volledig mee; daarboven evenredig minder).
- **Hoe diep de score kan zakken** — pas `softCap` aan (laagste score = 100 − softCap).
- **Andere niveaugrenzen** — pas `minScore` per niveau aan in `levels`.
- **Andere duiding** — herschrijf `label` en `description` per niveau.

Richtwaarden staan bovenaan in `config/scoring.ts`. Wil je snel voelen wat een
aanpassing doet, dan volstaat `npx tsx scripts/score-simulatie.ts` (geen API-call).

### d) De teksten / disclaimer (`config/ui-text.ts`)

Alle zichtbare teksten: koppen, labels, knoppen, hints, foutmeldingen en de
disclaimer (`disclaimer.title` + `disclaimer.body`). Wijzig de tekst, commit, push.

---

## Een korte test met voorbeeldcontent

1. Start de tool (`npm run dev`) en open `http://localhost:3000`.
2. Kies **Tekst plakken** en plak bijvoorbeeld:

   > *"Wij verzoeken u vriendelijk om kennis te nemen van het feit dat door onze
   > bank diverse betaaloplossingen worden aangeboden welke door de klant kunnen
   > worden aangekocht."*

3. Klik **Controleer huisstijl**. Verwacht resultaat:
   - Een **score** onder de 100 met een niveau-duiding.
   - Verbeterpunten met **hoge impact**: stijfheid ("Wij verzoeken u vriendelijk
     om…"), lijdende vorm ("wordt aangeboden / kunnen worden aangekocht"), en de
     bank centraal i.p.v. de klant — telkens met verwijzing naar de geraakte
     stijlregel en een concreet voorstel.
   - Elk punt heeft een **aangevinkte checkbox**.
4. Laat de punten aangevinkt en klik **Genereer verbeterde versie**. De tekst
   wordt herschreven in mensentaal, met 'u', warm en actief — de rest blijft staan.
5. Test ook **kopiëren** en **download .docx / .txt**.

> Plak je een tekst die al volledig op stijl zit, dan hoort de tool weinig of geen
> verbeterpunten te geven — ze verzint immers geen regels.

---

## Het model wisselen / kosten besparen

Het model staat als constante bovenaan `lib/claude.ts`:

```ts
export const MODEL_ANALYZE = "claude-sonnet-4-6";
export const MODEL_REWRITE = "claude-sonnet-4-6";
```

Bij volume kan `MODEL_ANALYZE` op `"claude-haiku-4-5-20251001"` voor besparing;
de herschrijving blijft best op Sonnet voor kwaliteit.

---

## Upgradepad: database + admin (toekomst)

Net als Tool 1 is de opzet bewust bestand-gedreven: stijlboek en instellingen
staan als bestanden in de repo, wijzigen gebeurt via een commit. Bij groeiende
behoefte (meerdere beheerders, wijzigen zonder Git, audit-log) kan de tool
evolueren zonder de kernarchitectuur om te gooien:

- **Database** (Vercel Postgres, Supabase, Neon) voor stijlboek en config in
  plaats van bestanden; enkel `lib/knowledge.ts` en de config-imports wijzigen.
- **Admin-paneel** — afgeschermde `/admin`-route om regels, scoring en teksten via
  een formulier te beheren, met authenticatie en rollen.
- **Versiebeheer & audit** — wie wijzigde wat en wanneer, met rollback.
- **Opslag van controles** — resultaten bewaren voor rapportage (let op privacy).

Tot dan blijft de regel: **een wijziging aan een configbestand of het stijlboek
vereist nooit een codewijziging.**

---

*Een tool van De Content Studio x June20.*
