/**
 * Serverside tekstextractie uit bestanden en URL's.
 *  - .docx  → mammoth
 *  - .pdf   → pdf-parse
 *  - .txt   → rechtstreeks
 *  - URL    → ophalen + hoofdtekst extraheren met cheerio
 *
 * Alle functies gooien een Error met een herkenbare code bij problemen, zodat
 * de API-route een nette foutmelding (uit ui-text.ts) kan tonen.
 */

import mammoth from "mammoth";
// Importeer de interne module om de debug-modus van het pakket te vermijden.
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import * as cheerio from "cheerio";

export type ExtractErrorCode = "FILE_TYPE" | "FILE_UNREADABLE" | "URL_UNREACHABLE";

export class ExtractError extends Error {
  code: ExtractErrorCode;
  constructor(code: ExtractErrorCode, message?: string) {
    super(message ?? code);
    this.code = code;
  }
}

/** Extraheert platte tekst uit een geüpload bestand. */
export async function extractFromFile(
  buffer: Buffer,
  filename: string,
): Promise<string> {
  const lower = filename.toLowerCase();

  try {
    if (lower.endsWith(".txt")) {
      return buffer.toString("utf-8");
    }
    if (lower.endsWith(".docx")) {
      const { value } = await mammoth.extractRawText({ buffer });
      return value;
    }
    if (lower.endsWith(".pdf")) {
      const data = await pdfParse(buffer);
      return data.text;
    }
  } catch {
    throw new ExtractError("FILE_UNREADABLE");
  }

  throw new ExtractError("FILE_TYPE");
}

/** Haalt een webpagina op en extraheert de hoofdtekst. */
export async function extractFromUrl(url: string): Promise<string> {
  let html: string;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; EuropabankPrecomplianceChecker/1.0)",
      },
      // Voorkom hangende requests.
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    html = await res.text();
  } catch {
    throw new ExtractError("URL_UNREACHABLE");
  }

  try {
    const $ = cheerio.load(html);
    // Verwijder niet-inhoudelijke elementen.
    $("script, style, noscript, nav, header, footer, aside, form, svg").remove();

    // Probeer eerst de meest waarschijnlijke hoofdtekst-containers.
    const candidates = ["main", "article", '[role="main"]', "body"];
    let text = "";
    for (const sel of candidates) {
      const el = $(sel);
      if (el.length) {
        text = el.text();
        if (text.trim().length > 200) break;
      }
    }

    // Normaliseer witruimte.
    return text.replace(/\s+\n/g, "\n").replace(/[ \t]{2,}/g, " ").trim();
  } catch {
    throw new ExtractError("URL_UNREACHABLE");
  }
}
