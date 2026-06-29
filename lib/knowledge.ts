/**
 * Laadt de kennisbasis (alle .md-bestanden in /knowledge) serverside in.
 *
 * - Het indexbestand (00-index.md) en bestanden die met "_" beginnen
 *   (bv. het sjabloon) worden NIET ingeladen.
 * - De inhoud wordt samengevoegd tot één tekstblok dat in de systeemprompt
 *   belandt (met prompt caching, zie lib/claude.ts).
 *
 * Beheerders voegen kennis toe door een .md-bestand bij te maken — geen code nodig.
 */

import fs from "node:fs";
import path from "node:path";

const KNOWLEDGE_DIR = path.join(process.cwd(), "knowledge");

let cached: string | null = null;

/** Leest en bundelt de volledige kennisbasis. Resultaat wordt in-memory gecachet. */
export function loadKnowledgeBase(): string {
  if (cached !== null) return cached;

  let files: string[] = [];
  try {
    files = fs.readdirSync(KNOWLEDGE_DIR);
  } catch {
    cached = "";
    return cached;
  }

  const mdFiles = files
    .filter((f) => f.toLowerCase().endsWith(".md"))
    .filter((f) => f !== "00-index.md")
    .filter((f) => !f.startsWith("_"))
    .sort();

  const blocks = mdFiles.map((file) => {
    const content = fs.readFileSync(path.join(KNOWLEDGE_DIR, file), "utf-8");
    return `\n\n===== BRON: ${file} =====\n${content.trim()}`;
  });

  cached = blocks.join("\n");
  return cached;
}

/** Lijst van actieve kennisbestanden (voor logging/diagnose). */
export function listKnowledgeFiles(): string[] {
  try {
    return fs
      .readdirSync(KNOWLEDGE_DIR)
      .filter((f) => f.toLowerCase().endsWith(".md"))
      .filter((f) => f !== "00-index.md" && !f.startsWith("_"))
      .sort();
  } catch {
    return [];
  }
}
