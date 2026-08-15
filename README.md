# E-commerce API REST

API REST para un sistema de comercio electrónico desarrollada con Node.js, Express, PostgreSQL y Sequelize.

El proyecto implementa autenticación mediante JWT, autorización por roles, gestión de productos y categorías, carrito de compras, órdenes de compra con transacciones, control de stock y carga de imágenes.

## Tecnologías utilizadas

- Node.js
- Express
- PostgreSQL
- Sequelize
- JSON Web Token
- bcrypt
- Multer
- Helmet
- express-rate-limit
- CORS
- dotenv

## Funcionalidades

### Autenticación

- Registro de usuarios
- Inicio de sesión
- Contraseñas cifradas con bcrypt
- Generación de JWT
- Protección de rutas
- Roles `cliente` y `admin`
- Limitación de intentos de inicio de sesión

### Productos

- Listar productos
- Obtener producto por ID
- Crear productos
- Actualizar productos
- Eliminar productos
- Buscar productos por nombre o descripción
- Filtrar por categoría
- Filtrar por rango de precio
- Ordenar resultados
- Paginación
- Subir imágenes de productos

### Categorías

- Listar categorías
- Obtener categoría por ID
- Crear categorías
- Actualizar categorías
- Eliminar categorías
- Protección contra eliminación de categorías con productos asociados

### Carrito

- Obtener carrito del usuario
- Agregar productos
- Modificar cantidades
- Eliminar productos
- Validar stock disponible
- Calcular subtotales
- Calcular total del carrito

### Órdenes

- Crear una orden desde el carrito
- Registrar detalle de productos comprados
- Mantener precio y nombre histórico de cada producto
- Descontar stock
- Vaciar carrito después de la compra
- Consultar historial de órdenes
- Consultar una orden específica

La creación de una orden utiliza una transacción de base de datos para asegurar que todas las operaciones se completen correctamente o se reviertan en caso de error.

### Seguridad y validaciones

- JWT
- Autorización basada en roles
- Hash de contraseñas con bcrypt
- Helmet
- Rate limiting en login
- Manejo centralizado de errores
- Validación de IDs
- Validación de emails
- Validación de precios
- Validación de stock
- Validación de cantidades

---

## Estructura del proyecto

```text
ecommerce-api/
│
├── src/
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── carritoController.js
│   │   ├── categoriaController.js
│   │   ├── ordenController.js
│   │   └── productoController.js
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── securityMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── Carrito.js
│   │   ├── CarritoProducto.js
│   │   ├── Categoria.js
│   │   ├── DetalleOrden.js
│   │   ├── Orden.js
│   │   ├── Producto.js
│   │   ├── Usuario.js
│   │   └── index.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── carritoRoutes.js
│   │   ├── categoriaRoutes.js
│   │   ├── ordenRoutes.js
│   │   └── productoRoutes.js
│   │
│   ├── utils/
│   │   ├── AppError.js
│   │   └── validaciones.js
│   │
│   ├── app.js
│   └── server.js
│
├── uploads/
│   └── productos/
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

# Instalación

## 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
```

Entrar al proyecto:

```bash
cd ecommerce-api
```

## 2. Instalar dependencias

```bash
npm install
```

## 3. Configurar PostgreSQL

Crear una base de datos:

```text
ecommerce_db
```
Ejecutar el archivo:

```text
database/schema.sql

Configurar las credenciales en un archivo `.env`.

Ejemplo:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=tu_password

JWT_SECRET=tu_clave_secreta
```

No se debe subir el archivo `.env` al repositorio.

## 4. Ejecutar el proyecto

Modo desarrollo:

```bash
npm run dev
```

La API estará disponible en:

```text
http://localhost:3000
```

---

# Endpoints

## Autenticación

### Registrar usuario

```http
POST /api/auth/register
```

Ejemplo:

```json
{
  "nombre": "Usuario",
  "email": "usuario@email.com",
  "password": "123456"
}
```

### Iniciar sesión

```http
POST /api/auth/login
```

```json
{
  "email": "usuario@email.com",
  "password": "123456"
}
```

La respuesta incluye un JWT.

---

# Productos

### Listar productos

```http
GET /api/productos
```

### Obtener producto

```http
GET /api/productos/:id
```

### Crear producto

Requiere usuario administrador.

```http
POST /api/productos
```

```json
{
  "nombre": "Teclado Mecánico",
  "descripcion": "Teclado para escritorio",
  "precio": 39990,
  "stock": 15,
  "categoria_id": 1
}
```

### Actualizar producto

```http
PUT /api/productos/:id
```

Requiere administrador.

### Eliminar producto

```http
DELETE /api/productos/:id
```

Requiere administrador.

### Subir imagen

```http
POST /api/productos/:id/imagen
```

Requiere administrador.

Se utiliza `multipart/form-data`.

Nombre del campo:

```text
imagen
```

Formatos permitidos:

- JPG
- PNG
- WEBP

Tamaño máximo:

```text
5 MB
```

---

# Búsqueda y filtros

Buscar:

```http
GET /api/productos?buscar=mouse
```

Filtrar por categoría:

```http
GET /api/productos?categoria_id=1
```

Filtrar por precio:

```http
GET /api/productos?min_precio=10000&max_precio=50000
```

Paginación:

```http
GET /api/productos?pagina=1&limite=5
```

Ordenar:

```http
GET /api/productos?orden=precio_asc
```

Opciones disponibles:

```text
precio_asc
precio_desc
nombre_asc
nombre_desc
recientes
```

Los filtros pueden combinarse.

Ejemplo:

```http
GET /api/productos?categoria_id=1&min_precio=10000&max_precio=50000&orden=precio_asc&pagina=1&limite=5
```

---

# Categorías

```http
GET    /api/categorias
GET    /api/categorias/:id
POST   /api/categorias
PUT    /api/categorias/:id
DELETE /api/categorias/:id
```

Las operaciones POST, PUT y DELETE requieren rol administrador.

---

# Carrito

Todas las rutas requieren autenticación JWT.

### Obtener carrito

```http
GET /api/carrito
```

### Agregar producto

```http
POST /api/carrito/productos
```

```json
{
  "producto_id": 4,
  "cantidad": 2
}
```

### Actualizar cantidad

```http
PUT /api/carrito/productos/:productoId
```

```json
{
  "cantidad": 3
}
```

### Eliminar producto

```http
DELETE /api/carrito/productos/:productoId
```

---

# Órdenes

Todas las rutas requieren autenticación JWT.

### Crear orden

```http
POST /api/ordenes
```

La orden se genera utilizando los productos existentes en el carrito del usuario.

Durante el proceso:

1. Se valida el carrito.
2. Se valida el stock.
3. Se bloquean los productos durante la transacción.
4. Se crea la orden.
5. Se crean los detalles.
6. Se descuenta el stock.
7. Se vacía el carrito.
8. Se confirma la transacción.

Si ocurre un error, los cambios se revierten.

### Historial de órdenes

```http
GET /api/ordenes
```

### Consultar orden

```http
GET /api/ordenes/:id
```

Un usuario solo puede consultar sus propias órdenes.

---

# Autorización

Para las rutas protegidas se debe enviar:

```http
Authorization: Bearer TOKEN
```

Existen dos roles:

```text
cliente
admin
```

Los clientes pueden:

- utilizar el carrito
- realizar compras
- consultar sus órdenes

Los administradores pueden además:

- crear productos
- modificar productos
- eliminar productos
- subir imágenes
- administrar categorías

---

# Códigos HTTP utilizados

```text
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
429 Too Many Requests
500 Internal Server Error
```

---

# Manejo de errores

La API utiliza un manejador global de errores.

Ejemplo:

```json
{
  "ok": false,
  "message": "Producto no encontrado"
}
```

Los errores esperados utilizan `AppError`, permitiendo centralizar el código HTTP y los mensajes de respuesta.

---