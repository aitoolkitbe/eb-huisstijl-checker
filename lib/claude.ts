/**
 * Claude API-client + prompts voor huisstijl-analyse en herschrijving.
 *
 *  - De API-key komt UITSLUITEND uit process.env.ANTHROPIC_API_KEY (serverside).
 *    De key komt nooit in de client terecht.
 *  - Het model staat als CONSTANTE bovenaan, makkelijk te wisselen.
 *  - Het stijlboek wordt als apart systeemblok meegestuurd MET prompt caching
 *    (cache_control), zodat herhaalde calls het stijlboek niet telkens opnieuw
 *    moeten verwerken.
 */

import Anthropic from "@anthropic-ai/sdk";
import { loadKnowledgeBase } from "@/lib/knowledge";
import type { AnalysisResult } from "@/lib/types";

// ============================================================================
//  MODEL-INSTELLINGEN  —  hier wisselen, niet verspreid in de code
// ============================================================================
//  Default: claude-sonnet-4-6 voor zowel analyse als herschrijving.
//  Wil je besparen bij volume? Zet MODEL_ANALYZE op "claude-haiku-4-5-20251001".
export const MODEL_ANALYZE = "claude-sonnet-4-6";
export const MODEL_REWRITE = "claude-sonnet-4-6";

// Maximale grootte van de te controleren content (in tekens). Voorkomt te lange input.
export const MAX_INPUT_CHARS = 60_000;

const MAX_TOKENS_ANALYZE = 4096;
const MAX_TOKENS_REWRITE = 8192;

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY ontbreekt in de serveromgeving.");
  }
  return new Anthropic({ apiKey });
}

/**
 * Bouwt de systeemprompt als twee blokken:
 *   1) de instructies (gedrag van de tool);
 *   2) het stijlboek, gemarkeerd met cache_control voor prompt caching.
 */
function buildSystemBlocks(extra: string): Anthropic.TextBlockParam[] {
  const knowledge = loadKnowledgeBase();
  return [
    {
      type: "text",
      text: `Je bent een redactionele assistent die content van Europabank (Belgische bank-verzekeraar) controleert op naleving van de EUROPABANK-HUISSTIJL.

STRIKTE REGELS:
- Je toetst UITSLUITEND tegen het meegeleverde stijlboek hieronder. Verzin NOOIT eigen stijlregels.
- Flag ENKEL wat het stijlboek expliciet dekt. Staat iets niet in het stijlboek, flag het dan NIET (ook niet op basis van algemene schrijfconventies of je eigen voorkeur).
- Bronnen van het type "context" (bv. beeldtaal, voorbeelden) zijn achtergrond: gebruik ze om de juiste toon te begrijpen, maar flag beeldregels enkel als de content zelf over beeldkeuze gaat.
- Citeer bij "rule" zo exact mogelijk de geraakte stijlregel zoals die in het stijlboek staat.
- Wees concreet en constructief: elk punt heeft een duidelijk, toepasbaar voorstel in de Europabank-stem.

${extra}`,
    },
    {
      type: "text",
      text: `STIJLBOEK (de huisstijl waartegen je toetst):\n${knowledge}`,
      cache_control: { type: "ephemeral" },
    },
  ];
}

/** Voert de huisstijl-analyse uit en geeft de ruwe (nog niet gescoorde) JSON terug. */
export async function runAnalysis(content: string): Promise<AnalysisResult> {
  const client = getClient();

  const system = buildSystemBlocks(
    `OPDRACHT: controleer de content van de gebruiker tegen het stijlboek en geef de verbeterpunten terug.

Antwoord UITSLUITEND met geldige JSON (geen uitleg, geen markdown, geen code-fences), met deze structuur:
{
  "summary": "korte neutrale samenvatting in één zin",
  "findings": [
    {
      "id": "p1",
      "title": "korte titel van het verbeterpunt",
      "rule": "geraakte stijlregel exact zoals in het stijlboek (bv. 'Aanspreking: gebruik de u-vorm, warm en actief')",
      "fragment": "het EXACTE tekstfragment uit de content waarop dit slaat",
      "why": "waarom dit afwijkt van de huisstijl, in begrijpelijke taal",
      "suggestion": "concreet, toepasbaar voorstel in de Europabank-stem",
      "severity": "hoog" | "middel" | "laag",
      "outOfScope": false
    }
  ]
}

RICHTLIJNEN:
- Geef elk verbeterpunt een uniek id (p1, p2, p3, ...).
- "fragment" moet een letterlijk fragment uit de content zijn (kort, maar herkenbaar).
- "severity" = de IMPACT op de huisstijl: "hoog" = duidelijke kernregel (bv. stem, aanspreking, verboden constructie); "middel" = merkbaar aandachtspunt; "laag" = klein/vorm.
- Flag ALLEEN afwijkingen van regels die in het stijlboek staan. Vind je niets, geef dan "findings": [].
- Gebruik exact de bovenstaande sleutelnamen en voeg geen extra velden toe.`,
  );

  const resp = await client.messages.create({
    model: MODEL_ANALYZE,
    max_tokens: MAX_TOKENS_ANALYZE,
    system,
    messages: [
      {
        role: "user",
        content: `Te controleren content:\n"""\n${content}\n"""`,
      },
    ],
  });

  const text = extractText(resp);
  return parseAnalysisJson(text);
}

/**
 * Herschrijft de content en past UITSLUITEND de geselecteerde verbeterpunten toe.
 * Stuurt altijd de volledige context mee (geen geheugen tussen calls).
 */
export async function runRewrite(
  originalContent: string,
  selectedFindings: AnalysisResult["findings"],
): Promise<string> {
  const client = getClient();

  const findingsText = selectedFindings
    .map(
      (f, i) =>
        `${i + 1}. [${f.severity}] ${f.title}\n   Stijlregel: ${f.rule}\n   Fragment: ${f.fragment}\n   Voorstel: ${f.suggestion}`,
    )
    .join("\n\n");

  const system = buildSystemBlocks(
    `OPDRACHT: herschrijf de content van de gebruiker zodat ze beter aansluit bij de Europabank-huisstijl.

ZEER BELANGRIJK:
- Pas UITSLUITEND de hieronder opgesomde, geselecteerde verbeterpunten toe.
- Laat alle andere delen van de tekst ONGEWIJZIGD. Pas dus geen punten toe die niet in de lijst staan.
- Behoud de oorspronkelijke betekenis en feiten. Verzin geen nieuwe feiten, cijfers of bronnen.
- Schrijf in de Europabank-stem (mensentaal, 'u', warm en actief), maar enkel waar de geselecteerde punten dat vragen.
- Antwoord met ENKEL de herschreven tekst (platte tekst, geen uitleg, geen markdown-codeblok, geen commentaar vooraf of nadien).`,
  );

  const resp = await client.messages.create({
    model: MODEL_REWRITE,
    max_tokens: MAX_TOKENS_REWRITE,
    system,
    messages: [
      {
        role: "user",
        content: `Oorspronkelijke content:\n"""\n${originalContent}\n"""\n\nToe te passen verbeterpunten (en ENKEL deze):\n${findingsText}\n\nGeef nu de herschreven tekst.`,
      },
    ],
  });

  return extractText(resp).trim();
}

// ---------------------------------------------------------------------------
//  Hulpfuncties
// ---------------------------------------------------------------------------

function extractText(resp: Anthropic.Message): string {
  return resp.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

/** Robuuste JSON-parsing: strip eventuele code-fences en parse veilig. */
export function parseAnalysisJson(raw: string): AnalysisResult {
  let text = raw.trim();

  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) text = fence[1].trim();

  if (!text.startsWith("{")) {
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    if (first !== -1 && last !== -1 && last > first) {
      text = text.slice(first, last + 1);
    }
  }

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("PARSE_ERROR");
  }

  const obj = (data ?? {}) as Record<string, unknown>;
  const rawFindings = Array.isArray(obj.findings) ? obj.findings : [];

  const findings = rawFindings.map((f, i) => {
    const x = (f ?? {}) as Record<string, unknown>;
    const sev = String(x.severity ?? "laag").toLowerCase();
    return {
      id: String(x.id ?? `p${i + 1}`),
      title: String(x.title ?? "Verbeterpunt"),
      rule: String(x.rule ?? ""),
      fragment: String(x.fragment ?? ""),
      why: String(x.why ?? ""),
      suggestion: String(x.suggestion ?? ""),
      severity: (sev === "hoog" || sev === "middel" ? sev : "laag") as
        | "hoog"
        | "middel"
        | "laag",
      outOfScope: Boolean(x.outOfScope),
    };
  });

  return {
    summary: typeof obj.summary === "string" ? obj.summary : undefined,
    findings,
  };
}
