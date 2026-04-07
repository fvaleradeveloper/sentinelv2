import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatFecha(fecha: string, formato: string = 'dd/MM/yyyy'): string {
  return format(parseISO(fecha), formato, { locale: es });
}

export function formatMoneda(monto: number, simbolo: string = 'S/'): string {
  return `${simbolo} ${monto.toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatMes(mes: string): string {
  const [anio, mesNum] = mes.split('-');
  const fecha = new Date(Number(anio), Number(mesNum) - 1, 1);
  return format(fecha, 'MMMM yyyy', { locale: es });
}

export function formatPorcentaje(valor: number): string {
  return `${valor.toFixed(2)}%`;
}

export function capitalize(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}