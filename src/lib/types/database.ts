export interface Plan {
  id: string;
  nombre: string;
  slug: string;
  max_condominios: number;
  precio_mensual: number;
  moneda: string;
  activo: boolean;
  orden: number;
  created_at: string;
}

export interface Perfil {
  id: string;
  username: string;
  email: string;
  nombre_completo: string | null;
  telefono: string | null;
  tema: string;
  modo_oscuro: boolean;
  idioma: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Suscripcion {
  id: string;
  user_id: string;
  webapp_slug: string;
  plan_id: string;
  estado: string;
  fecha_inicio: string;
  fecha_vencimiento: string;
  monto_pagado: number;
  metodo_pago: string | null;
  referencia_pago: string | null;
  auto_renovar: boolean;
  created_at: string;
  updated_at: string;
  plan?: Plan;
}

export interface DeudaSuscripcion {
  id: string;
  suscripcion_id: string;
  monto: number;
  mes_correspondiente: string;
  estado: string;
  fecha_pago: string | null;
  created_at: string;
}

export interface Condominio {
  id: string;
  user_id: string;
  nombre: string;
  direccion: string | null;
  rif: string | null;
  fondo_reserva_porcentaje: number;
  formato_fecha: string;
  formato_hora: string;
  simbolo_moneda: string;
  ubicacion: string;
  logo_url: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Unidad {
  id: string;
  condominio_id: string;
  numero: string;
  propietario: string | null;
  email_propietario: string | null;
  telefono_propietario: string | null;
  alicuota: number;
  activo: boolean;
  created_at: string;
}

export interface Personal {
  id: string;
  condominio_id: string;
  nombre: string;
  cargo: string | null;
  telefono: string | null;
  documento_identidad: string | null;
  salario: number | null;
  fecha_ingreso: string | null;
  fecha_cese: string | null;
  asignacion_familiar: boolean;
  regimen_pensionario: string;
  afp_nombre: string | null;
  cuspp: string | null;
  observaciones: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Asistencia {
  id: string;
  personal_id: string;
  fecha: string;
  estado: string;
  hora_entrada: string | null;
  hora_salida: string | null;
  observacion: string | null;
  created_at: string;
}

export interface Prestamo {
  id: string;
  personal_id: string;
  condominio_id: string;
  monto: number;
  saldo_pendiente: number;
  cuotas_pactadas: number;
  fecha: string;
  motivo: string | null;
  estado: string;
  created_at: string;
}

export interface Dotacion {
  id: string;
  personal_id: string;
  descripcion: string;
  cantidad: number;
  fecha_entrega: string;
  fecha_devolucion: string | null;
  estado: string;
  observacion: string | null;
  created_at: string;
}

export interface PermisoPersonal {
  id: string;
  personal_id: string;
  fecha_inicio: string;
  fecha_fin: string;
  motivo: string | null;
  tipo: string | null;
  aprobado: boolean;
  created_at: string;
}

export interface Movimiento {
  id: string;
  condominio_id: string;
  tipo: 'ingreso' | 'egreso';
  categoria: string;
  descripcion: string;
  monto: number;
  fecha: string;
  estado: string;
  tipo_comprobante: string;
  serie_correlativo: string | null;
  igv_monto: number;
  comprobante_url: string | null;
  referencia_id: string | null;
  referencia_tipo: string | null;
  created_at: string;
}

export interface Recibo {
  id: string;
  unidad_id: string;
  condominio_id: string;
  mes: string;
  monto_total: number;
  alicuota_calculada: number;
  estado: string;
  fecha_vencimiento: string | null;
  created_at: string;
  unidad?: Unidad;
}

export interface PagoRecibo {
  id: string;
  recibo_id: string;
  monto: number;
  fecha_pago: string;
  metodo_pago: string | null;
  referencia: string | null;
  comprobante_url: string | null;
  created_at: string;
}

export interface Nomina {
  id: string;
  personal_id: string;
  condominio_id: string;
  mes: string;
  sueldo_base: number;
  asignacion_familiar_monto: number;
  bonos: number;
  horas_extras: number;
  gratificacion_monto: number;
  cts_monto: number;
  bono_extraordinario_monto: number;
  essalud_monto: number;
  afp_monto: number;
  onp_monto: number;
  prestamos_deducidos: number;
  otros_descuentos: number;
  monto_bruto: number;
  monto_neto: number;
  fecha_pago: string | null;
  estado: string;
  created_at: string;
  personal?: Personal;
}

export interface Mensaje {
  id: string;
  condominio_id: string;
  autor_id: string;
  tipo: string;
  titulo: string;
  contenido: string;
  respuesta_a: string | null;
  fijado: boolean;
  visible: boolean;
  created_at: string;
  updated_at: string;
  autor?: Perfil;
}

export interface LogAcceso {
  id: string;
  user_id: string | null;
  accion: string;
  ip_address: string | null;
  user_agent: string | null;
  webapp_slug: string | null;
  detalles: Record<string, unknown> | null;
  created_at: string;
}

export interface AdminWebapp {
  id: string;
  user_id: string;
  webapp_slug: string;
  es_super_admin: boolean;
  totp_secret: string | null;
  totp_activado: boolean;
  intentos_fallidos: number;
  bloqueado_hasta: string | null;
  created_at: string;
}

export interface ConfigWebapp {
  id: string;
  webapp_slug: string;
  nombre: string;
  descripcion: string | null;
  precio_texto: string | null;
  video_url: string | null;
  imagen_url: string | null;
  activa: boolean;
  orden: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}