/** Subtiele footer. Tekst komt uit /config/branding.ts. */
import { branding } from "@/config/branding";

export default function Footer() {
  return (
    <footer
      className="mt-12 border-t pt-6 text-center text-xs"
      style={{ borderColor: "var(--eb-border)", color: "var(--eb-muted)" }}
    >
      {branding.footer.baseline ? (
        <p className="mb-1 font-medium">{branding.footer.baseline}</p>
      ) : null}
      <p>{branding.footer.text}</p>
    </footer>
  );
}
