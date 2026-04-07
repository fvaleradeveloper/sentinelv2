import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { crearEncabezadoPDF, formatearMonedaPDF } from '@/lib/utils/pdf';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { unidad, mes, montoTotal, alicuota, condominio, simboloMoneda = 'S/' } = body;

    const doc = new jsPDF();

    const y = crearEncabezadoPDF(doc, {
      titulo: 'RECIBO DE MANTENIMIENTO',
      subtitulo: `Mes: ${mes}`,
      condominio: condominio,
      fecha: new Date().toLocaleDateString('es-PE'),
      simboloMoneda,
    });

    const filas = [
      ['Unidad', unidad],
      ['Mes', mes],
      ['Alícuota', formatearMonedaPDF(alicuota, simboloMoneda)],
      ['Total a pagar', formatearMonedaPDF(montoTotal, simboloMoneda)],
    ];

    (doc as jsPDF & { autoTable: Function }).autoTable({
      startY: y + 5,
      head: [['Concepto', 'Valor']],
      body: filas,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
    });

    const pdfBuffer = doc.output('arraybuffer');

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=recibo-${unidad}-${mes}.pdf`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Error al generar el PDF' }, { status: 500 });
  }
}