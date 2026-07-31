import type { Metadata } from "next";
import "./globals.css";
import { branding } from "@/config/branding";
import { uiText } from "@/config/ui-text";

export const metadata: Metadata = {
  title: `${uiText.app.title} — ${branding.logo.fallbackText}`,
  description: uiText.app.subtitle,
};

/**
 * De branding-kleuren en het font worden als CSS-variabelen op <html> gezet,
 * rechtstreeks uit /config/branding.ts. De componenten gebruiken die variabelen.
 * Zo wijzigt branding zonder dat de componenten aangepast moeten worden.
 */
const cssVars = {
  "--eb-primary": branding.colors.primary,
  "--eb-primary-dim": branding.colors.primaryDim,
  "--eb-primary-text": branding.colors.primaryText,
  "--eb-ink": branding.colors.ink,
  "--eb-bg": branding.colors.background,
  "--eb-surface": branding.colors.surface,
  "--eb-border": branding.colors.border,
  "--eb-border-dim": branding.colors.borderDim,
  "--eb-muted": branding.colors.muted,
  "--eb-neutral": branding.colors.neutral,
  "--eb-sev-hoog": branding.colors.severity.hoog,
  "--eb-sev-middel": branding.colors.severity.middel,
  "--eb-sev-laag": branding.colors.severity.laag,
  "--eb-score-positive": branding.colors.score.positive,
  "--eb-score-warn": branding.colors.score.warn,
  "--eb-score-caution": branding.colors.score.caution,
  "--eb-score-danger": branding.colors.score.danger,
  "--eb-font": branding.fonts.fontFamily,
  "--eb-font-body": branding.fonts.fontBody,
} as React.CSSProperties;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" style={cssVars}>
      <body>{children}</body>
    </html>
  );
}
