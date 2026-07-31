/** Toont de compliance-score (0–100) als gauge-ring + niveau-duiding. */
import { uiText } from "@/config/ui-text";

interface Props {
  score: number;
  levelLabel: string;
  levelDescription: string;
  tone: "positive" | "warn" | "caution" | "danger";
  findingsCount: number;
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
}: Props) {
  const t = uiText.score;
  const color = toneVar[tone];

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
          <p className="mt-2 text-xs" style={{ color: "var(--eb-muted)" }}>
            {findingsCount === 0
              ? "Geen aandachtspunten binnen de huidige regelset."
              : `${findingsCount} aandachtspunt${findingsCount === 1 ? "" : "en"} binnen de huidige regelset.`}
          </p>
          <p className="mt-2 text-xs font-medium" style={{ color: "var(--eb-sev-hoog)" }}>
            {t.disclaimerInline}
          </p>
        </div>
      </div>
    </section>
  );
}
