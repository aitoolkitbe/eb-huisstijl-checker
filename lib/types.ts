/**
 * Gedeelde TypeScript-types voor de Pre-compliance Checker.
 * (Bevat geen instelbare waarden — die staan in /config.)
 */

import type { Severity } from "@/config/scoring";

/** Eén aandachtspunt uit de analyse. */
export interface Finding {
  id: string; // uniek id, bv. "p1"
  title: string; // korte titel van het aandachtspunt
  rule: string; // geraakte regel/bron (zoals in de kennisbasis)
  fragment: string; // exact tekstfragment uit de aangeleverde content
  why: string; // waarom dit een aandachtspunt is
  suggestion: string; // concreet verbetervoorstel
  severity: Severity; // "hoog" | "middel" | "laag"
  outOfScope?: boolean; // true = buiten de huidige regelset
}

/** Ruwe analyse zoals Claude ze als JSON teruggeeft. */
export interface AnalysisResult {
  findings: Finding[];
  summary?: string; // korte, waarderende samenvatting van Claude
  strengths?: string[]; // wat al goed zit volgens het stijlboek (2–4 punten)
}

/** Verrijkte analyse met berekende score (server voegt dit toe). */
export interface ScoredAnalysis extends AnalysisResult {
  channels: string[]; // kanaal-id's waarvoor beoordeeld werd (zie config/channels.ts)
  score: number; // 0–100
  levelLabel: string; // niveaulabel uit scoring.ts
  levelDescription: string; // niveauduiding uit scoring.ts
  levelTone: "positive" | "warn" | "caution" | "danger"; // kleur-toon van de score-ring
}

/** Antwoord van /api/analyze. */
export interface AnalyzeResponse extends ScoredAnalysis {}

/** Antwoord van /api/rewrite. */
export interface RewriteResponse {
  rewritten: string;
}
