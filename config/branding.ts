/**
 * ============================================================================
 *  BRANDING  —  vrij aanpasbaar ZONDER code aan te raken
 * ============================================================================
 *
 *  Dit bestand bevat ALLE visuele merkinstellingen: kleuren, logo, fonts en
 *  footertekst. De applicatielogica leest deze waarden in; ze staan nergens
 *  hardcoded in de code zelf.
 *
 *  Hoe pas je iets aan?
 *   1. Wijzig hieronder de gewenste waarde (bv. een kleurcode of de footertekst).
 *   2. Commit en push naar GitHub.
 *   3. Vercel zet de nieuwe versie automatisch live. Geen code nodig.
 *
 *  Waarden komen uit de officiële stylesheet van het brandingbureau
 *  (Europabank brand tokens):
 *    - Accent (Europabank Geel) : #FCE400  · dim-variant #F7F3D9
 *    - Tekst  (Europabank Zwart): #333333
 *    - Grijzen: muted #808080 · neutral #AFAFAF · border #CACACA · border-dim #E8E8E8
 *    - Succes #009933 · Danger #C0392B
 *    - Fonts: Acumin Pro (UI) + Tiempos Text (leestekst)
 *    - Hoekafronding: 0px (scherpe hoeken, badges 2px)
 *  Baseline van het merk: "De bank die durft."
 * ============================================================================
 */

export const branding = {
  // --- Kleuren -------------------------------------------------------------
  // Hoofdkleuren van het merk. Het geel is het herkenningspunt van Europabank.
  colors: {
    primary: "#FCE400", // Europabank Geel — accenten/knoppen (--color-accent)
    primaryDim: "#F7F3D9", // gedimde geeltint voor vlakken en focus-glow (--color-accent-dim)
    primaryText: "#333333", // tekstkleur BOVENOP het geel (zwart i.p.v. wit ivm contrast)
    ink: "#333333", // Europabank Zwart — basis tekstkleur (--color-text)
    background: "#FFFFFF", // paginakleur + kaarten (--color-bg)
    surface: "#F5F5F5", // subtiele achtergrond voor ingesloten elementen (--color-surface)
    border: "#CACACA", // standaard randen (--color-border)
    borderDim: "#E8E8E8", // extra fijne randen/scheidingslijnen (--color-border-dim)
    muted: "#808080", // gedempte tekst (--color-muted)
    neutral: "#AFAFAF", // neutrale status-tint (--color-neutral)

    // Kleuren per ernstniveau van een aandachtspunt.
    // Afgeleid van de bureau-tokens: danger / warning-tekst / muted.
    severity: {
      hoog: "#C0392B", // rood — hoge ernst (--color-danger)
      middel: "#B7770D", // amber — middelhoge ernst (alert-warning tekstkleur)
      laag: "#808080", // grijs — lage ernst (--color-muted)
    },

    // Kleuren voor de score-ring, gekoppeld aan de "tone" van een niveau in
    // config/scoring.ts (positive | warn | caution | danger).
    score: {
      positive: "#009933", // groen — weinig aandachtspunten (--color-success)
      warn: "#B7770D", // amber — enkele aandachtspunten
      caution: "#D35400", // oranje — veel aandachtspunten (pill-high)
      danger: "#C0392B", // rood — grondige herwerking nodig (--color-danger)
    },
  },

  // --- Logo ----------------------------------------------------------------
  // Pad naar het logobestand in /public. Vervang het bestand of dit pad om
  // het logo te wisselen. Laat 'src' leeg ("") om enkel de tekstnaam te tonen.
  logo: {
    src: "/logo-europabank.svg", // logo voor lichte achtergrond (in /public)
    alt: "Europabank",
    // Toont deze tekst als er (nog) geen logobestand is.
    fallbackText: "Europabank",
    height: 32, // hoogte in pixels
  },

  // --- Fonts ---------------------------------------------------------------
  // De huisstijl gebruikt "Acumin Pro" (UI) en "Tiempos Text" (leestekst).
  // Beide zijn licentiefonts; de fallbacks (Arial / Georgia) volgen de
  // stylesheet van het bureau. Heb je webfontlicenties? Laad de fonts dan in
  // app/layout.tsx of via een <link> — de font-stacks hieronder pikken ze op.
  fonts: {
    fontFamily: '"Acumin Pro", Arial, sans-serif', // UI-font (--font-sans)
    fontBody: '"Tiempos Text", Georgia, serif', // leestekst (--font-body)
  },

  // --- Footer --------------------------------------------------------------
  // Footervermelding volgens de bureau-stylesheet. Pas de tekst hier aan.
  footer: {
    text: "Dashboard by June20 & De Content Studio",
    // Optionele baseline van het merk; laat leeg ("") om te verbergen.
    baseline: "De bank die durft.",
  },
} as const;

export type Branding = typeof branding;
