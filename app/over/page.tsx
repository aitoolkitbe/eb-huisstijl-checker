/**
 * /over — uitlegpagina over de Huisstijl Checker, voor niet-technische lezers.
 *
 * Alles wat hier staat komt uit de echte configuratie: het stijlboek
 * (knowledge/), de kanalen (config/channels.ts) en de scoring
 * (config/scoring.ts). Wijzigt de config, dan wijzigt deze pagina mee.
 */

import type { Metadata } from "next";
import {
  ArrowRight,
  BookOpen,
  Check,
  X,
  FileText,
  Sparkles,
  ListChecks,
  PenLine,
  ShieldCheck,
} from "lucide-react";
import { branding } from "@/config/branding";
import { uiText } from "@/config/ui-text";
import { channels } from "@/config/channels";
import { scoring } from "@/config/scoring";
import { listKnowledgeEntries } from "@/lib/knowledge";
import { scoreAnalysis } from "@/lib/score";
import type { Finding } from "@/lib/types";
import BrandLockup from "@/components/BrandLockup";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: `Hoe de ${uiText.app.title} werkt — ${branding.logo.fallbackText}`,
  description:
    "Wat de Huisstijl Checker doet, welke kennis ze gebruikt, wat ze controleert en hoe de score tot stand komt.",
};

/** Link naar de tool zelf (CTA onderaan + knop bovenaan). */
const TOOL_URL = "https://eb-huisstijl-checker.vercel.app/";

/* --------------------------------------------------------------------------
   Hulpfuncties voor de score-voorbeelden (rekenen met de echte config)
   -------------------------------------------------------------------------- */
function fakeFindings(hoog: number, middel: number, laag: number): Finding[] {
  const out: Finding[] = [];
  const add = (severity: Finding["severity"], n: number) => {
    for (let i = 0; i < n; i++)
      out.push({
        id: `p${out.length + 1}`,
        title: "",
        rule: "",
        fragment: "",
        why: "",
        suggestion: "",
        severity,
      });
  };
  add("hoog", hoog);
  add("middel", middel);
  add("laag", laag);
  return out;
}

const scoreExamples = [
  { label: "Niets gevonden", h: 0, m: 0, l: 0, words: 200 },
  { label: "1 punt met hoge impact", h: 1, m: 0, l: 0, words: 200 },
  { label: "2 hoog + 2 middel", h: 2, m: 2, l: 0, words: 200 },
  { label: "4 hoog + 4 middel", h: 4, m: 4, l: 0, words: 200 },
  { label: "4 hoog + 4 middel, lange tekst (900 woorden)", h: 4, m: 4, l: 0, words: 900 },
  { label: "8 hoog + 6 middel", h: 8, m: 6, l: 0, words: 200 },
].map((e) => {
  const content = Array(e.words).fill("woord").join(" ");
  const r = scoreAnalysis({ findings: fakeFindings(e.h, e.m, e.l) }, content);
  return { ...e, score: r.score, level: r.levelLabel, tone: r.levelTone };
});

const toneVar: Record<string, string> = {
  positive: "var(--eb-score-positive)",
  warn: "var(--eb-score-warn)",
  caution: "var(--eb-score-caution)",
  danger: "var(--eb-score-danger)",
};

/* --------------------------------------------------------------------------
   Inhoud die de tool controleert (samengevat uit het stijlboek)
   -------------------------------------------------------------------------- */
const checks: { title: string; before: string; after: string }[] = [
  {
    title: "Aanspreking en stem",
    before: "Klanten kunnen hun lening online aanvragen.",
    after: "U vraagt uw lening online aan.",
  },
  {
    title: "Verzorgde spreektaal",
    before: "Gelieve uw cliëntendossier te bezorgen.",
    after: "Wil u uw klantendossier bezorgen?",
  },
  {
    title: "Actieve zinnen, geen lijdende vorm",
    before: "Uw aanvraag wordt door ons verwerkt.",
    after: "Wij verwerken uw aanvraag.",
  },
  {
    title: "Terugverwijzingen: die/dat",
    before: "Deze lening heeft een vaste rente.",
    after: "Die lening heeft een vaste rente.",
  },
  {
    title: "Merkspelling",
    before: "Log in op EB Online of E-Broker.",
    after: "Log in op eb online of E-broker.",
  },
  {
    title: "Getallen en bedragen",
    before: "Het pakket kost 3,5€ per maand. Bel 09/224.73.11.",
    after: "Het pakket kost € 3,50 per maand. Bel 09 224 73 11.",
  },
  {
    title: "Werkwoordspelling (dt)",
    before: "U vind alle info op onze site.",
    after: "U vindt alle info op onze site.",
  },
  {
    title: "Structuur en CTA",
    before: "Een slot zonder duidelijke volgende stap.",
    after: "Eén warme, actieve call-to-action.",
  },
];

/* --------------------------------------------------------------------------
   Pagina
   -------------------------------------------------------------------------- */
export default function OverPage() {
  const knowledge = listKnowledgeEntries();
  const rules = knowledge.filter((k) => k.type !== "context");
  const context = knowledge.filter((k) => k.type === "context");
  const minScore = scoring.startScore - scoring.softCap;

  return (
    <div className="min-h-screen">
      <div style={{ height: 5, backgroundColor: "var(--eb-primary)" }} />
      <header
        className="sticky top-0 z-50"
        style={{
          backgroundColor: "var(--eb-bg)",
          borderBottom: "1px solid var(--eb-border-dim)",
        }}
      >
        <div
          className="mx-auto flex max-w-3xl items-center justify-between gap-6 px-4"
          style={{ paddingTop: 25, paddingBottom: 25 }}
        >
          <div className="flex min-w-0 items-center gap-4">
            <BrandLockup />
            <span
              aria-hidden
              style={{ width: 1, height: 28, backgroundColor: "var(--eb-border)" }}
            />
            <div className="flex min-w-0 flex-col justify-center">
              <span
                className="whitespace-nowrap text-sm font-bold"
                style={{ color: "var(--eb-muted)" }}
              >
                {uiText.app.title}
              </span>
              <span
                className="whitespace-nowrap"
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--eb-neutral)",
                  marginTop: 2,
                }}
              >
                Hoe de tool werkt
              </span>
            </div>
          </div>
          <a href={TOOL_URL} className="eb-btn eb-btn-ghost hidden sm:inline-flex">
            Open de tool
          </a>
        </div>
      </header>

      {/* Intro */}
      <div className="mx-auto max-w-3xl px-4 pt-8">
        <section
          className="relative overflow-hidden"
          style={{
            backgroundColor: "var(--eb-bg)",
            border: "1px solid var(--eb-border-dim)",
            padding: "40px 36px",
          }}
        >
          <div
            aria-hidden
            className="absolute left-0 top-0 w-full"
            style={{ height: 6, backgroundColor: "var(--eb-primary)" }}
          />
          <p className="eb-overline mb-3">Documentatie</p>
          <h1
            className="text-3xl font-extrabold sm:text-4xl"
            style={{ color: "var(--eb-ink)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
          >
            Hoe de Huisstijl Checker werkt
          </h1>
          <p className="mt-4 max-w-xl text-base" style={{ color: "var(--eb-ink)" }}>
            De Huisstijl Checker leest een tekst, vergelijkt die met het
            Europabank-stijlboek en geeft een score, concrete verbeterpunten en op
            vraag een verbeterde versie.
          </p>
          <p className="mt-2 max-w-xl text-sm" style={{ color: "var(--eb-muted)" }}>
            Ze vervangt geen eindredacteur. Ze zorgt ervoor dat de eindredacteur
            begint bij een tekst die al op stijl zit.
          </p>
        </section>
      </div>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        {/* 1. In vier stappen */}
        <section className="eb-card p-5 sm:p-6">
          <h2 className="mb-1 text-base font-semibold">In vier stappen</h2>
          <p className="mb-5 text-sm" style={{ color: "var(--eb-muted)" }}>
            Dezelfde vier stappen als in de tool zelf.
          </p>
          <ol className="grid gap-3 sm:grid-cols-4">
            {[
              { n: 1, Icon: FileText, t: "Aanleveren", d: "Bestand (.docx, .pdf, .txt), geplakte tekst of een URL. Plus: op welk kanaal de tekst komt." },
              { n: 2, Icon: Sparkles, t: "Score", d: "Een score op 100, een niveau, en wat er al goed zit." },
              { n: 3, Icon: ListChecks, t: "Verbeterpunten", d: "Per punt: het fragment, de stijlregel, waarom het helpt en een voorstel. Vink aan wat je meeneemt." },
              { n: 4, Icon: PenLine, t: "Verbeteren", d: "De tool herschrijft enkel de aangevinkte punten. Kopieer of download als .docx." },
            ].map((s) => (
              <li
                key={s.n}
                className="flex flex-col gap-2 p-4"
                style={{ backgroundColor: "var(--eb-surface)" }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: "var(--eb-primary)", color: "var(--eb-primary-text)" }}
                  >
                    {s.n}
                  </span>
                  <span className="text-sm font-semibold">{s.t}</span>
                </div>
                <p className="text-xs" style={{ color: "var(--eb-muted)" }}>
                  {s.d}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* 2. Wat wel / wat niet */}
        <section className="eb-card p-5 sm:p-6">
          <h2 className="mb-4 text-base font-semibold">Wat de tool wel en niet doet</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <ul className="space-y-2 text-sm">
              {[
                "Toetst enkel aan het Europabank-stijlboek.",
                "Benoemt wat al goed zit, niet enkel wat beter kan.",
                "Bundelt een terugkerende fout tot één verbeterpunt.",
                "Past enkel toe wat jij aanvinkt.",
                "Bewaart geen teksten. Elke controle staat op zich.",
              ].map((x) => (
                <li key={x} className="flex items-start gap-2">
                  <Check size={16} aria-hidden className="mt-0.5 shrink-0" style={{ color: "var(--eb-score-positive)" }} />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <ul className="space-y-2 text-sm">
              {[
                "Verzint geen eigen stijlregels. Staat iets niet in het stijlboek, dan blijft het onbesproken.",
                "Controleert geen feiten, cijfers of juridische inhoud.",
                "Beoordeelt geen beeld of lay-out.",
                "Vervangt geen menselijke eindredactie. Een hoge score is geen publicatievrijgave.",
              ].map((x) => (
                <li key={x} className="flex items-start gap-2">
                  <X size={16} aria-hidden className="mt-0.5 shrink-0" style={{ color: "var(--eb-sev-hoog)" }} />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 3. Hoe de tool is opgebouwd */}
        <section className="eb-card p-5 sm:p-6">
          <h2 className="mb-1 text-base font-semibold">Hoe de tool is opgebouwd</h2>
          <p className="mb-5 text-sm" style={{ color: "var(--eb-muted)" }}>
            Drie onderdelen. Enkel het derde is techniek.
          </p>
          <div className="grid items-stretch gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
            <Block
              title="Jouw tekst"
              body="Wordt op de server omgezet naar platte tekst en samen met het stijlboek naar het AI-model gestuurd."
            />
            <Arrow />
            <Block
              title="Het stijlboek"
              body={`${knowledge.length} leesbare tekstbestanden met de stijlregels. Wie het stijlboek beheert, past die bestanden aan — zonder code.`}
              accent
            />
            <Arrow />
            <Block
              title="Het AI-model"
              body="Claude (Anthropic) vergelijkt tekst en stijlboek en geeft de verbeterpunten gestructureerd terug. De score rekent de tool zelf uit."
            />
          </div>
          <div
            className="mt-4 flex items-start gap-3 p-4 text-sm"
            style={{ backgroundColor: "var(--eb-surface)" }}
          >
            <ShieldCheck size={18} aria-hidden className="mt-0.5 shrink-0" style={{ color: "var(--eb-ink)" }} />
            <p style={{ color: "var(--eb-ink)" }}>
              Alle instellingen die geen code zijn — het stijlboek, de kanalen, de
              scoreformule, de teksten op het scherm, de huisstijl — staan in losse,
              becommentarieerde bestanden. De tool is geen black box: elke regel die
              ze toepast, kan je nalezen.
            </p>
          </div>
        </section>

        {/* 4. Welke kennis */}
        <section className="eb-card p-5 sm:p-6">
          <h2 className="mb-1 text-base font-semibold">Welke kennis de tool gebruikt</h2>
          <p className="mb-5 text-sm" style={{ color: "var(--eb-muted)" }}>
            Het stijlboek is opgebouwd uit twee bronnen: de tone-of-voice-documenten
            van June20 en Cards, en de Schrijfstijlgids Europabank (maart 2025).
            Opgesplitst per thema, {rules.length} regelbestanden en {context.length}{" "}
            achtergrondbestanden.
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {rules.map((k) => (
              <li
                key={k.file}
                className="flex items-start gap-2 p-3 text-sm"
                style={{ backgroundColor: "var(--eb-surface)" }}
              >
                <BookOpen size={15} aria-hidden className="mt-0.5 shrink-0" style={{ color: "var(--eb-muted)" }} />
                <span>{k.title}</span>
              </li>
            ))}
          </ul>
          {context.length > 0 && (
            <p className="mt-4 text-xs" style={{ color: "var(--eb-muted)" }}>
              Achtergrond (niet gebruikt om te flaggen, wel om de toon te begrijpen):{" "}
              {context.map((k) => k.title.split(" — ")[0]).join(" · ")}.
            </p>
          )}
          <p className="mt-3 text-xs" style={{ color: "var(--eb-muted)" }}>
            Verandert de schrijfstijlgids? Dan past de beheerder het betrokken
            bestand aan en telt de nieuwe regel mee vanaf de volgende controle.
          </p>
        </section>

        {/* 5. Welke checks */}
        <section className="eb-card p-5 sm:p-6">
          <h2 className="mb-1 text-base font-semibold">Wat de tool controleert</h2>
          <p className="mb-5 text-sm" style={{ color: "var(--eb-muted)" }}>
            Een greep uit de stijlregels, telkens met een voorbeeld van hoe de
            tool een fragment kan bijsturen.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {checks.map((c) => (
              <div
                key={c.title}
                className="p-4"
                style={{ backgroundColor: "var(--eb-surface)" }}
              >
                <p className="mb-2 text-sm font-semibold">{c.title}</p>
                <p className="text-sm" style={{ color: "var(--eb-muted)", textDecoration: "line-through" }}>
                  {c.before}
                </p>
                <p className="mt-1 flex items-start gap-1.5 text-sm">
                  <ArrowRight size={14} aria-hidden className="mt-1 shrink-0" style={{ color: "var(--eb-ink)" }} />
                  <span>{c.after}</span>
                </p>
              </div>
            ))}
          </div>

          <h3 className="mb-1 mt-6 text-sm font-semibold">Elk verbeterpunt bevat</h3>
          <ul className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2" style={{ color: "var(--eb-ink)" }}>
            <li>· het exacte tekstfragment</li>
            <li>· de stijlregel waarop het slaat</li>
            <li>· waarom de aanpassing helpt</li>
            <li>· een concreet voorstel in de Europabank-stem</li>
            <li>· de impact: hoog, middel of laag</li>
            <li>· een vinkje: meenemen of niet</li>
          </ul>
        </section>

        {/* 6. Kanalen */}
        <section className="eb-card p-5 sm:p-6">
          <h2 className="mb-1 text-base font-semibold">Het kanaal bepaalt hoe streng</h2>
          <p className="mb-5 text-sm" style={{ color: "var(--eb-muted)" }}>
            Een webpagina verdient een volledige controle. Een begeleidende
            social post moet juist zijn, niet perfect. Daarom kies je bij het
            aanleveren waar de tekst gebruikt wordt.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left" style={{ borderBottom: "1px solid var(--eb-border)" }}>
                  <th className="py-2 pr-3 font-semibold">Kanaal</th>
                  <th className="py-2 pr-3 font-semibold">Controle</th>
                  <th className="py-2 pr-3 font-semibold">Max. punten</th>
                  <th className="py-2 font-semibold">Weegt in de score</th>
                </tr>
              </thead>
              <tbody>
                {channels.map((c) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid var(--eb-border-dim)" }}>
                    <td className="py-2 pr-3">
                      <span className="font-medium">{c.label}</span>
                      <span className="block text-xs" style={{ color: "var(--eb-muted)" }}>
                        {c.hint}
                      </span>
                    </td>
                    <td className="py-2 pr-3">
                      <Badge
                        text={c.depth === "volledig" ? "Volledig" : "Licht"}
                        color={c.depth === "volledig" ? "var(--eb-ink)" : "var(--eb-score-warn)"}
                      />
                    </td>
                    <td className="py-2 pr-3">{c.maxFindings}</td>
                    <td className="py-2">{Math.round(c.penaltyFactor * 100)} %</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs" style={{ color: "var(--eb-muted)" }}>
            Licht = enkel wat de lezer meteen opvalt: aanspreking, toon, verboden
            constructies, dt-fouten en merkspelling. Notatie, hoofdletters en
            structuurregels laat de tool dan passeren. Meerdere kanalen tegelijk?
            Dan geldt de strengste controle.
          </p>
        </section>

        {/* 7. Score */}
        <section className="eb-card p-5 sm:p-6">
          <h2 className="mb-1 text-base font-semibold">Hoe de score wordt berekend</h2>
          <p className="mb-5 text-sm" style={{ color: "var(--eb-muted)" }}>
            De score is een richtcijfer, geen examen. Ze start op{" "}
            {scoring.startScore} en zakt per verbeterpunt, maar nooit onder{" "}
            {minScore}.
          </p>

          <ol className="grid gap-3 sm:grid-cols-3">
            {[
              {
                n: 1,
                t: "Elk punt weegt naar impact",
                d: `Hoog −${scoring.weights.hoog}, middel −${scoring.weights.middel}, laag −${scoring.weights.laag}. Punten buiten het stijlboek tellen niet mee.`,
              },
              {
                n: 2,
                t: "Lange teksten krijgen ruimte",
                d: `Tot ${scoring.referenceWords} woorden telt elk punt volledig. Daarboven weegt de aftrek evenredig minder: een tekst van ${scoring.referenceWords * 2} woorden met dezelfde punten scoort hoger.`,
              },
              {
                n: 3,
                t: "De aftrek vlakt af",
                d: "De eerste punten wegen het zwaarst, elk volgend punt iets minder. Veel kleine opmerkingen duwen de score dus niet naar nul.",
              },
            ].map((s) => (
              <li key={s.n} className="p-4" style={{ backgroundColor: "var(--eb-surface)" }}>
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: "var(--eb-primary)", color: "var(--eb-primary-text)" }}
                  >
                    {s.n}
                  </span>
                  <span className="text-sm font-semibold">{s.t}</span>
                </div>
                <p className="text-xs" style={{ color: "var(--eb-muted)" }}>
                  {s.d}
                </p>
              </li>
            ))}
          </ol>

          <h3 className="mb-2 mt-6 text-sm font-semibold">Voorbeelden, berekend met de huidige instellingen</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left" style={{ borderBottom: "1px solid var(--eb-border)" }}>
                  <th className="py-2 pr-3 font-semibold">Verbeterpunten</th>
                  <th className="py-2 pr-3 font-semibold">Score</th>
                  <th className="py-2 font-semibold">Niveau</th>
                </tr>
              </thead>
              <tbody>
                {scoreExamples.map((e) => (
                  <tr key={e.label} style={{ borderBottom: "1px solid var(--eb-border-dim)" }}>
                    <td className="py-2 pr-3">{e.label}</td>
                    <td className="py-2 pr-3 font-bold" style={{ color: toneVar[e.tone] }}>
                      {e.score}
                    </td>
                    <td className="py-2">
                      <Badge text={e.level} color={toneVar[e.tone]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mb-2 mt-6 text-sm font-semibold">De vier niveaus</h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {scoring.levels.map((l) => (
              <li
                key={l.label}
                className="p-3"
                style={{ backgroundColor: "var(--eb-surface)", borderLeft: `3px solid ${toneVar[l.tone]}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">{l.label}</span>
                  <span className="text-xs" style={{ color: "var(--eb-muted)" }}>
                    vanaf {l.minScore}
                  </span>
                </div>
                <p className="mt-1 text-xs" style={{ color: "var(--eb-muted)" }}>
                  {l.description}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs" style={{ color: "var(--eb-muted)" }}>
            Naast de score toont de tool altijd twee tot vier sterke punten: wat
            de tekst al goed doet volgens het stijlboek.
          </p>
        </section>

        {/* 8. Wat de tool aanpast */}
        <section className="eb-card p-5 sm:p-6">
          <h2 className="mb-4 text-base font-semibold">Wat de verbeterde versie doet</h2>
          <ul className="space-y-2 text-sm">
            {[
              "Past enkel de verbeterpunten toe die je aanvinkte. Al de rest blijft letterlijk staan.",
              "Een gebundeld punt past ze overal toe: staat 'dit' vijf keer verkeerd, dan worden het vijf keer 'die'.",
              "Behoudt betekenis en feiten. Ze verzint geen cijfers, bronnen of beloftes.",
              "Respecteert het kanaal: een social post wordt niet plots langer of formeler.",
              "Lees de verbeterde versie altijd na. Ze is een voorstel, geen eindversie.",
            ].map((x) => (
              <li key={x} className="flex items-start gap-2">
                <Check size={16} aria-hidden className="mt-0.5 shrink-0" style={{ color: "var(--eb-score-positive)" }} />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section
          className="relative overflow-hidden p-6 sm:p-8"
          style={{ backgroundColor: "var(--eb-bg)", border: "1px solid var(--eb-border-dim)" }}
        >
          <div
            aria-hidden
            className="absolute left-0 top-0 w-full"
            style={{ height: 6, backgroundColor: "var(--eb-primary)" }}
          />
          <h2 className="text-xl font-extrabold" style={{ letterSpacing: "-0.02em" }}>
            Probeer het met een eigen tekst
          </h2>
          <p className="mt-2 max-w-xl text-sm" style={{ color: "var(--eb-muted)" }}>
            Plak een tekst, kies het kanaal en bekijk de score en de
            verbeterpunten. Je bent er een halve minuut mee bezig.
          </p>
          <a href={TOOL_URL} className="eb-btn eb-btn-primary mt-5">
            Open de Huisstijl Checker
            <ArrowRight size={16} aria-hidden />
          </a>
        </section>

        <Footer />
      </main>
    </div>
  );
}

/* --- Kleine bouwstenen ---------------------------------------------------- */
function Block({ title, body, accent = false }: { title: string; body: string; accent?: boolean }) {
  return (
    <div
      className="p-4"
      style={{
        backgroundColor: accent ? "var(--eb-primary-dim)" : "var(--eb-surface)",
        border: accent ? "1px solid var(--eb-primary)" : "1px solid transparent",
      }}
    >
      <p className="mb-1 text-sm font-semibold">{title}</p>
      <p className="text-xs" style={{ color: "var(--eb-muted)" }}>
        {body}
      </p>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex items-center justify-center py-1 sm:py-0" aria-hidden>
      <ArrowRight size={18} className="rotate-90 sm:rotate-0" style={{ color: "var(--eb-muted)" }} />
    </div>
  );
}

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span
      className="inline-block px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide"
      style={{ borderRadius: "var(--eb-radius-badge)", backgroundColor: "var(--eb-bg)", border: `1px solid ${color}`, color }}
    >
      {text}
    </span>
  );
}
