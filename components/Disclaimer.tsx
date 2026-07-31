"use client";

/** Verplichte disclaimer (inklapbaar). Tekst komt uit /config/ui-text.ts. */
import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { uiText } from "@/config/ui-text";

export default function Disclaimer() {
  const d = uiText.disclaimer;
  const [open, setOpen] = useState(true);

  return (
    <section
      role="note"
      aria-label={d.title}
      className="overflow-hidden border"
      style={{
        borderColor: "rgba(252, 228, 0, 0.5)",
        borderLeft: "3px solid var(--eb-primary)",
        backgroundColor: "rgba(252, 228, 0, 0.12)",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <AlertTriangle size={16} aria-hidden style={{ color: "var(--eb-sev-middel)" }} />
          {d.title}
        </span>
        <span aria-hidden style={{ color: "var(--eb-muted)" }}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      {open && (
        <ul className="list-disc space-y-1 px-4 pb-4 pl-9 text-sm" style={{ color: "var(--eb-ink)" }}>
          {d.body.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
