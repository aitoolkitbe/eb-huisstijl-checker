"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { branding } from "@/config/branding";
import { uiText } from "@/config/ui-text";
import type { Finding, ScoredAnalysis } from "@/lib/types";
import Disclaimer from "@/components/Disclaimer";
import Footer from "@/components/Footer";
import InputPanel from "@/components/InputPanel";
import ScoreCard from "@/components/ScoreCard";
import FindingsList from "@/components/FindingsList";
import ResultPanel from "@/components/ResultPanel";

type ErrKey = keyof typeof uiText.errors;

interface AnalysisState extends ScoredAnalysis {
  content: string; // geëxtraheerde brontekst (nodig voor herschrijven)
}

export default function Page() {
  const [analysis, setAnalysis] = useState<AnalysisState | null>(null);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [analyzing, setAnalyzing] = useState(false);
  const [rewriting, setRewriting] = useState(false);
  const [rewritten, setRewritten] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function errText(key: string): string {
    return uiText.errors[key as ErrKey] ?? uiText.errors.generic;
  }

  async function handleAnalyze(form: FormData) {
    setAnalyzing(true);
    setError(null);
    setAnalysis(null);
    setRewritten(null);
    setSelected({});
    try {
      const res = await fetch("/api/analyze", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(errText(data?.error));
        return;
      }
      const result = data as AnalysisState;
      setAnalysis(result);
      const init: Record<string, boolean> = {};
      for (const f of result.findings) init[f.id] = !f.outOfScope;
      setSelected(init);
    } catch {
      setError(uiText.errors.generic);
    } finally {
      setAnalyzing(false);
    }
  }

  function toggle(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  function setAll(value: boolean) {
    if (!analysis) return;
    const next: Record<string, boolean> = {};
    for (const f of analysis.findings) next[f.id] = value && !f.outOfScope;
    setSelected(next);
  }

  const selectedFindings: Finding[] = analysis
    ? analysis.findings.filter((f) => selected[f.id])
    : [];

  async function handleGenerate() {
    if (!analysis) return;
    setRewriting(true);
    setError(null);
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: analysis.content,
          findings: selectedFindings,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(errText(data?.error));
        return;
      }
      setRewritten(data.rewritten as string);
    } catch {
      setError(uiText.errors.generic);
    } finally {
      setRewriting(false);
    }
  }

  const hasResult = analysis !== null;

  return (
    <div className="min-h-screen">
      {/* Dunne merk-accentbar bovenaan */}
      <div style={{ height: 4, backgroundColor: "var(--eb-primary)" }} />

      {/* Header */}
      <header
        className="sticky top-0 z-10 border-b backdrop-blur"
        style={{
          borderColor: "var(--eb-border)",
          backgroundColor: "rgba(255,255,255,0.85)",
        }}
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Logo />
          <span
            className="hidden text-xs font-medium sm:inline"
            style={{ color: "var(--eb-muted)" }}
          >
            {uiText.app.title}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Titelblok */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {uiText.app.title}
          </h1>
          <p className="mt-2 max-w-xl text-sm" style={{ color: "var(--eb-muted)" }}>
            {uiText.app.subtitle}
          </p>
        </div>

        {/* Stappen-indicator */}
        <Stepper hasResult={hasResult} hasRewrite={rewritten !== null} />

        <div className="space-y-6">
          <Disclaimer />

          <InputPanel loading={analyzing} onAnalyze={handleAnalyze} />

          {error && (
            <div
              role="alert"
              className="eb-fade-in flex items-start gap-3 rounded-xl border-l-4 p-4 text-sm"
              style={{
                borderColor: "var(--eb-sev-hoog)",
                backgroundColor: "#FCEDED",
                color: "var(--eb-sev-hoog)",
              }}
            >
              <AlertCircle size={18} aria-hidden className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {analyzing && !analysis && <AnalyzingState />}

          {analysis && (
            <div className="eb-fade-in space-y-6">
              <ScoreCard
                score={analysis.score}
                levelLabel={analysis.levelLabel}
                levelDescription={analysis.levelDescription}
                tone={analysis.levelTone}
                findingsCount={analysis.findings.filter((f) => !f.outOfScope).length}
              />
              <FindingsList
                findings={analysis.findings}
                selected={selected}
                onToggle={toggle}
                onSelectAll={() => setAll(true)}
                onDeselectAll={() => setAll(false)}
              />
              <ResultPanel
                rewritten={rewritten}
                loading={rewriting}
                selectedCount={selectedFindings.length}
                onGenerate={handleGenerate}
              />
            </div>
          )}
        </div>

        <Footer />
      </main>
    </div>
  );
}

/* --- Header-logo met robuuste fallback ----------------------------------- */
function Logo() {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = branding.logo.src && !imgFailed;

  if (showImage) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={branding.logo.src}
        alt={branding.logo.alt}
        style={{ height: branding.logo.height, width: "auto" }}
        onError={() => setImgFailed(true)}
      />
    );
  }
  // Fallback: nette tekstbadge als er (nog) geen geldig logobestand is.
  return (
    <span className="inline-flex items-center gap-2" aria-label={branding.logo.alt}>
      <span
        className="flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold"
        style={{
          backgroundColor: "var(--eb-primary)",
          color: "var(--eb-primary-text)",
        }}
      >
        e
      </span>
      <span className="text-lg font-bold tracking-tight">
        {branding.logo.fallbackText}
      </span>
    </span>
  );
}

/* --- Stappen-indicator ---------------------------------------------------- */
function Stepper({
  hasResult,
  hasRewrite,
}: {
  hasResult: boolean;
  hasRewrite: boolean;
}) {
  const steps = [
    { n: 1, label: "Aanleveren", done: true },
    { n: 2, label: "Score", done: hasResult },
    { n: 3, label: "Aandachtspunten", done: hasResult },
    { n: 4, label: "Verbeteren", done: hasRewrite },
  ];
  return (
    <ol className="mb-7 flex items-center gap-2" aria-label="Stappen">
      {steps.map((s, i) => (
        <li key={s.n} className="flex flex-1 items-center gap-2">
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors"
            style={{
              backgroundColor: s.done ? "var(--eb-primary)" : "var(--eb-surface)",
              color: s.done ? "var(--eb-primary-text)" : "var(--eb-muted)",
              border: s.done ? "none" : "1px solid var(--eb-border)",
            }}
          >
            {s.n}
          </span>
          <span
            className="hidden text-xs font-medium sm:inline"
            style={{ color: s.done ? "var(--eb-ink)" : "var(--eb-muted)" }}
          >
            {s.label}
          </span>
          {i < steps.length - 1 && (
            <span
              className="h-px flex-1"
              style={{ backgroundColor: "var(--eb-border)" }}
            />
          )}
        </li>
      ))}
    </ol>
  );
}

/* --- Laadtoestand tijdens analyse ---------------------------------------- */
function AnalyzingState() {
  return (
    <div
      className="eb-card eb-fade-in flex items-center gap-3 p-6 text-sm"
      style={{ color: "var(--eb-muted)" }}
    >
      <span className="eb-spinner" style={{ color: "var(--eb-ink)" }} />
      {uiText.input.analyzingButton}
    </div>
  );
}
