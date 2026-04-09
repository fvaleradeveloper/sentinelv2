import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registroSchema = z.object({
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres').max(50),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmarPassword: z.string(),
}).refine((data) => data.password === data.confirmarPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmarPassword'],
});

export const condominioSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio').max(100),
  direccion: z.string().optional().nullable(),
  rif: z.string().optional().nullable(),
  fondo_reserva_porcentaje: z.number().min(0).max(100).default(10),
  simbolo_moneda: z.string().default('S/'),
  ubicacion: z.string().default('Peru'),
});

export const unidadSchema = z.object({
  numero: z.string().min(1, 'El número de unidad es obligatorio'),
  propietario: z.string().optional(),
  email_propietario: z.string().email('Correo inválido').optional().or(z.literal('')),
  telefono_propietario: z.string().optional(),
  alicuota: z.number().min(0).max(100).default(0),
});

export const personalSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  cargo: z.string().optional(),
  telefono: z.string().optional(),
  documento_identidad: z.string().optional(),
  salario: z.number().min(0).optional(),
  fecha_ingreso: z.string().optional(),
  asignacion_familiar: z.boolean().default(false),
  regimen_pensionario: z.enum(['ONP', 'AFP']).default('ONP'),
  afp_nombre: z.string().optional(),
});

export const movimientoSchema = z.object({
  tipo: z.enum(['ingreso', 'egreso']),
  categoria: z.string().min(1, 'La categoría es obligatoria'),
  descripcion: z.string().min(1, 'La descripción es obligatoria'),
  monto: z.number().positive('El monto debe ser positivo'),
  fecha: z.string().min(1, 'La fecha es obligatoria'),
  tipo_comprobante: z.string().default('Boleta'),
  serie_correlativo: z.string().optional(),
  igv_monto: z.number().min(0).default(0),
});

export const prestamoSchema = z.object({
  monto: z.number().positive('El monto debe ser positivo'),
  cuotas_pactadas: z.number().int().min(1).default(1),
  fecha: z.string().min(1, 'La fecha es obligatoria'),
  motivo: z.string().optional(),
});

export const mensajeSchema = z.object({
  tipo: z.string().min(1, 'El tipo es obligatorio'),
  titulo: z.string().min(1, 'El título es obligatorio').max(200),
  contenido: z.string().min(1, 'El contenido es obligatorio'),
  respuesta_a: z.string().uuid().optional().nullable(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegistroInput = z.infer<typeof registroSchema>;
export type CondominioInput = z.infer<typeof condominioSchema>;
export type UnidadInput = z.infer<typeof unidadSchema>;
export type PersonalInput = z.infer<typeof personalSchema>;
export type MovimientoInput = z.infer<typeof movimientoSchema>;
export type PrestamoInput = z.infer<typeof prestamoSchema>;
export type MensajeInput = z.infer<typeof mensajeSchema>;