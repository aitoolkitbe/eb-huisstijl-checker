/**
 * POST /api/rewrite
 *
 * Ontvangt de oorspronkelijke content + de geselecteerde aandachtspunten en
 * geeft een herschreven versie terug waarin ENKEL die punten verwerkt zijn.
 * Stuurt altijd de volledige context mee (geen geheugen tussen calls).
 *
 * Body (JSON): { content: string, findings: Finding[] }
 */

import { NextRequest, NextResponse } from "next/server";
import { runRewrite, MAX_INPUT_CHARS } from "@/lib/claude";
import type { Finding } from "@/lib/types";

export const maxDuration = 60;
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const content = String(body?.content ?? "").trim();
    const findings: Finding[] = Array.isArray(body?.findings) ? body.findings : [];

    if (!content) {
      return NextResponse.json({ error: "emptyInput" }, { status: 400 });
    }
    if (content.length > MAX_INPUT_CHARS) {
      return NextResponse.json({ error: "tooLong" }, { status: 413 });
    }
    if (findings.length === 0) {
      return NextResponse.json({ error: "noneSelected" }, { status: 400 });
    }

    const rewritten = await runRewrite(content, findings);
    return NextResponse.json({ rewritten });
  } catch (err) {
    console.error("rewrite error:", err);
    return NextResponse.json({ error: "api" }, { status: 500 });
  }
}
