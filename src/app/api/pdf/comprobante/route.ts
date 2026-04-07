import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { crearEncabezadoPDF, formatearMonedaPDF } from '@/lib/utils/pdf';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titulo, detalles, condominio, simboloMoneda = 'S/' } = body;

    const doc = new jsPDF();

    const y = crearEncabezadoPDF(doc, {
      titulo: titulo || 'COMPROBANTE',
      condominio: condominio,
      fecha: new Date().toLocaleDateString('es-PE'),
      simboloMoneda,
    });

    const filas = (detalles as Array<{ concepto: string; monto: number }>).map(
      (d: { concepto: string; monto: number }) => [d.concepto, formatearMonedaPDF(d.monto, simboloMoneda)]
    );

    (doc as jsPDF & { autoTable: Function }).autoTable({
      startY: y + 5,
      head: [['Concepto', 'Monto']],
      body: filas,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
    });

    const pdfBuffer = doc.output('arraybuffer');

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=comprobante.pdf',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Error al generar comprobante' }, { status: 500 });
  }
}