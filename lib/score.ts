/**
 * Berekent de huisstijl-score op basis van de verbeterpunten en de
 * instellingen in /config/scoring.ts. Bevat zelf GEEN drempels of gewichten —
 * die staan allemaal in de config.
 *
 * Drie stappen (zie de uitleg in config/scoring.ts):
 *   1. ruwe aftrek = som van de gewichten per verbeterpunt;
 *   2. lengtecorrectie voor teksten langer dan 'referenceWords';
 *   3. afvlakking: aftrek = softCap × (1 − e^(−ruw / softCap)).
 */

import { scoring, type LevelTone } from "@/config/scoring";
import { resolveChannels } from "@/config/channels";
import type { AnalysisResult, ScoredAnalysis } from "@/lib/types";

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function scoreAnalysis(
  analysis: AnalysisResult,
  content = "",
  channelIds: string[] = [],
): ScoredAnalysis {
  const chans = resolveChannels(channelIds);
  // 1. Ruwe aftrek. Punten "buiten het stijlboek" tellen NIET mee.
  let raw = 0;
  for (const f of analysis.findings) {
    if (f.outOfScope) continue;
    raw += scoring.weights[f.severity] ?? 0;
  }

  // 2. Lengtecorrectie: langere teksten krijgen evenredig minder aftrek.
  const words = countWords(content);
  if (words > scoring.referenceWords) {
    raw *= scoring.referenceWords / words;
  }

  // 2b. Kanaalfactor: gemiddelde penaltyFactor van de gekozen kanalen
  //     (bv. social 0.6 → 40 % milder). Zie config/channels.ts.
  if (chans.length > 0) {
    raw *= chans.reduce((a, c) => a + c.penaltyFactor, 0) / chans.length;
  }

  // 3. Afvlakking: de eerste punten wegen zwaar, elk volgend punt minder.
  const penalty =
    scoring.softCap * (1 - Math.exp(-raw / scoring.softCap));

  const score = Math.max(0, Math.round(scoring.startScore - penalty));

  // Bepaal het niveau: eerste niveau (van hoog naar laag) waarvan score >= minScore.
  const level =
    scoring.levels.find((l) => score >= l.minScore) ??
    scoring.levels[scoring.levels.length - 1];

  return {
    ...analysis,
    channels: chans.map((c) => c.id),
    score,
    levelLabel: level.label,
    levelDescription: level.description,
    levelTone: level.tone as LevelTone,
  };
}
