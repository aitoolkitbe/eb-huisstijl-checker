"use client";

import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import { uiText } from "@/config/ui-text";

interface Props {
  rewritten: string | null;
  loading: boolean;
  selectedCount: number;
  onGenerate: () => void;
}

export default function ResultPanel({
  rewritten,
  loading,
  selectedCount,
  onGenerate,
}: Props) {
  const t = uiText.rewrite;
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!rewritten) return;
    await navigator.clipboard.writeText(rewritten);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadTxt() {
    if (!rewritten) return;
    triggerDownload(
      new Blob([rewritten], { type: "text/plain;charset=utf-8" }),
      "verbeterde-versie.txt",
    );
  }

  async function downloadDocx() {
    if (!rewritten) return;
    const { Document, Packer, Paragraph, TextRun } = await import("docx");
    const paragraphs = rewritten
      .split(/\n/)
      .map((line) => new Paragraph({ children: [new TextRun(line)] }));
    const doc = new Document({ sections: [{ children: paragraphs }] });
    const blob = await Packer.toBlob(doc);
    triggerDownload(blob, "verbeterde-versie.docx");
  }

  return (
    <section aria-label={t.heading} className="eb-card p-5 sm:p-6">
      <h2 className="mb-4 text-base font-semibold">{t.heading}</h2>

      <button
        onClick={onGenerate}
        disabled={loading || selectedCount === 0}
        className="eb-btn eb-btn-primary"
      >
        {loading && <span className="eb-spinner" />}
        {loading
          ? t.generatingButton
          : rewritten
            ? t.regenerateButton
            : t.generateButton}
      </button>

      {selectedCount === 0 && (
        <p className="mt-2.5 text-sm" style={{ color: "var(--eb-muted)" }}>
          {t.noneSelected}
        </p>
      )}

      {rewritten && (
        <div className="eb-fade-in mt-5">
          <p className="mb-3 text-sm" style={{ color: "var(--eb-muted)" }}>
            {t.intro}
          </p>
          <div
            className="max-h-[28rem] overflow-auto whitespace-pre-wrap border p-4 text-sm leading-relaxed"
            style={{
              borderColor: "var(--eb-border)",
              backgroundColor: "var(--eb-surface)",
              fontFamily: "var(--eb-font-body)",
              lineHeight: 1.7,
            }}
          >
            {rewritten}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={handleCopy} className="eb-btn eb-btn-ghost">
              {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
              {copied ? t.copiedButton : t.copyButton}
            </button>
            <button onClick={downloadDocx} className="eb-btn eb-btn-ghost">
              <Download size={16} aria-hidden />
              {t.downloadDocx}
            </button>
            <button onClick={downloadTxt} className="eb-btn eb-btn-ghost">
              <Download size={16} aria-hidden />
              {t.downloadTxt}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
