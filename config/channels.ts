/**
 * ============================================================================
 *  KANALEN  —  vrij aanpasbaar ZONDER code aan te raken
 * ============================================================================
 *
 *  De gebruiker duidt aan waar de tekst gebruikt wordt (website, nieuwsbrief,
 *  social media, ...). Die keuze stuurt de analyse:
 *
 *   - 'guidance'      → gaat letterlijk mee in de prompt. Zeg wat er voor dit
 *                       kanaal écht toe doet en wat de tool mag laten passeren.
 *   - 'depth'         → "volledig": grondige controle op alle stijlregels.
 *                       "licht": enkel wat de lezer meteen opvalt; details
 *                       (notatie, hoofdletters, een enkele stroeve zin) laten
 *                       we passeren.
 *   - 'maxFindings'   → richtcijfer voor het aantal verbeterpunten.
 *   - 'penaltyFactor' → vermenigvuldigt de score-aftrek (1 = normaal,
 *                       0.6 = 40 % milder). Zo weegt een fout in een tweet
 *                       minder zwaar dan dezelfde fout op een webpagina.
 *
 *  Meerdere kanalen tegelijk? Dan geldt de strengste 'depth' ("volledig"),
 *  het hoogste 'maxFindings' en het gemiddelde van de 'penaltyFactor's
 *  (zie lib/score.ts). Geen kanaal gekozen? Dan geldt 'defaultChannelId'.
 *
 *  Een kanaal toevoegen: kopieer een blok, geef het een uniek 'id' en een
 *  label. Commit + push → Vercel deployt automatisch.
 * ============================================================================
 */

export type ChannelDepth = "volledig" | "licht";

export interface Channel {
  id: string;
  label: string;
  hint: string; // korte uitleg onder de chip (tooltip/hint)
  depth: ChannelDepth;
  maxFindings: number;
  penaltyFactor: number;
  guidance: string; // gaat letterlijk mee in de prompt
}

export const channels: Channel[] = [
  {
    id: "website",
    label: "Website",
    hint: "Product- en themapagina's, blog, FAQ",
    depth: "volledig",
    maxFindings: 10,
    penaltyFactor: 1,
    guidance: `Website: de tekst wordt gescand en moet lang meegaan. Controleer grondig op alle stijlregels: aanspreking en stem, structuur (belofte → bewijs → advies, duidelijke CTA), scanbaarheid (korte alinea's, tussentitels, bullets), spreektaal, merkspelling en notatie van bedragen en getallen.`,
  },
  {
    id: "nieuwsbrief",
    label: "Nieuwsbrief",
    hint: "E-mailnieuwsbrief naar klanten",
    depth: "volledig",
    maxFindings: 8,
    penaltyFactor: 1,
    guidance: `Nieuwsbrief: kort, warm en meteen ter zake. Let vooral op de aanspreking, een persoonlijke en actieve toon, korte zinnen en alinea's, één duidelijke CTA per blok en de begroeting en afsluiting. Onderwerpregel en preheader vallen ook onder de titelregels.`,
  },
  {
    id: "social",
    label: "Social media",
    hint: "LinkedIn, Facebook, Instagram — post of begeleidende copy",
    depth: "licht",
    maxFindings: 4,
    penaltyFactor: 0.6,
    guidance: `Social media: dit is korte, begeleidende copy. Ze moet juist zijn, niet perfect. Flag ENKEL wat de lezer meteen opvalt: verkeerde aanspreking, een belerende of afstandelijke toon, verboden constructies, dt-fouten en foute merkspelling. Laat details passeren: notatie van bedragen en getallen, hoofdletters en afkortingen, structuurregels (belofte → bewijs → advies gelden hier niet), alinealengte, en een enkele wat stroeve zin. Een emoji, een losse zin zonder werkwoord of een informelere toon is op social geen afwijking. Hou het bij maximaal een handvol punten.`,
  },
  {
    id: "mail",
    label: "E-mail of brief",
    hint: "Individuele klantcommunicatie, mailings, brieven",
    depth: "volledig",
    maxFindings: 8,
    penaltyFactor: 1,
    guidance: `E-mail of brief aan een klant: controleer nauwkeurig de aanhef, het onderwerp en de slotformule (zie begroeting-en-afsluiting), de u-vorm, terugverwijzingen (die/dat), verouderde of ambtelijke woorden en dt-fouten. Structuurregels voor lange webcontent (tussentitels, bullets) zijn hier minder relevant; flag ze enkel bij lange brieven.`,
  },
  {
    id: "print",
    label: "Print",
    hint: "Folder, brochure, affiche, advertentie",
    depth: "volledig",
    maxFindings: 8,
    penaltyFactor: 1,
    guidance: `Print (folder, brochure, affiche): de tekst is definitief zodra hij gedrukt is, dus wees nauwkeurig op spelling, merkspelling, notatie van bedragen, hoofdletters en dt. Toon en aanspreking blijven kernregels. Korte kopregels of slogans zonder werkwoord zijn in print geen afwijking.`,
  },
];

/** Kanaal dat geldt als de gebruiker niets aanduidt. */
export const defaultChannelId = "website";

/** Zoekt kanalen op id; onbekende id's worden genegeerd. */
export function resolveChannels(ids: string[]): Channel[] {
  const found = channels.filter((c) => ids.includes(c.id));
  if (found.length > 0) return found;
  const def = channels.find((c) => c.id === defaultChannelId);
  return def ? [def] : [];
}
