// Utilidades para generación de PDF con jsPDF
// Se usa en las rutas API: /api/pdf/recibo, /api/pdf/nomina, /api/pdf/comprobante

export interface PDFConfig {
  titulo: string;
  subtitulo?: string;
  condominio: string;
  fecha: string;
  simboloMoneda: string;
}

export interface FilaPDF {
  etiqueta: string;
  valor: string;
}

export function crearEncabezadoPDF(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc: any,
  config: PDFConfig
): number {
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(config.titulo, 14, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(config.condominio, 14, 28);
  doc.text(`Fecha: ${config.fecha}`, 14, 34);

  if (config.subtitulo) {
    doc.setFontSize(12);
    doc.text(config.subtitulo, 14, 42);
    return 50;
  }

  return 42;
}

export function formatearMonedaPDF(monto: number, simbolo: string = 'S/'): string {
  return `${simbolo} ${monto.toFixed(2)}`;
}