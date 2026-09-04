/**
 * POST /api/analyze
 *
 * Ontvangt content via FormData (één van: file / text / url), extraheert
 * serverside platte tekst, voert de analyse uit met Claude en geeft een
 * gescoorde analyse terug.
 *
 * Foutafhandeling voor: leeg, te lang, onleesbaar bestand, onbereikbare URL,
 * API-fout en parse-fout. De client koppelt de foutcode aan een tekst uit
 * /config/ui-text.ts.
 */

import { NextRequest, NextResponse } from "next/server";
import { runAnalysis, MAX_INPUT_CHARS } from "@/lib/claude";
import { scoreAnalysis } from "@/lib/score";
import { extractFromFile, extractFromUrl, ExtractError } from "@/lib/extract";

// Analyse kan even duren; geef de route wat ademruimte (Vercel).
export const maxDuration = 60;
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const mode = String(form.get("mode") ?? "");

    let content = "";

    if (mode === "file") {
      const file = form.get("file");
      if (!(file instanceof File)) {
        return NextResponse.json({ error: "emptyInput" }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      content = await extractFromFile(buffer, file.name);
    } else if (mode === "url") {
      const url = String(form.get("url") ?? "").trim();
      if (!url) return NextResponse.json({ error: "emptyInput" }, { status: 400 });
      content = await extractFromUrl(url);
    } else if (mode === "text") {
      content = String(form.get("text") ?? "");
    } else {
      return NextResponse.json({ error: "emptyInput" }, { status: 400 });
    }

    content = content.trim();

    if (!content) {
      return NextResponse.json({ error: "emptyInput" }, { status: 400 });
    }
    if (content.length > MAX_INPUT_CHARS) {
      return NextResponse.json({ error: "tooLong" }, { status: 413 });
    }

    // Kanalen: komma-gescheiden id's uit config/channels.ts (optioneel).
    const channelIds = String(form.get("channels") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const analysis = await runAnalysis(content, channelIds);
    const scored = scoreAnalysis(analysis, content, channelIds);

    // Stuur de geëxtraheerde content mee terug; de client heeft die nodig voor
    // de herschrijf-call (volledige context, geen geheugen tussen calls).
    return NextResponse.json({ ...scored, content });
  } catch (err) {
    if (err instanceof ExtractError) {
      const map: Record<string, string> = {
        FILE_TYPE: "fileType",
        FILE_UNREADABLE: "fileUnreadable",
        URL_UNREACHABLE: "urlUnreachable",
      };
      return NextResponse.json(
        { error: map[err.code] ?? "generic" },
        { status: 400 },
      );
    }
    if (err instanceof Error && err.message === "PARSE_ERROR") {
      return NextResponse.json({ error: "parse" }, { status: 502 });
    }
    console.error("analyze error:", err);
    return NextResponse.json({ error: "api" }, { status: 500 });
  }
}
