CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'cliente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),

    categoria_id INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_producto_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES categorias(id)
);

INSERT INTO categorias (nombre)
VALUES
('Teclados'),
('Mouse'),
('Monitores'),
('Audífonos');

SELECT * FROM categorias;

INSERT INTO productos
(nombre, descripcion, precio, stock, categoria_id)
VALUES
(
    'Teclado Mecánico',
    'Teclado mecánico para gaming',
    39990,
    15,
    1
),
(
    'Mouse Inalámbrico',
    'Mouse inalámbrico ergonómico',
    19990,
    25,
    2
),
(
    'Monitor 24 pulgadas',
    'Monitor Full HD',
    129990,
    8,
    3
);

SELECT * FROM productos;

SELECT
    productos.id,
    productos.nombre,
    productos.precio,
    productos.stock,
    categorias.nombre AS categoria
FROM productos
INNER JOIN categorias
ON productos.categoria_id = categorias.id;

SELECT * FROM usuarios;

UPDATE usuarios
SET rol = 'admin'
WHERE email = 'admin@ecommerce.com';

SELECT
    id,
    nombre,
    email,
    rol
FROM usuarios;

CREATE TABLE carritos (
    id SERIAL PRIMARY KEY,

    usuario_id INTEGER UNIQUE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_carrito_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

CREATE TABLE carrito_productos (
    id SERIAL PRIMARY KEY,

    carrito_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,

    cantidad INTEGER NOT NULL DEFAULT 1
        CHECK (cantidad > 0),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_carrito_producto_carrito
        FOREIGN KEY (carrito_id)
        REFERENCES carritos(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_carrito_producto_producto
        FOREIGN KEY (producto_id)
        REFERENCES productos(id),

    CONSTRAINT uq_carrito_producto
        UNIQUE (carrito_id, producto_id)
);

SELECT * FROM carritos;

SELECT * FROM carrito_productos;

SELECT
    id,
    nombre,
    stock
FROM productos
WHERE id = 2;

CREATE TABLE ordenes (
    id SERIAL PRIMARY KEY,

    usuario_id INTEGER NOT NULL,

    total DECIMAL(12,2) NOT NULL
        CHECK (total >= 0),

    estado VARCHAR(20) NOT NULL
        DEFAULT 'pendiente'
        CHECK (
            estado IN (
                'pendiente',
                'pagada',
                'cancelada'
            )
        ),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_orden_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
);

CREATE TABLE detalle_orden (
    id SERIAL PRIMARY KEY,

    orden_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,

    nombre_producto VARCHAR(150) NOT NULL,

    cantidad INTEGER NOT NULL
        CHECK (cantidad > 0),

    precio_unitario DECIMAL(10,2) NOT NULL
        CHECK (precio_unitario >= 0),

    subtotal DECIMAL(12,2) NOT NULL
        CHECK (subtotal >= 0),

    CONSTRAINT fk_detalle_orden
        FOREIGN KEY (orden_id)
        REFERENCES ordenes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_detalle_producto
        FOREIGN KEY (producto_id)
        REFERENCES productos(id)
);

SELECT * FROM ordenes;

SELECT * FROM detalle_orden;

ALTER TABLE productos
ADD COLUMN imagen VARCHAR(255);

SELECT
    id,
    nombre,
    imagen
FROM productos;