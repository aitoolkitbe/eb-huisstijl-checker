/**
 * Berekent de compliance-score op basis van de aandachtspunten en de
 * instellingen in /config/scoring.ts. Bevat zelf GEEN drempels of gewichten —
 * die staan allemaal in de config.
 */

import { scoring, type LevelTone } from "@/config/scoring";
import type { AnalysisResult, ScoredAnalysis } from "@/lib/types";

export function scoreAnalysis(analysis: AnalysisResult): ScoredAnalysis {
  // Tel de aftrekpunten op. Punten "buiten de huidige regelset" tellen NIET mee
  // voor de score (we doen er immers geen compliance-uitspraak over).
  let penalty = 0;
  for (const f of analysis.findings) {
    if (f.outOfScope) continue;
    penalty += scoring.weights[f.severity] ?? 0;
  }
  penalty = Math.min(penalty, scoring.maxPenalty);

  const score = Math.max(0, scoring.startScore - penalty);

  // Bepaal het niveau: eerste niveau (van hoog naar laag) waarvan score >= minScore.
  const level =
    scoring.levels.find((l) => score >= l.minScore) ??
    scoring.levels[scoring.levels.length - 1];

  return {
    ...analysis,
    score,
    levelLabel: level.label,
    levelDescription: level.description,
    levelTone: level.tone as LevelTone,
  };
}
