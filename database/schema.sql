-- =========================================
-- BASE DE DATOS E-COMMERCE API
-- =========================================


-- =========================================
-- USUARIOS
-- =========================================

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'cliente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- CATEGORÍAS
-- =========================================

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- PRODUCTOS
-- =========================================

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,

    precio DECIMAL(10,2) NOT NULL
        CHECK (precio >= 0),

    stock INTEGER NOT NULL DEFAULT 0
        CHECK (stock >= 0),

    categoria_id INTEGER NOT NULL,

    imagen VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_producto_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES categorias(id)
);


-- =========================================
-- CARRITOS
-- =========================================

CREATE TABLE carritos (
    id SERIAL PRIMARY KEY,

    usuario_id INTEGER UNIQUE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_carrito_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);


-- =========================================
-- PRODUCTOS DEL CARRITO
-- =========================================

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


-- =========================================
-- ÓRDENES
-- =========================================

CREATE TABLE ordenes (
    id SERIAL PRIMARY KEY,

    usuario_id INTEGER NOT NULL,

    total DECIMAL(12,2) NOT NULL
        CHECK (total >= 0),

    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente'
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


-- =========================================
-- DETALLE DE ÓRDENES
-- =========================================

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