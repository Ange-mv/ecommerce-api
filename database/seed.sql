-- =========================================
-- DATOS DE PRUEBA - E-COMMERCE API
-- =========================================
--
-- Ejecutar después de database/schema.sql
--
-- Este archivo agrega categorías y productos
-- de demostración.
--
-- No contiene usuarios ni contraseñas.
-- =========================================


-- =========================================
-- CATEGORÍAS
-- =========================================

INSERT INTO categorias (nombre)
VALUES ('Teclados')
ON CONFLICT (nombre) DO NOTHING;


INSERT INTO categorias (nombre)
VALUES ('Mouse')
ON CONFLICT (nombre) DO NOTHING;


INSERT INTO categorias (nombre)
VALUES ('Monitores')
ON CONFLICT (nombre) DO NOTHING;


INSERT INTO categorias (nombre)
VALUES ('Audífonos')
ON CONFLICT (nombre) DO NOTHING;


INSERT INTO categorias (nombre)
VALUES ('Webcams')
ON CONFLICT (nombre) DO NOTHING;



-- =========================================
-- PRODUCTOS
-- =========================================


-- TECLADO MECÁNICO

INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    stock,
    categoria_id
)
SELECT
    'Teclado Mecánico',
    'Teclado mecánico para escritorio',
    39990,
    15,
    id
FROM categorias
WHERE nombre = 'Teclados'
AND NOT EXISTS (
    SELECT 1
    FROM productos
    WHERE nombre = 'Teclado Mecánico'
);



-- MOUSE INALÁMBRICO

INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    stock,
    categoria_id
)
SELECT
    'Mouse Inalámbrico',
    'Mouse inalámbrico para escritorio',
    19990,
    25,
    id
FROM categorias
WHERE nombre = 'Mouse'
AND NOT EXISTS (
    SELECT 1
    FROM productos
    WHERE nombre = 'Mouse Inalámbrico'
);



-- MONITOR 24 PULGADAS

INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    stock,
    categoria_id
)
SELECT
    'Monitor 24 pulgadas',
    'Monitor de 24 pulgadas para escritorio',
    129990,
    8,
    id
FROM categorias
WHERE nombre = 'Monitores'
AND NOT EXISTS (
    SELECT 1
    FROM productos
    WHERE nombre = 'Monitor 24 pulgadas'
);



-- AUDÍFONOS BLUETOOTH

INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    stock,
    categoria_id
)
SELECT
    'Audífonos Bluetooth',
    'Audífonos inalámbricos con conexión Bluetooth',
    24990,
    30,
    id
FROM categorias
WHERE nombre = 'Audífonos'
AND NOT EXISTS (
    SELECT 1
    FROM productos
    WHERE nombre = 'Audífonos Bluetooth'
);



-- WEBCAM FULL HD

INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    stock,
    categoria_id
)
SELECT
    'Webcam Full HD',
    'Webcam Full HD para videollamadas',
    34990,
    12,
    id
FROM categorias
WHERE nombre = 'Webcams'
AND NOT EXISTS (
    SELECT 1
    FROM productos
    WHERE nombre = 'Webcam Full HD'
);