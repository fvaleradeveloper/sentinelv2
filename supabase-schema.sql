-- ============================================================
-- SENTINEL SAAS - ESQUEMA DE BASE DE DATOS (IDEMPOTENTE)
-- ============================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- FUNCIÓN: Verificar si una columna existe en una tabla
-- ============================================================
CREATE OR REPLACE FUNCTION column_exists(table_name text, column_name text)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = $1 AND column_name = $2
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TABLAS PRINCIPALES CON IF NOT EXISTS
-- ============================================================

-- Tabla de condominios
CREATE TABLE IF NOT EXISTS condominios (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion TEXT,
    rif VARCHAR(20),
    fondo_reserva_porcentaje DECIMAL(5,2) DEFAULT 10.00,
    simbolo_moneda VARCHAR(10) DEFAULT 'S/',
    ubicacion VARCHAR(100) DEFAULT 'Peru',
    activo BOOLEAN DEFAULT TRUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de unidades/residencias
CREATE TABLE IF NOT EXISTS unidades (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    condominio_id UUID REFERENCES condominios(id) ON DELETE CASCADE,
    numero VARCHAR(20) NOT NULL,
    propietario VARCHAR(100),
    email_propietario VARCHAR(255),
    telefono_propietario VARCHAR(20),
    alicuota DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(condominio_id, numero)
);

-- Tabla de personal/empleados
CREATE TABLE IF NOT EXISTS personal (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    condominio_id UUID REFERENCES condominios(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    cargo VARCHAR(100),
    telefono VARCHAR(20),
    documento_identidad VARCHAR(20),
    salario DECIMAL(10,2) DEFAULT 0.00,
    fecha_ingreso DATE,
    asignacion_familiar BOOLEAN DEFAULT FALSE,
    regimen_pensionario VARCHAR(10) DEFAULT 'ONP',
    afp_nombre VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de movimientos financieros (ingresos/egresos)
CREATE TABLE IF NOT EXISTS movimientos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    condominio_id UUID REFERENCES condominios(id) ON DELETE CASCADE,
    tipo VARCHAR(10) CHECK (tipo IN ('ingreso', 'egreso')),
    categoria VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha DATE NOT NULL,
    tipo_comprobante VARCHAR(50),
    serie_correlativo VARCHAR(50),
    igv_monto DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de nóminas
CREATE TABLE IF NOT EXISTS nominas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    condominio_id UUID REFERENCES condominios(id) ON DELETE CASCADE,
    mes VARCHAR(7) NOT NULL, -- Formato: YYYY-MM
    personal_id UUID REFERENCES personal(id) ON DELETE CASCADE,
    salario_base DECIMAL(10,2) NOT NULL,
    bonificaciones DECIMAL(10,2) DEFAULT 0.00,
    descuentos DECIMAL(10,2) DEFAULT 0.00,
    neto_a_pagar DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(condominio_id, mes, personal_id)
);

-- Tabla de préstamos al personal
CREATE TABLE IF NOT EXISTS prestamos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    personal_id UUID REFERENCES personal(id) ON DELETE CASCADE,
    monto DECIMAL(10,2) NOT NULL,
    fecha DATE NOT NULL,
    cuotas_pactadas INTEGER DEFAULT 1,
    motivo TEXT,
    saldo_pendiente DECIMAL(10,2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagado', 'cancelado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de cuotas de préstamos
CREATE TABLE IF NOT EXISTS cuotas_prestamos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    prestamo_id UUID REFERENCES prestamos(id) ON DELETE CASCADE,
    numero_cuota INTEGER NOT NULL,
    monto_cuota DECIMAL(10,2) NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    fecha_pago DATE,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagado', 'atrasado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(prestamo_id, numero_cuota)
);

-- Tabla de mensajes/chat del condominio
CREATE TABLE IF NOT EXISTS mensajes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    condominio_id UUID REFERENCES condominios(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    mensaje TEXT NOT NULL,
    tipo VARCHAR(20) DEFAULT 'general' CHECK (tipo IN ('general', 'importante', 'anuncio')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de deudas de unidades
CREATE TABLE IF NOT EXISTS deudas_unidades (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    unidad_id UUID REFERENCES unidades(id) ON DELETE CASCADE,
    mes VARCHAR(7) NOT NULL, -- Formato: YYYY-MM
    monto DECIMAL(10,2) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagado', 'atrasado')),
    fecha_vencimiento DATE,
    fecha_pago DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(unidad_id, mes)
);

-- Tabla de asistencia del personal
CREATE TABLE IF NOT EXISTS asistencia (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    personal_id UUID REFERENCES personal(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    hora_entrada TIME,
    hora_salida TIME,
    horas_trabajadas DECIMAL(4,2),
    observaciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(personal_id, fecha)
);

-- ============================================================
-- ELIMINACIÓN SEGURA DE OBJETOS EXISTENTES
-- ============================================================

-- Eliminar triggers existentes primero (si existen)
DROP TRIGGER IF EXISTS trigger_calcular_neto_pagar ON nominas;
DROP TRIGGER IF EXISTS trigger_condominios_updated_at ON condominios;
DROP TRIGGER IF EXISTS trigger_unidades_updated_at ON unidades;
DROP TRIGGER IF EXISTS trigger_personal_updated_at ON personal;
DROP TRIGGER IF EXISTS trigger_movimientos_updated_at ON movimientos;
DROP TRIGGER IF EXISTS trigger_nominas_updated_at ON nominas;
DROP TRIGGER IF EXISTS trigger_prestamos_updated_at ON prestamos;
DROP TRIGGER IF EXISTS trigger_cuotas_prestamos_updated_at ON cuotas_prestamos;
DROP TRIGGER IF EXISTS trigger_mensajes_updated_at ON mensajes;
DROP TRIGGER IF EXISTS trigger_deudas_unidades_updated_at ON deudas_unidades;
DROP TRIGGER IF EXISTS trigger_asistencia_updated_at ON asistencia;

-- Eliminar funciones existentes
DROP FUNCTION IF EXISTS calcular_neto_pagar() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at() CASCADE;

-- ============================================================
-- ÍNDICES PARA MEJOR RENDIMIENTO
-- ============================================================

-- Eliminar índices existentes primero
DROP INDEX IF EXISTS idx_condominios_user_id;
DROP INDEX IF EXISTS idx_condominios_activo;
DROP INDEX IF EXISTS idx_unidades_condominio;
DROP INDEX IF EXISTS idx_personal_condominio;
DROP INDEX IF EXISTS idx_movimientos_condominio;
DROP INDEX IF EXISTS idx_movimientos_fecha;
DROP INDEX IF EXISTS idx_nominas_condominio_mes;
DROP INDEX IF EXISTS idx_deudas_unidad_mes;
DROP INDEX IF EXISTS idx_asistencia_personal_fecha;

-- Crear nuevos índices
CREATE INDEX IF NOT EXISTS idx_condominios_user_id ON condominios(user_id);
CREATE INDEX IF NOT EXISTS idx_condominios_activo ON condominios(activo);
CREATE INDEX IF NOT EXISTS idx_unidades_condominio ON unidades(condominio_id);
CREATE INDEX IF NOT EXISTS idx_personal_condominio ON personal(condominio_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_condominio ON movimientos(condominio_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_fecha ON movimientos(fecha);
CREATE INDEX IF NOT EXISTS idx_nominas_condominio_mes ON nominas(condominio_id, mes);
CREATE INDEX IF NOT EXISTS idx_deudas_unidad_mes ON deudas_unidades(unidad_id, mes);
CREATE INDEX IF NOT EXISTS idx_asistencia_personal_fecha ON asistencia(personal_id, fecha);

-- ============================================================
-- POLÍTICAS DE SEGURIDAD RLS (Row Level Security)
-- ============================================================

-- Eliminar políticas existentes de forma manual (evitar eliminación automática que puede fallar)

-- Habilitar RLS en todas las tablas
ALTER TABLE IF EXISTS condominios ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS unidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS personal ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS movimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS nominas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS prestamos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cuotas_prestamos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS mensajes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS deudas_unidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS asistencia ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla condominios
DROP POLICY IF EXISTS "Users can view their own condominios" ON condominios;
CREATE POLICY "Users can view their own condominios" ON condominios
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own condominios" ON condominios;
CREATE POLICY "Users can insert their own condominios" ON condominios
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own condominios" ON condominios;
CREATE POLICY "Users can update their own condominios" ON condominios
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own condominios" ON condominios;
CREATE POLICY "Users can delete their own condominios" ON condominios
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para unidades (solo usuarios del condominio)
DROP POLICY IF EXISTS "Users can view units from their condominios" ON unidades;
CREATE POLICY "Users can view units from their condominios" ON unidades
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM condominios 
            WHERE condominios.id = unidades.condominio_id 
            AND condominios.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert units to their condominios" ON unidades;
CREATE POLICY "Users can insert units to their condominios" ON unidades
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM condominios 
            WHERE condominios.id = unidades.condominio_id 
            AND condominios.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update units in their condominios" ON unidades;
CREATE POLICY "Users can update units in their condominios" ON unidades
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM condominios 
            WHERE condominios.id = unidades.condominio_id 
            AND condominios.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete units from their condominios" ON unidades;
CREATE POLICY "Users can delete units from their condominios" ON unidades
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM condominios 
            WHERE condominios.id = unidades.condominio_id 
            AND condominios.user_id = auth.uid()
        )
    );

-- Políticas para la tabla personal
DROP POLICY IF EXISTS "Users can view personal from their condominios" ON personal;
CREATE POLICY "Users can view personal from their condominios" ON personal
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM condominios 
            WHERE condominios.id = personal.condominio_id 
            AND condominios.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert personal to their condominios" ON personal;
CREATE POLICY "Users can insert personal to their condominios" ON personal
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM condominios 
            WHERE condominios.id = personal.condominio_id 
            AND condominios.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update personal in their condominios" ON personal;
CREATE POLICY "Users can update personal in their condominios" ON personal
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM condominios 
            WHERE condominios.id = personal.condominio_id 
            AND condominios.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete personal from their condominios" ON personal;
CREATE POLICY "Users can delete personal from their condominios" ON personal
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM condominios 
            WHERE condominios.id = personal.condominio_id 
            AND condominios.user_id = auth.uid()
        )
    );

-- Políticas para la tabla movimientos
DROP POLICY IF EXISTS "Users can view movimientos from their condominios" ON movimientos;
CREATE POLICY "Users can view movimientos from their condominios" ON movimientos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM condominios 
            WHERE condominios.id = movimientos.condominio_id 
            AND condominios.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert movimientos to their condominios" ON movimientos;
CREATE POLICY "Users can insert movimientos to their condominios" ON movimientos
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM condominios 
            WHERE condominios.id = movimientos.condominio_id 
            AND condominios.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update movimientos in their condominios" ON movimientos;
CREATE POLICY "Users can update movimientos in their condominios" ON movimientos
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM condominios 
            WHERE condominios.id = movimientos.condominio_id 
            AND condominios.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete movimientos from their condominios" ON movimientos;
CREATE POLICY "Users can delete movimientos from their condominios" ON movimientos
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM condominios 
            WHERE condominios.id = movimientos.condominio_id 
            AND condominios.user_id = auth.uid()
        )
    );

-- Políticas para la tabla nominas
DROP POLICY IF EXISTS "Users can view nominas from their condominios" ON nominas;
CREATE POLICY "Users can view nominas from their condominios" ON nominas
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM condominios 
            WHERE condominios.id = nominas.condominio_id 
            AND condominios.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert nominas to their condominios" ON nominas;
CREATE POLICY "Users can insert nominas to their condominios" ON nominas
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM condominios 
            WHERE condominios.id = nominas.condominio_id 
            AND condominios.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update nominas in their condominios" ON nominas;
CREATE POLICY "Users can update nominas in their condominios" ON nominas
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM condominios 
            WHERE condominios.id = nominas.condominio_id 
            AND condominios.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete nominas from their condominios" ON nominas;
CREATE POLICY "Users can delete nominas from their condominios" ON nominas
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM condominios 
            WHERE condominios.id = nominas.condominio_id 
            AND condominios.user_id = auth.uid()
        )
    );

-- Políticas para la tabla prestamos
DROP POLICY IF EXISTS "Users can view prestamos from their condominios" ON prestamos;
CREATE POLICY "Users can view prestamos from their condominios" ON prestamos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM personal 
            JOIN condominios ON condominios.id = personal.condominio_id
            WHERE personal.id = prestamos.personal_id 
            AND condominios.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert prestamos to their condominios" ON prestamos;
CREATE POLICY "Users can insert prestamos to their condominios" ON prestamos
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM personal 
            JOIN condominios ON condominios.id = personal.condominio_id
            WHERE personal.id = prestamos.personal_id 
            AND condominios.user_id = auth.uid()
        )
    );

-- Políticas para la tabla deudas_unidades
DROP POLICY IF EXISTS "Users can view deudas from their condominios" ON deudas_unidades;
CREATE POLICY "Users can view deudas from their condominios" ON deudas_unidades
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM unidades 
            JOIN condominios ON condominios.id = unidades.condominio_id
            WHERE unidades.id = deudas_unidades.unidad_id 
            AND condominios.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert deudas to their condominios" ON deudas_unidades;
CREATE POLICY "Users can insert deudas to their condominios" ON deudas_unidades
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM unidades 
            JOIN condominios ON condominios.id = unidades.condominio_id
            WHERE unidades.id = deudas_unidades.unidad_id 
            AND condominios.user_id = auth.uid()
        )
    );

-- ============================================================
-- FUNCIONES Y TRIGGERS
-- ============================================================

-- Función para calcular el neto a pagar en nómina
CREATE OR REPLACE FUNCTION calcular_neto_pagar()
RETURNS TRIGGER AS $$
BEGIN
    NEW.neto_a_pagar := NEW.salario_base + COALESCE(NEW.bonificaciones, 0) - COALESCE(NEW.descuentos, 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para nóminas
CREATE TRIGGER trigger_calcular_neto_pagar
    BEFORE INSERT OR UPDATE ON nominas
    FOR EACH ROW
    EXECUTE FUNCTION calcular_neto_pagar();

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at en todas las tablas
CREATE TRIGGER trigger_condominios_updated_at
    BEFORE UPDATE ON condominios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_unidades_updated_at
    BEFORE UPDATE ON unidades
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_personal_updated_at
    BEFORE UPDATE ON personal
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ... y así para todas las tablas que tengan updated_at

-- ============================================================
-- FIN DEL ESQUEMA IDEMPOTENTE
-- ============================================================