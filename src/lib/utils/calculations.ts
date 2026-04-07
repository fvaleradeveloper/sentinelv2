// Cálculos de nómina según ley peruana

const ESSALUD_PORCENTAJE = 0.09;
const ONP_PORCENTAJE = 0.13;
const AFP_PORCENTAJE = 0.12;
const ASIGNACION_FAMILIAR = 102.50;
const BONO_EXTRAORDINARIO_PORCENTAJE = 0.09;

interface DatosNomina {
  sueldoBase: number;
  asignacionFamiliar: boolean;
  regimenPensionario: 'ONP' | 'AFP';
  bonos: number;
  horasExtras: number;
  prestamosDeducidos: number;
  otrosDescuentos: number;
  esGratificacion: boolean;
  esCTS: boolean;
}

export interface ResultadoNomina {
  sueldoBase: number;
  asignacionFamiliarMonto: number;
  bonos: number;
  horasExtras: number;
  gratificacionMonto: number;
  ctsMonto: number;
  bonoExtraordinarioMonto: number;
  essaludMonto: number;
  afpMonto: number;
  onpMonto: number;
  prestamosDeducidos: number;
  otrosDescuentos: number;
  montoBruto: number;
  montoNeto: number;
}

export function calcularNomina(datos: DatosNomina): ResultadoNomina {
  const asignacionFamiliarMonto = datos.asignacionFamiliar ? ASIGNACION_FAMILIAR : 0;
  const remuneracionComputable = datos.sueldoBase + asignacionFamiliarMonto;

  // EsSalud (lo paga el empleador, 9% de la remuneración)
  const essaludMonto = Number((remuneracionComputable * ESSALUD_PORCENTAJE).toFixed(2));

  // Pensiones (lo paga el trabajador)
  let onpMonto = 0;
  let afpMonto = 0;
  if (datos.regimenPensionario === 'ONP') {
    onpMonto = Number((remuneracionComputable * ONP_PORCENTAJE).toFixed(2));
  } else {
    afpMonto = Number((remuneracionComputable * AFP_PORCENTAJE).toFixed(2));
  }

  // Gratificación (julio y diciembre): sueldo + asignación familiar
  const gratificacionMonto = datos.esGratificacion
    ? Number(remuneracionComputable.toFixed(2))
    : 0;

  // Bono extraordinario (9% de la gratificación, equivalente al aporte EsSalud)
  const bonoExtraordinarioMonto = datos.esGratificacion
    ? Number((gratificacionMonto * BONO_EXTRAORDINARIO_PORCENTAJE).toFixed(2))
    : 0;

  // CTS: (sueldo + asignación familiar + 1/6 última gratificación) / 12
  const ctsMonto = datos.esCTS
    ? Number(((remuneracionComputable + remuneracionComputable / 6) / 12).toFixed(2))
    : 0;

  // Bruto
  const montoBruto = Number(
    (
      datos.sueldoBase +
      asignacionFamiliarMonto +
      datos.bonos +
      datos.horasExtras +
      gratificacionMonto +
      bonoExtraordinarioMonto
    ).toFixed(2)
  );

  // Neto
  const totalDescuentos = onpMonto + afpMonto + datos.prestamosDeducidos + datos.otrosDescuentos;
  const montoNeto = Number((montoBruto - totalDescuentos).toFixed(2));

  return {
    sueldoBase: datos.sueldoBase,
    asignacionFamiliarMonto,
    bonos: datos.bonos,
    horasExtras: datos.horasExtras,
    gratificacionMonto,
    ctsMonto,
    bonoExtraordinarioMonto,
    essaludMonto,
    afpMonto,
    onpMonto,
    prestamosDeducidos: datos.prestamosDeducidos,
    otrosDescuentos: datos.otrosDescuentos,
    montoBruto,
    montoNeto,
  };
}

export function calcularAlicuota(montoTotal: number, alicuota: number): number {
  return Number(((montoTotal * alicuota) / 100).toFixed(2));
}

export function calcularFondoReserva(montoTotal: number, porcentaje: number): number {
  return Number(((montoTotal * porcentaje) / 100).toFixed(2));
}