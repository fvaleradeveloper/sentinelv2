export const WEBAPPS_CONFIG = {
  'sentinel-condominio': {
    nombre: 'Sentinel Condominio',
    descripcion: 'Gestión integral de condominios residenciales',
    ruta: '/sentinel-condominio/dashboard',
  },
  'sentinel-vigilancia': {
    nombre: 'Sentinel Vigilancia',
    descripcion: 'Control y monitoreo de seguridad',
    ruta: '/sentinel-vigilancia',
  },
  'sentinel-administracion': {
    nombre: 'Sentinel Administración',
    descripcion: 'Administración empresarial',
    ruta: '/sentinel-administracion',
  },
  'sentinel-contabilidad': {
    nombre: 'Sentinel Contabilidad',
    descripcion: 'Contabilidad y finanzas',
    ruta: '/sentinel-contabilidad',
  },
  'sentinel-construccion': {
    nombre: 'Sentinel Construcción',
    descripcion: 'Gestión de proyectos de construcción',
    ruta: '/sentinel-construccion',
  },
} as const;

export type WebappSlug = keyof typeof WEBAPPS_CONFIG;