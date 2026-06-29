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
 *  Kleuren komen uit de Europabank-huisstijlgids (Brand Basics 1.1):
 *    - Europabank Geel : #FCE400  (RGB 252/228/0  · CMYK 0/0/100/0 · PMS Yellow)
 *    - Europabank Zwart: #333333  (RGB 51/51/51   · CMYK 0/0/0/95  · PMS Black 2)
 *    - Secundaire grijzen: #808080 / #AFAFAF / #CACACA
 *  Baseline van het merk: "De bank die durft."
 * ============================================================================
 */

export const branding = {
  // --- Kleuren -------------------------------------------------------------
  // Hoofdkleuren van het merk. Het geel is het herkenningspunt van Europabank.
  colors: {
    primary: "#FCE400", // Europabank Geel — gebruikt voor accenten/knoppen
    primaryText: "#333333", // tekstkleur BOVENOP het geel (zwart i.p.v. wit ivm contrast)
    ink: "#333333", // Europabank Zwart — basis tekstkleur
    background: "#FFFFFF", // paginakleur + kaarten (zuiver wit, zakelijk)
    surface: "#F5F6F7", // subtiele achtergrond voor ingesloten elementen (tabs, score-track)
    border: "#E4E4E7", // fijne hairline-randen
    muted: "#6B7280", // gedempte tekst (bijschriften, hints)

    // Kleuren per ernstniveau van een aandachtspunt.
    // Pas aan als je een andere visuele codering wil. Houd voldoende contrast (WCAG AA).
    severity: {
      hoog: "#B00020", // rood — hoge ernst
      middel: "#B26A00", // amber — middelhoge ernst
      laag: "#5A6570", // grijsblauw — lage ernst
    },

    // Kleuren voor de score-ring, gekoppeld aan de "tone" van een niveau in
    // config/scoring.ts (positive | warn | caution | danger). Houd WCAG AA aan.
    score: {
      positive: "#1E7A46", // groen — weinig aandachtspunten
      warn: "#B26A00", // amber — enkele aandachtspunten
      caution: "#C2410C", // oranje — veel aandachtspunten
      danger: "#B00020", // rood — grondige herwerking nodig
    },
  },

  // --- Logo ----------------------------------------------------------------
  // Pad naar het logobestand in /public. Vervang het bestand of dit pad om
  // het logo te wisselen. Laat 'src' leeg ("") om enkel de tekstnaam te tonen.
  logo: {
    src: "/logo-europabank.svg", // logo voor lichte achtergrond (in /public)
    // Logo voor de DONKERE kop van deze tool. Plaats bv. een witte versie als
    // /public/logo-europabank-wit.svg en zet hier het pad. Laat leeg ("") om de
    // ingebouwde tekst-lockup (gele 'e' + witte naam) te tonen.
    srcOnDark: "",
    alt: "Europabank",
    // Toont deze tekst als er (nog) geen logobestand is.
    fallbackText: "Europabank",
    height: 32, // hoogte in pixels
  },

  // --- Fonts ---------------------------------------------------------------
  // De huisstijl gebruikt "Acumin Pro" (Adobe Fonts, licentie vereist).
  // Acumin Pro is geen gratis webfont; daarom is de standaard een nette
  // systeem-fallback. Heb je een Acumin Pro-webfontlicentie? Laad het font dan
  // in app/layout.tsx of via een <link> en zet de naam vooraan in 'fontFamily'.
  fonts: {
    fontFamily:
      '"Acumin Pro", Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
  },

  // --- Footer --------------------------------------------------------------
  // Subtiele footervermelding. Pas de tekst hier aan.
  footer: {
    text: "Een tool van De Content Studio x June20",
    // Optionele baseline van het merk; laat leeg ("") om te verbergen.
    baseline: "De bank die durft.",
  },
} as const;

export type Branding = typeof branding;
