"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { uiText } from "@/config/ui-text";
import type { Finding, ScoredAnalysis } from "@/lib/types";
import BrandLockup from "@/components/BrandLockup";
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
          channels: analysis.channels,
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
      {/* Gele merkbalk + lichte sticky kop, conform de bureau-preview */}
      <div style={{ height: 5, backgroundColor: "var(--eb-primary)" }} />
      <header
        className="sticky top-0 z-50"
        style={{
          backgroundColor: "var(--eb-bg)",
          borderBottom: "1px solid var(--eb-border-dim)",
        }}
      >
        <div
          className="mx-auto flex max-w-3xl items-center justify-between gap-6 px-4"
          style={{ paddingTop: 25, paddingBottom: 25 }}
        >
          <div className="flex min-w-0 items-center gap-4">
            <BrandLockup />
            <span
              aria-hidden
              style={{ width: 1, height: 28, backgroundColor: "var(--eb-border)" }}
            />
            <div className="flex min-w-0 flex-col justify-center">
            <span
              className="whitespace-nowrap text-sm font-bold"
              style={{ color: "var(--eb-muted)" }}
            >
              {uiText.app.title}
            </span>
            <span
              className="whitespace-nowrap"
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--eb-neutral)",
                marginTop: 2,
              }}
            >
              AI tool by De Content Studio x June20
            </span>
          </div>
          </div>
        </div>
      </header>

      {/* Intropaneel: wit paneel op grijze pagina, met gele accentbalk (preview .intro) */}
      <div className="mx-auto max-w-3xl px-4 pt-8">
        <section
          className="relative overflow-hidden"
          style={{
            backgroundColor: "var(--eb-bg)",
            border: "1px solid var(--eb-border-dim)",
            padding: "40px 36px",
          }}
        >
          <div
            aria-hidden
            className="absolute left-0 top-0 w-full"
            style={{ height: 6, backgroundColor: "var(--eb-primary)" }}
          />
          <h1
            className="text-3xl font-extrabold sm:text-4xl"
            style={{ color: "var(--eb-ink)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
          >
            {uiText.app.title}
          </h1>
          <p className="mt-3 max-w-xl text-sm" style={{ color: "var(--eb-muted)" }}>
            {uiText.app.subtitle}
          </p>
        </section>
      </div>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Stappen-indicator */}
        <Stepper hasResult={hasResult} hasRewrite={rewritten !== null} />

        <div className="space-y-6">
          <Disclaimer />

          <InputPanel loading={analyzing} onAnalyze={handleAnalyze} />

          {error && (
            <div
              role="alert"
              className="eb-alert eb-fade-in text-sm"
              style={{
                borderColor: "rgba(192, 57, 43, 0.25)",
                borderLeftColor: "var(--eb-sev-hoog)",
                backgroundColor: "rgba(192, 57, 43, 0.07)",
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
                summary={analysis.summary}
                strengths={analysis.strengths}
                channelIds={analysis.channels}
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
    { n: 3, label: "Verbeterpunten", done: hasResult },
    { n: 4, label: "Verbeteren", done: hasRewrite },
  ];
  return (
    <ol className="mb-7 flex items-center gap-2" aria-label="Stappen">
      {steps.map((s, i) => (
        <li key={s.n} className="flex flex-1 items-center gap-2">
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center text-xs font-bold transition-colors"
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
