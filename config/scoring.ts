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
 *   1. De analyse levert verbeterpunten op, elk met een impact:
 *      "hoog", "middel" of "laag". Elk punt telt aftrekpunten volgens 'weights'.
 *   2. LENGTECORRECTIE — een lange tekst heeft van nature meer verbeterpunten
 *      dan een korte. Boven 'referenceWords' woorden wordt de aftrek
 *      evenredig verkleind (dubbel zo lang = half zoveel aftrek per punt).
 *   3. AFVLAKKING — de aftrek telt niet lineair door. De eerste punten wegen
 *      het zwaarst, elk volgend punt weegt iets minder. Zo landt een tekst met
 *      veel kleine opmerkingen niet op 0 en blijft de score zinvol.
 *      De score kan nooit lager dan (100 − softCap).
 *   4. 'levels' bepaalt welk niveau en welke duiding bij de score hoort.
 *
 *  Richtwaarden met de instellingen hieronder (tekst ≤ 300 woorden):
 *    1 hoog punt            → 91
 *    2 hoog + 2 middel      → 75
 *    4 hoog + 4 middel      → 57
 *    8 hoog + 6 middel      → 38
 *  (Ter vergelijking, de oude lineaire formule: 4 hoog + 4 middel → 0.)
 *
 *  Hoe pas je iets aan?
 *   - Strenger/milder? Verhoog/verlaag de getallen in 'weights'.
 *   - Lange teksten milder? Verlaag 'referenceWords'.
 *   - Sneller afvlakken? Verlaag 'softCap' (score zakt dan minder diep).
 *   - Andere niveaugrenzen? Pas 'minScore' in 'levels' aan.
 *   - Andere duiding? Herschrijf 'label' en 'description' per niveau.
 *   Commit + push → Vercel deployt automatisch. Geen code nodig.
 * ============================================================================
 */

export type Severity = "hoog" | "middel" | "laag";

export const scoring = {
  // --- Startscore ----------------------------------------------------------
  startScore: 100,

  // --- Gewichten per impact ------------------------------------------------
  // Ruwe aftrekpunten per verbeterpunt, naargelang de impact op de huisstijl.
  weights: {
    hoog: 10,
    middel: 5,
    laag: 2,
  } satisfies Record<Severity, number>,

  // --- Lengtecorrectie -----------------------------------------------------
  // Tot dit aantal woorden telt elk punt volledig mee. Daarboven wordt de
  // totale aftrek vermenigvuldigd met (referenceWords / aantal woorden).
  referenceWords: 300,

  // --- Afvlakking ----------------------------------------------------------
  // Maximale totale aftrek. De werkelijke aftrek nadert deze waarde geleidelijk:
  //   aftrek = softCap × (1 − e^(−ruweAftrek / softCap))
  // Bij softCap 85 is de laagst mogelijke score dus 15.
  softCap: 85,

  // --- Niveaus + duiding ---------------------------------------------------
  // Wordt van hoog naar laag doorlopen; het eerste niveau waarvan de score
  // >= minScore is, wordt gekozen. Houd de lijst dus aflopend gesorteerd.
  // 'tone' bepaalt de kleur van de score-ring (zie config/branding.ts -> colors.score).
  // De duiding is bewust motiverend: benoem wat goed zit en wat de volgende stap is.
  levels: [
    {
      minScore: 80,
      tone: "positive",
      label: "Sterk op stijl",
      description:
        "Deze tekst zit stevig in de Europabank-stem. De verbeterpunten hieronder zijn de laatste puntjes op de i.",
    },
    {
      minScore: 60,
      tone: "warn",
      label: "Goed op weg",
      description:
        "De basis klopt. Met een paar gerichte aanpassingen — vooral de punten met hoge impact — zit deze tekst helemaal op stijl.",
    },
    {
      minScore: 40,
      tone: "caution",
      label: "Stevige basis, nog werk",
      description:
        "Er zit al veel goeds in. Een aantal terugkerende patronen trekt de tekst nog weg van de huisstijl; die pak je best eerst aan.",
    },
    {
      minScore: 0,
      tone: "danger",
      label: "Herwerking loont",
      description:
        "Deze tekst wint veel bij een herwerking in de Europabank-stem. Begin bij de punten met hoge impact — de verbeterde versie hieronder helpt je op weg.",
    },
  ],
} as const;

/** Toon-sleutels die naar een kleur in branding.colors.score verwijzen. */
export type LevelTone = "positive" | "warn" | "caution" | "danger";
