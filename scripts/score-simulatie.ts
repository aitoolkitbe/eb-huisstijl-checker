/**
 * Snelle simulatie van de score-formule, zonder API-call.
 *   npx tsx scripts/score-simulatie.ts
 * Handig om te voelen wat een aanpassing in config/scoring.ts doet.
 */
import { scoreAnalysis } from "../lib/score";
import type { Finding } from "../lib/types";

function mk(hoog: number, middel: number, laag: number): Finding[] {
  const out: Finding[] = [];
  const add = (sev: Finding["severity"], n: number) => {
    for (let i = 0; i < n; i++)
      out.push({ id: `p${out.length + 1}`, title: "", rule: "", fragment: "", why: "", suggestion: "", severity: sev });
  };
  add("hoog", hoog); add("middel", middel); add("laag", laag);
  return out;
}

const cases: Array<[string, number, number, number, number]> = [
  ["schone tekst", 0, 0, 0, 200],
  ["1 laag", 0, 0, 1, 200],
  ["1 hoog", 1, 0, 0, 200],
  ["1 hoog + 2 laag", 1, 0, 2, 200],
  ["2 hoog + 2 middel", 2, 2, 0, 200],
  ["4 hoog + 4 middel", 4, 4, 0, 200],
  ["4 hoog + 4 middel (900 w)", 4, 4, 0, 900],
  ["8 hoog + 6 middel", 8, 6, 0, 200],
  ["12 hoog + 10 middel + 5 laag", 12, 10, 5, 200],
];

for (const [name, h, m, l, words] of cases) {
  const content = Array(words).fill("woord").join(" ");
  const r = scoreAnalysis({ findings: mk(h, m, l) }, content);
  console.log(`${name.padEnd(32)} → ${String(r.score).padStart(3)}  ${r.levelLabel}`);
}
