"use client";

import { useRef, useState } from "react";
import { FileText, Type, Link2, UploadCloud, CheckCircle2 } from "lucide-react";
import { uiText } from "@/config/ui-text";

type Mode = "upload" | "paste" | "url";

interface Props {
  loading: boolean;
  onAnalyze: (form: FormData) => void;
}

export default function InputPanel({ loading, onAnalyze }: Props) {
  const t = uiText.input;
  const [mode, setMode] = useState<Mode>("paste");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit =
    !loading &&
    ((mode === "paste" && text.trim().length > 0) ||
      (mode === "url" && url.trim().length > 0) ||
      (mode === "upload" && file !== null));

  function handleSubmit() {
    const form = new FormData();
    if (mode === "paste") {
      form.set("mode", "text");
      form.set("text", text);
    } else if (mode === "url") {
      form.set("mode", "url");
      form.set("url", url.trim());
    } else if (mode === "upload" && file) {
      form.set("mode", "file");
      form.set("file", file);
    }
    onAnalyze(form);
  }

  function handleClear() {
    setText("");
    setUrl("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  }

  const tabs: { key: Mode; label: string; Icon: typeof FileText }[] = [
    { key: "upload", label: t.tabs.upload, Icon: FileText },
    { key: "paste", label: t.tabs.paste, Icon: Type },
    { key: "url", label: t.tabs.url, Icon: Link2 },
  ];

  return (
    <section className="eb-card p-5 sm:p-6">
      <h2 className="mb-4 text-base font-semibold">{t.heading}</h2>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label={t.heading}
        className="mb-5 grid grid-cols-3 gap-1 p-1"
        style={{ backgroundColor: "var(--eb-surface)" }}
      >
        {tabs.map((tab) => {
          const active = mode === tab.key;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={active}
              onClick={() => setMode(tab.key)}
              className="flex items-center justify-center gap-1.5 px-2 py-2 text-sm font-medium transition-all"
              style={{
                backgroundColor: active ? "var(--eb-bg)" : "transparent",
                color: active ? "var(--eb-ink)" : "var(--eb-muted)",
                border: active ? "1px solid var(--eb-border)" : "1px solid transparent",
              }}
            >
              <tab.Icon size={16} aria-hidden />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Inhoud per tab */}
      {mode === "paste" && (
        <div>
          <textarea
            aria-label={t.tabs.paste}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.pastePlaceholder}
            rows={9}
            className="eb-input w-full resize-y p-3.5 text-sm"
          />
          <p className="mt-1.5 text-right text-xs" style={{ color: "var(--eb-muted)" }}>
            {text.length} {t.charCount}
          </p>
        </div>
      )}

      {mode === "url" && (
        <div>
          <input
            type="url"
            aria-label={t.tabs.url}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t.urlPlaceholder}
            className="eb-input w-full p-3.5 text-sm"
          />
          <p className="mt-1.5 text-xs" style={{ color: "var(--eb-muted)" }}>
            {t.urlHint}
          </p>
        </div>
      )}

      {mode === "upload" && (
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className="flex w-full flex-col items-center justify-center gap-2 border-2 border-dashed px-4 py-9 text-center transition-colors"
            style={{
              borderColor: dragOver ? "var(--eb-ink)" : "var(--eb-border)",
              backgroundColor: dragOver ? "var(--eb-surface)" : "var(--eb-bg)",
            }}
          >
            <span aria-hidden style={{ color: "var(--eb-muted)" }}>
              {file ? <CheckCircle2 size={28} /> : <UploadCloud size={28} />}
            </span>
            {file ? (
              <span className="text-sm font-medium">{file.name}</span>
            ) : (
              <>
                <span className="text-sm font-medium">{t.uploadButton}</span>
                <span className="text-xs" style={{ color: "var(--eb-muted)" }}>
                  {t.uploadHint}
                </span>
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx,.pdf,.txt"
            aria-label={t.tabs.upload}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="hidden"
          />
        </div>
      )}

      {/* Knoppen */}
      <div className="mt-5 flex items-center gap-3">
        <button onClick={handleSubmit} disabled={!canSubmit} className="eb-btn eb-btn-primary">
          {loading && <span className="eb-spinner" />}
          {loading ? t.analyzingButton : t.analyzeButton}
        </button>
        <button onClick={handleClear} disabled={loading} className="eb-btn eb-btn-ghost">
          {t.clearButton}
        </button>
      </div>
    </section>
  );
}
