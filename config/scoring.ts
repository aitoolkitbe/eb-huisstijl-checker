/**
 * ============================================================================
 *  SCORING  —  vrij aanpasbaar ZONDER code aan te raken
 * ============================================================================
 *
 *  Dit bestand bepaalt HOE de huisstijl-score (0–100) wordt berekend en welke
 *  duiding bij een score hoort. De applicatielogica leest deze waarden in en
 *  bevat zelf geen drempels of teksten.
 *
 *  Hoe werkt de score?
 *   - De analyse levert een lijst verbeterpunten op, elk met een impact:
 *     "hoog", "middel" of "laag".
 *   - Elk verbeterpunt trekt punten af, volgens 'weights' hieronder.
 *   - Start is 100. Score = max(0, 100 − som van de aftrekpunten).
 *   - Bij welke score welk niveau hoort, bepaalt 'levels'.
 *
 *  Hoe pas je iets aan?
 *   - Strenger maken? Verhoog de getallen in 'weights'.
 *   - Andere niveaugrenzen? Pas 'minScore' in 'levels' aan.
 *   - Andere duiding? Herschrijf de 'label' en 'description' per niveau.
 *   Commit + push → Vercel deployt automatisch. Geen code nodig.
 * ============================================================================
 */

export type Severity = "hoog" | "middel" | "laag";

export const scoring = {
  // --- Startscore ----------------------------------------------------------
  startScore: 100,

  // --- Gewichten per impact ------------------------------------------------
  // Aantal punten dat per verbeterpunt van de score wordt afgetrokken,
  // naargelang de impact op de huisstijl.
  weights: {
    hoog: 20,
    middel: 9,
    laag: 4,
  } satisfies Record<Severity, number>,

  // Maximale aftrek voor de hele tekst (ondergrens van de score blijft 0).
  maxPenalty: 100,

  // --- Niveaus + duiding ---------------------------------------------------
  // Wordt van hoog naar laag doorlopen; het eerste niveau waarvan de score
  // >= minScore is, wordt gekozen. Houd de lijst dus aflopend gesorteerd.
  // 'tone' bepaalt de kleur van de score-ring (zie config/branding.ts -> colors.score).
  levels: [
    {
      minScore: 85,
      tone: "positive",
      label: "Sterk op stijl",
      description:
        "De content sluit goed aan bij de Europabank-huisstijl. Loop de verbeterpunten na en laat altijd een menselijke eindredactie gebeuren.",
    },
    {
      minScore: 60,
      tone: "warn",
      label: "Enkele verbeterpunten",
      description:
        "De tekst zit grotendeels goed, maar er zijn punten die de huisstijl versterken. Bekijk vooral de punten met hoge impact.",
    },
    {
      minScore: 30,
      tone: "caution",
      label: "Meerdere afwijkingen",
      description:
        "De content wijkt op verschillende punten af van de huisstijl. Een herwerking is aangewezen.",
    },
    {
      minScore: 0,
      tone: "danger",
      label: "Grondige herwerking nodig",
      description:
        "De tekst wijkt sterk af van de huisstijl. Herwerk de content grondig op basis van de verbeterpunten.",
    },
  ],
} as const;

/** Toon-sleutels die naar een kleur in branding.colors.score verwijzen. */
export type LevelTone = "positive" | "warn" | "caution" | "danger";
