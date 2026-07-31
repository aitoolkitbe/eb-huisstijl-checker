/**
 * Merk-lockup volgens de bureau-stylesheet (preview.html):
 * een geel vierkant met donkere rand en een klein overlappend donker blokje,
 * gevolgd door de wordmark "europabank" (zwaar, strak gespatieerd).
 * Wordt gebruikt in de header en de footer. Is er een officieel logobestand?
 * Zet dan het pad in config/branding.ts -> logo.src; dat krijgt voorrang.
 */
"use client";

import { useState } from "react";
import { branding } from "@/config/branding";

export default function BrandLockup({ size = 24 }: { size?: number }) {
  const [imgFailed, setImgFailed] = useState(false);
  const src = branding.logo.src;

  if (src && !imgFailed) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={branding.logo.alt}
        style={{ height: branding.logo.height, width: "auto" }}
        onError={() => setImgFailed(true)}
      />
    );
  }

  const fontSize = Math.round(size * (22 / 24));
  const dot = Math.round(size / 3);
  return (
    <span
      className="inline-flex items-center gap-2 whitespace-nowrap"
      aria-label={branding.logo.alt}
      style={{
        fontWeight: 900,
        fontSize,
        letterSpacing: "-0.04em",
        color: "#222",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "relative",
          display: "inline-block",
          width: size,
          height: size,
          backgroundColor: "var(--eb-primary)",
          border: "2px solid #222",
        }}
      >
        <span
          style={{
            content: '""',
            position: "absolute",
            width: dot,
            height: dot,
            right: -Math.round(dot * 0.625),
            bottom: -Math.round(dot * 0.625),
            backgroundColor: "#222",
          }}
        />
      </span>
      <span>europabank</span>
    </span>
  );
}
