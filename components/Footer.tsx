/** Footer volgens de bureau-stylesheet: tekst links, merk-lockup rechts. */
import { branding } from "@/config/branding";
import BrandLockup from "@/components/BrandLockup";

export default function Footer() {
  return (
    <footer
      className="mt-12 flex items-center justify-between gap-4 border-t pt-6 text-xs"
      style={{ borderColor: "var(--eb-border)", color: "var(--eb-muted)" }}
    >
      <div>
        {branding.footer.baseline ? (
          <p className="mb-0.5 font-medium">{branding.footer.baseline}</p>
        ) : null}
        <p>{branding.footer.text}</p>
      </div>
      <span style={{ opacity: 0.6 }}>
        <BrandLockup size={18} height={32} />
      </span>
    </footer>
  );
}
