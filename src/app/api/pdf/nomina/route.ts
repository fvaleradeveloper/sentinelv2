import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { crearEncabezadoPDF, formatearMonedaPDF } from '@/lib/utils/pdf';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { empleado, mes, nomina, condominio, simboloMoneda = 'S/' } = body;

    const doc = new jsPDF();

    const y = crearEncabezadoPDF(doc, {
      titulo: 'BOLETA DE PAGO',
      subtitulo: `Empleado: ${empleado} | Mes: ${mes}`,
      condominio: condominio,
      fecha: new Date().toLocaleDateString('es-PE'),
      simboloMoneda,
    });

    const filas = [
      ['Sueldo base', formatearMonedaPDF(nomina.sueldoBase, simboloMoneda)],
      ['Asignación familiar', formatearMonedaPDF(nomina.asignacionFamiliarMonto, simboloMoneda)],
      ['Bonos', formatearMonedaPDF(nomina.bonos, simboloMoneda)],
      ['Horas extras', formatearMonedaPDF(nomina.horasExtras, simboloMoneda)],
      ['Gratificación', formatearMonedaPDF(nomina.gratificacionMonto, simboloMoneda)],
      ['Bono extraordinario', formatearMonedaPDF(nomina.bonoExtraordinarioMonto, simboloMoneda)],
      ['EsSalud (empleador)', formatearMonedaPDF(nomina.essaludMonto, simboloMoneda)],
      ['ONP', formatearMonedaPDF(nomina.onpMonto, simboloMoneda)],
      ['AFP', formatearMonedaPDF(nomina.afpMonto, simboloMoneda)],
      ['Préstamos', formatearMonedaPDF(nomina.prestamosDeducidos, simboloMoneda)],
      ['TOTAL BRUTO', formatearMonedaPDF(nomina.montoBruto, simboloMoneda)],
      ['TOTAL NETO', formatearMonedaPDF(nomina.montoNeto, simboloMoneda)],
    ];

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
        'Content-Disposition': `attachment; filename=nomina-${empleado}-${mes}.pdf`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Error al generar la boleta' }, { status: 500 });
  }
}