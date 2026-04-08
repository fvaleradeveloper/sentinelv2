// Declaraciones de tipos para importaciones de archivos CSS
// Necesario para Next.js production build con TypeScript strict
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
