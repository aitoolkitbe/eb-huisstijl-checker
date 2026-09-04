/** Toont de compliance-score (0–100) als gauge-ring + niveau-duiding. */
import { CheckCircle2 } from "lucide-react";
import { uiText } from "@/config/ui-text";

interface Props {
  score: number;
  levelLabel: string;
  levelDescription: string;
  tone: "positive" | "warn" | "caution" | "danger";
  findingsCount: number;
  summary?: string;
  strengths?: string[];
}

const toneVar: Record<Props["tone"], string> = {
  positive: "var(--eb-score-positive)",
  warn: "var(--eb-score-warn)",
  caution: "var(--eb-score-caution)",
  danger: "var(--eb-score-danger)",
};

export default function ScoreCard({
  score,
  levelLabel,
  levelDescription,
  tone,
  findingsCount,
  summary,
  strengths = [],
}: Props) {
  const t = uiText.score;
  const color = toneVar[tone];
  const countText =
    findingsCount === 0
      ? t.findingsCountNone
      : findingsCount === 1
        ? t.findingsCountOne
        : t.findingsCountMany.replace("{n}", String(findingsCount));

  // Gauge-ring berekening.
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <section aria-label={t.heading} className="eb-card p-5 sm:p-6">
      <h2 className="mb-4 text-base font-semibold">{t.heading}</h2>
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
        {/* Gauge */}
        <div className="relative shrink-0" style={{ width: 128, height: 128 }}>
          <svg
            width="128"
            height="128"
            viewBox="0 0 128 128"
            role="img"
            aria-label={`${t.scoreLabel}: ${score} ${t.outOf}`}
          >
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke="var(--eb-surface)"
              strokeWidth="12"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
              transform="rotate(-90 64 64)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold leading-none" style={{ color }}>
              {score}
            </span>
            <span className="text-xs" style={{ color: "var(--eb-muted)" }}>
              {t.outOf}
            </span>
          </div>
        </div>

        {/* Duiding */}
        <div className="text-center sm:text-left">
          <span
            className="inline-block px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
            style={{
              borderRadius: "var(--eb-radius-badge)",
              backgroundColor: "var(--eb-surface)",
              color,
            }}
          >
            {levelLabel}
          </span>
          <p className="mt-2 text-sm" style={{ color: "var(--eb-ink)" }}>
            {levelDescription}
          </p>
          {summary && (
            <p className="mt-1 text-sm" style={{ color: "var(--eb-muted)" }}>
              {summary}
            </p>
          )}
          <p className="mt-2 text-xs" style={{ color: "var(--eb-muted)" }}>
            {countText}
          </p>
        </div>
      </div>

      {/* Wat al goed zit */}
      {strengths.length > 0 && (
        <div
          className="mt-5 p-4"
          style={{ backgroundColor: "var(--eb-surface)" }}
        >
          <h3
            className="mb-2 text-[11px] font-bold uppercase tracking-wide"
            style={{ color: "var(--eb-score-positive)" }}
          >
            {t.strengthsHeading}
          </h3>
          <ul className="space-y-1.5">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2
                  size={16}
                  aria-hidden
                  className="mt-0.5 shrink-0"
                  style={{ color: "var(--eb-score-positive)" }}
                />
                <span style={{ color: "var(--eb-ink)" }}>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-4 text-xs" style={{ color: "var(--eb-muted)" }}>
        {t.disclaimerInline}
      </p>
    </section>
  );
}
