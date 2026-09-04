/**
 * ============================================================================
 *  UI-TEKST  —  vrij aanpasbaar ZONDER code aan te raken
 * ============================================================================
 *
 *  ALLE zichtbare teksten van de tool staan hier: koppen, labels, knoppen,
 *  hints, foutmeldingen en de disclaimer. De code bevat zelf geen hardcoded
 *  teksten.
 *
 *  Hoe pas je iets aan? Wijzig de tekst hieronder, commit en push.
 *  Vercel deployt automatisch. Geen code nodig.
 * ============================================================================
 */

export const uiText = {
  // --- Algemeen / kop ------------------------------------------------------
  app: {
    title: "Huisstijl Checker",
    subtitle:
      "Controleer je content tegen de Europabank-huisstijl en krijg concrete verbetervoorstellen.",
  },

  // --- Invoer --------------------------------------------------------------
  input: {
    heading: "1. Lever je content aan",
    tabs: {
      upload: "Bestand uploaden",
      paste: "Tekst plakken",
      url: "URL ingeven",
    },
    uploadHint: "Sleep een bestand hierheen of klik om te kiezen (.docx, .pdf, .txt).",
    uploadButton: "Kies bestand",
    pastePlaceholder: "Plak hier je tekst …",
    urlPlaceholder: "https://www.voorbeeld.be/pagina",
    urlHint: "We halen de hoofdtekst van de pagina op.",
    analyzeButton: "Controleer huisstijl",
    analyzingButton: "Bezig met controleren …",
    charCount: "tekens",
    clearButton: "Wissen",
  },

  // --- Resultaat: score ----------------------------------------------------
  score: {
    heading: "2. Huisstijl-score",
    outOf: "/ 100",
    scoreLabel: "Score",
    strengthsHeading: "Wat al goed zit",
    // {n} wordt vervangen door het aantal verbeterpunten.
    findingsCountOne: "1 verbeterpunt om de tekst nog sterker te maken.",
    findingsCountMany: "{n} verbeterpunten om de tekst nog sterker te maken.",
    findingsCountNone: "Geen verbeterpunten binnen het stijlboek.",
    disclaimerInline: "De score is een hulpmiddel; een menselijke eindredactie blijft de laatste stap.",
  },

  // --- Resultaat: verbeterpunten ------------------------------------------
  findings: {
    heading: "3. Verbeterpunten",
    none: "Mooi: binnen het stijlboek vonden we niets om te verbeteren. Een menselijke eindredactie blijft de laatste stap.",
    sortedNote: "Gesorteerd op impact (hoog → laag). Herhaalde patronen zijn gebundeld tot één punt.",
    labels: {
      rule: "Stijlregel",
      fragment: "Tekstfragment",
      why: "Waarom dit helpt",
      suggestion: "Zo kan het",
      severity: "Impact",
      outOfScope: "Buiten het stijlboek",
    },
    severityLabels: {
      hoog: "Hoog",
      middel: "Middel",
      laag: "Laag",
    },
    checkboxLabel: "Meenemen in de verbeterde versie",
    selectAll: "Alles aanvinken",
    deselectAll: "Alles afvinken",
  },

  // --- Resultaat: verbeterde versie ---------------------------------------
  rewrite: {
    heading: "4. Verbeterde versie",
    generateButton: "Genereer verbeterde versie",
    generatingButton: "Bezig met herschrijven …",
    regenerateButton: "Opnieuw genereren",
    intro:
      "Hieronder staat de herschreven content. Enkel de aangevinkte verbeterpunten zijn verwerkt; niet-aangevinkte punten bleven ongewijzigd.",
    copyButton: "Kopieer",
    copiedButton: "Gekopieerd!",
    downloadDocx: "Download .docx",
    downloadTxt: "Download .txt",
    noneSelected:
      "Vink minstens één verbeterpunt aan om een verbeterde versie te genereren.",
  },

  // --- Disclaimer ----------------------------------------------------------
  // Verschijnt prominent in de UI. Pas aan indien nodig; behoud de kern:
  // hulpmiddel, geen vervanging van menselijke eindredactie.
  disclaimer: {
    title: "Goed om te weten",
    body: [
      "Deze tool is een hulpmiddel dat content toetst aan het Europabank-stijlboek; ze vervangt geen menselijke eindredactie.",
      "De tool flagt enkel wat het stijlboek dekt. Staat een regel niet in het stijlboek, dan wordt ze niet beoordeeld.",
      "De output bestaat uit verbetervoorstellen, niet uit definitieve oordelen.",
      "Een hoge score betekent niet dat de tekst klaar is voor publicatie.",
      "Lees de verbeterde versie altijd na vóór gebruik.",
    ],
  },

  // --- Foutmeldingen -------------------------------------------------------
  errors: {
    generic: "Er ging iets mis. Probeer het opnieuw.",
    api: "De controle kon niet worden uitgevoerd (API-fout). Probeer het later opnieuw.",
    emptyInput: "Geef eerst content in via upload, plakken of een URL.",
    tooLong:
      "De tekst is te lang om in één keer te controleren. Kort de content in of splits ze op.",
    fileUnreadable:
      "Dit bestand kon niet worden gelezen. Controleer of het een geldig .docx-, .pdf- of .txt-bestand is.",
    fileType: "Niet-ondersteund bestandstype. Gebruik .docx, .pdf of .txt.",
    urlUnreachable:
      "De pagina kon niet worden opgehaald. Controleer de URL of plak de tekst rechtstreeks.",
    parse:
      "Het antwoord van de controle kon niet worden verwerkt. Probeer het opnieuw.",
  },
} as const;

export type UiText = typeof uiText;
