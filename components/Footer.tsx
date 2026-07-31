/** Footer volgens de bureau-stylesheet: tekst links, logo rechts. */
import { branding } from "@/config/branding";

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
      {branding.logo.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={branding.logo.src}
          alt={branding.logo.alt}
          style={{ height: 28, width: "auto", opacity: 0.6 }}
        />
      ) : null}
    </footer>
  );
}
