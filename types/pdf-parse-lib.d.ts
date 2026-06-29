// Typedeclaratie voor de interne module-import van pdf-parse.
// We importeren "pdf-parse/lib/pdf-parse.js" om de debug-modus van het pakket te
// vermijden; @types/pdf-parse dekt enkel het hoofdpad, vandaar deze alias.
declare module "pdf-parse/lib/pdf-parse.js" {
  import pdf from "pdf-parse";
  export default pdf;
}
