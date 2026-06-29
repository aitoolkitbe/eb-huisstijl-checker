"use client";

import { CheckCircle2 } from "lucide-react";
import { uiText } from "@/config/ui-text";
import type { Finding } from "@/lib/types";

interface Props {
  findings: Finding[];
  selected: Record<string, boolean>;
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const severityOrder: Record<Finding["severity"], number> = {
  hoog: 0,
  middel: 1,
  laag: 2,
};

const severityVar: Record<Finding["severity"], string> = {
  hoog: "var(--eb-sev-hoog)",
  middel: "var(--eb-sev-middel)",
  laag: "var(--eb-sev-laag)",
};

export default function FindingsList({
  findings,
  selected,
  onToggle,
  onSelectAll,
  onDeselectAll,
}: Props) {
  const t = uiText.findings;

  if (findings.length === 0) {
    return (
      <section aria-label={t.heading} className="eb-card p-5 sm:p-6">
        <h2 className="mb-2 text-base font-semibold">{t.heading}</h2>
        <div
          className="flex items-center gap-3 rounded-xl p-4 text-sm"
          style={{ backgroundColor: "var(--eb-surface)", color: "var(--eb-muted)" }}
        >
          <CheckCircle2 size={20} aria-hidden style={{ color: "var(--eb-score-positive)" }} />
          {t.none}
        </div>
      </section>
    );
  }

  const sorted = [...findings].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity],
  );
  const selectedCount = sorted.filter((f) => selected[f.id]).length;

  return (
    <section aria-label={t.heading} className="eb-card p-5 sm:p-6">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold">
          {t.heading}{" "}
          <span style={{ color: "var(--eb-muted)" }}>({sorted.length})</span>
        </h2>
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onSelectAll}
            className="rounded-md px-2 py-1 font-medium transition-colors hover:underline"
          >
            {t.selectAll}
          </button>
          <span style={{ color: "var(--eb-border)" }}>|</span>
          <button
            onClick={onDeselectAll}
            className="rounded-md px-2 py-1 font-medium transition-colors hover:underline"
          >
            {t.deselectAll}
          </button>
        </div>
      </div>
      <p className="mb-4 text-xs" style={{ color: "var(--eb-muted)" }}>
        {t.sortedNote} · {selectedCount}/{sorted.length} geselecteerd
      </p>

      <ol className="space-y-3">
        {sorted.map((f, idx) => {
          const checkboxId = `finding-${f.id}`;
          const isChecked = selected[f.id] ?? false;
          const accent = f.outOfScope ? "var(--eb-muted)" : severityVar[f.severity];
          return (
            <li
              key={f.id}
              className="overflow-hidden rounded-xl border transition-shadow"
              style={{
                borderColor: "var(--eb-border)",
                borderLeft: `4px solid ${accent}`,
                opacity: isChecked || f.outOfScope ? 1 : 0.7,
              }}
            >
              <div className="flex items-start gap-3 p-4">
                <input
                  id={checkboxId}
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggle(f.id)}
                  className="mt-1 h-4 w-4 shrink-0 cursor-pointer"
                  style={{ accentColor: "var(--eb-ink)" }}
                  aria-label={t.checkboxLabel}
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-2.5 flex flex-wrap items-center gap-2">
                    <span className="font-semibold">
                      {idx + 1}. {f.title}
                    </span>
                    {f.outOfScope ? (
                      <Badge text={t.labels.outOfScope} color="var(--eb-muted)" outline />
                    ) : (
                      <Badge
                        text={`${t.labels.severity}: ${t.severityLabels[f.severity]}`}
                        color={severityVar[f.severity]}
                      />
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    {f.rule && <Row label={t.labels.rule} value={f.rule} />}
                    {f.fragment && (
                      <Row label={t.labels.fragment} value={`“${f.fragment}”`} quote />
                    )}
                    {f.why && <Row label={t.labels.why} value={f.why} />}
                    {f.suggestion && (
                      <Row label={t.labels.suggestion} value={f.suggestion} highlight />
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Badge({
  text,
  color,
  outline,
}: {
  text: string;
  color: string;
  outline?: boolean;
}) {
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={
        outline
          ? { border: `1px solid ${color}`, color }
          : { backgroundColor: color, color: "#fff" }
      }
    >
      {text}
    </span>
  );
}

function Row({
  label,
  value,
  quote,
  highlight,
}: {
  label: string;
  value: string;
  quote?: boolean;
  highlight?: boolean;
}) {
  return (
    <div>
      <span
        className="block text-[0.7rem] font-semibold uppercase tracking-wide"
        style={{ color: "var(--eb-muted)" }}
      >
        {label}
      </span>
      <span
        className={`block ${quote ? "italic" : ""}`}
        style={
          highlight
            ? {
                backgroundColor: "var(--eb-surface)",
                borderRadius: 8,
                padding: "6px 10px",
                marginTop: 2,
              }
            : undefined
        }
      >
        {value}
      </span>
    </div>
  );
}
