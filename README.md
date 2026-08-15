# E-commerce API REST

API REST para un sistema de comercio electrónico desarrollada con **Node.js, Express, PostgreSQL y Sequelize**.

El proyecto implementa autenticación con JWT, autorización mediante roles, gestión de productos y categorías, carrito de compras, órdenes con transacciones, control de stock, carga de imágenes y manejo centralizado de errores.

## Tecnologías utilizadas

* Node.js
* Express
* PostgreSQL
* Sequelize
* JSON Web Token (JWT)
* bcrypt
* Multer
* Helmet
* express-rate-limit
* CORS
* dotenv

## Funcionalidades

### Autenticación

* Registro de usuarios.
* Inicio de sesión.
* Contraseñas protegidas con bcrypt.
* Generación de tokens JWT.
* Protección de rutas mediante middleware.
* Roles `cliente` y `admin`.
* Validación de email y contraseña.
* Limitación de intentos repetidos de inicio de sesión.

### Productos

* Listar productos.
* Obtener un producto por ID.
* Crear productos.
* Actualizar productos.
* Eliminar productos.
* Buscar por nombre o descripción.
* Filtrar por categoría.
* Filtrar por rango de precio.
* Ordenar resultados.
* Paginación.
* Subir imágenes mediante Multer.
* Validación de precio, stock, categoría e IDs.
* Protección contra eliminación de productos relacionados con órdenes o carritos.

### Categorías

* Listar categorías.
* Obtener categoría por ID.
* Crear categorías.
* Actualizar categorías.
* Eliminar categorías.
* Validación de nombres e IDs.
* Protección contra eliminación de categorías con productos asociados.

### Carrito

* Obtener el carrito del usuario autenticado.
* Agregar productos.
* Actualizar cantidades.
* Eliminar productos.
* Validar stock disponible.
* Evitar cantidades inválidas.
* Calcular subtotales.
* Calcular el total del carrito.

### Órdenes

* Crear una orden desde el carrito.
* Registrar el detalle histórico de los productos comprados.
* Mantener el nombre y precio del producto al momento de la compra.
* Validar stock.
* Descontar stock.
* Vaciar el carrito después de realizar una compra.
* Consultar historial de órdenes.
* Consultar una orden específica del usuario autenticado.

La creación de una orden se ejecuta mediante una **transacción de base de datos**. Si alguna operación falla, todos los cambios realizados durante la compra se revierten.

### Seguridad y manejo de errores

* Autenticación JWT.
* Autorización basada en roles.
* Hash de contraseñas con bcrypt.
* Helmet para headers HTTP de seguridad.
* Rate limiting en el endpoint de login.
* Manejo centralizado de errores.
* Errores personalizados mediante `AppError`.
* Validación reutilizable de datos.
* Control de errores de claves foráneas.
* Respuestas HTTP consistentes en formato JSON.

---

## Estructura del proyecto

```text
ecommerce-api/
│
├── database/
│   ├── schema.sql
│   └── seed.sql
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
│       └── .gitkeep
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
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

> Reemplaza `URL_DEL_REPOSITORIO` por la URL real del repositorio de GitHub.

## 2. Instalar dependencias

```bash
npm install
```

## 3. Crear la base de datos

En PostgreSQL crear:

```text
ecommerce_db
```

Después ejecutar:

```text
database/schema.sql
```

Este archivo crea las tablas, claves primarias, claves foráneas, relaciones y restricciones necesarias para ejecutar la API.

Opcionalmente se pueden cargar categorías y productos de demostración ejecutando:

```text
database/seed.sql
```

El orden correcto es:

```text
1. database/schema.sql
2. database/seed.sql
```

El archivo `seed.sql` no contiene usuarios, contraseñas ni información sensible.

## 4. Configurar variables de entorno

Crear un archivo:

```text
.env
```

tomando como referencia:

```text
.env.example
```

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

El archivo `.env` contiene información privada y **no debe subirse al repositorio**.

## 5. Ejecutar el proyecto

Modo desarrollo:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

La API estará disponible por defecto en:

```text
http://localhost:3000
```

---

# Usuarios y roles

La aplicación utiliza dos roles:

```text
cliente
admin
```

Los usuarios registrados mediante:

```http
POST /api/auth/register
```

se crean automáticamente con el rol:

```text
cliente
```

Por seguridad, la API no permite que un usuario se registre directamente como administrador.

## Crear un administrador para desarrollo

Primero registrar normalmente un usuario mediante la API.

Después, desde PostgreSQL, actualizar su rol:

```sql
UPDATE usuarios
SET rol = 'admin'
WHERE email = 'admin@ecommerce.com';
```

El email utilizado debe corresponder a un usuario previamente registrado.

---

# Endpoints

## Autenticación

### Registrar usuario

```http
POST /api/auth/register
```

Body:

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

Body:

```json
{
  "email": "usuario@email.com",
  "password": "123456"
}
```

La respuesta incluye un token JWT que debe utilizarse posteriormente en las rutas protegidas.

---

# Productos

## Listar productos

```http
GET /api/productos
```

No requiere autenticación.

## Obtener producto por ID

```http
GET /api/productos/:id
```

No requiere autenticación.

## Crear producto

```http
POST /api/productos
```

Requiere autenticación y rol `admin`.

Ejemplo:

```json
{
  "nombre": "Teclado Mecánico",
  "descripcion": "Teclado para escritorio",
  "precio": 39990,
  "stock": 15,
  "categoria_id": 1
}
```

## Actualizar producto

```http
PUT /api/productos/:id
```

Requiere autenticación y rol `admin`.

Admite actualización parcial de los campos.

## Eliminar producto

```http
DELETE /api/productos/:id
```

Requiere autenticación y rol `admin`.

Si el producto está relacionado con una orden o carrito, la API devuelve:

```text
409 Conflict
```

en lugar de eliminar el registro.

## Subir imagen de producto

```http
POST /api/productos/:id/imagen
```

Requiere autenticación y rol `admin`.

Se utiliza:

```text
multipart/form-data
```

Nombre del campo:

```text
imagen
```

Formatos permitidos:

* JPG / JPEG
* PNG
* WEBP

Tamaño máximo:

```text
5 MB
```

Las imágenes se almacenan en:

```text
uploads/productos/
```

Los archivos subidos se encuentran excluidos del repositorio mediante `.gitignore`.

---

# Búsqueda, filtros y paginación

## Buscar por nombre o descripción

```http
GET /api/productos?buscar=mouse
```

## Filtrar por categoría

```http
GET /api/productos?categoria_id=1
```

## Filtrar por rango de precio

```http
GET /api/productos?min_precio=10000&max_precio=50000
```

## Paginación

```http
GET /api/productos?pagina=1&limite=5
```

El límite máximo permitido por petición es de 50 productos.

## Ordenamiento

```http
GET /api/productos?orden=precio_asc
```

Opciones:

```text
precio_asc
precio_desc
nombre_asc
nombre_desc
recientes
```

Los parámetros pueden combinarse.

Ejemplo:

```http
GET /api/productos?categoria_id=1&min_precio=10000&max_precio=50000&orden=precio_asc&pagina=1&limite=5
```

---

# Categorías

## Listar categorías

```http
GET /api/categorias
```

## Obtener categoría

```http
GET /api/categorias/:id
```

## Crear categoría

```http
POST /api/categorias
```

Requiere rol `admin`.

## Actualizar categoría

```http
PUT /api/categorias/:id
```

Requiere rol `admin`.

## Eliminar categoría

```http
DELETE /api/categorias/:id
```

Requiere rol `admin`.

Una categoría que tenga productos asociados no puede eliminarse y devuelve:

```text
409 Conflict
```

---

# Carrito

Todas las rutas del carrito requieren autenticación JWT.

## Obtener carrito

```http
GET /api/carrito
```

## Agregar producto

```http
POST /api/carrito/productos
```

Body:

```json
{
  "producto_id": 4,
  "cantidad": 2
}
```

Si el producto ya existe en el carrito, la cantidad solicitada se suma a la existente siempre que exista stock suficiente.

## Actualizar cantidad

```http
PUT /api/carrito/productos/:productoId
```

Body:

```json
{
  "cantidad": 3
}
```

## Eliminar producto

```http
DELETE /api/carrito/productos/:productoId
```

---

# Órdenes

Todas las rutas de órdenes requieren autenticación JWT.

## Crear orden

```http
POST /api/ordenes
```

La orden se genera utilizando los productos existentes en el carrito del usuario.

Durante la compra:

1. Se busca el carrito del usuario.
2. Se obtienen sus productos.
3. Se valida el stock disponible.
4. Se bloquean temporalmente los registros de productos dentro de la transacción.
5. Se crea la orden.
6. Se registra el detalle histórico de la compra.
7. Se descuenta el stock.
8. Se vacía el carrito.
9. Se confirma la transacción.

Si ocurre un error durante el proceso, los cambios se revierten.

## Historial de órdenes

```http
GET /api/ordenes
```

Devuelve solamente las órdenes correspondientes al usuario autenticado.

## Consultar orden por ID

```http
GET /api/ordenes/:id
```

Un usuario solo puede consultar sus propias órdenes.

---

# Autorización JWT

Las rutas protegidas deben incluir el token en el header:

```http
Authorization: Bearer TOKEN
```

Ejemplo:

```text
Authorization: Bearer eyJhbGciOi...
```

El token tiene una duración configurada de:

```text
1 hora
```

Cuando expira, el usuario debe iniciar sesión nuevamente para obtener un token nuevo.

---

# Permisos por rol

## Cliente

Puede:

* Consultar productos y categorías.
* Utilizar su carrito.
* Crear órdenes.
* Consultar sus propias órdenes.

## Administrador

Puede realizar las acciones del cliente y además:

* Crear productos.
* Actualizar productos.
* Eliminar productos.
* Subir imágenes.
* Crear categorías.
* Actualizar categorías.
* Eliminar categorías.

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

Ejemplos:

```text
400 → datos inválidos
401 → autenticación requerida o token inválido
403 → usuario autenticado sin permisos suficientes
404 → recurso inexistente
409 → conflicto con relaciones existentes
429 → demasiadas solicitudes
500 → error inesperado del servidor
```

---

# Manejo de errores

La API utiliza un middleware global de manejo de errores.

Los errores esperados se generan mediante `AppError`.

Ejemplo:

```json
{
  "ok": false,
  "message": "Producto no encontrado"
}
```

Esto permite mantener respuestas de error uniformes en toda la aplicación.

---

# Base de datos

El proyecto incluye dos scripts SQL.

## `database/schema.sql`

Crea:

* usuarios
* categorías
* productos
* carritos
* productos del carrito
* órdenes
* detalle de órdenes
* claves primarias
* claves foráneas
* restricciones

## `database/seed.sql`

Agrega datos de demostración:

* Teclados
* Mouse
* Monitores
* Audífonos
* Webcams

y productos asociados a esas categorías.

No crea usuarios ni administradores.

---

# Notas sobre archivos de imágenes

Las imágenes cargadas mediante Multer se almacenan localmente en:

```text
uploads/productos/
```

El repositorio conserva solamente:

```text
uploads/productos/.gitkeep
```

Los archivos cargados durante la ejecución de la aplicación no son versionados en Git.

---

# Autor

Proyecto desarrollado como parte de formación en **Desarrollo Full Stack JavaScript**.
