const express = require("express");

const {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  subirImagen,
} = require("../controllers/productoController");

const {
  verificarToken,
} = require("../middlewares/authMiddleware");

const {
  permitirRoles,
} = require("../middlewares/roleMiddleware");

const {
  subirImagenProducto,
} = require("../middlewares/uploadMiddleware");

const router = express.Router();


// ========================================
// RUTAS PÚBLICAS
// ========================================

// Obtener todos
router.get("/", obtenerProductos);

// Obtener uno
router.get("/:id", obtenerProductoPorId);


// ========================================
// RUTAS SOLO ADMIN
// ========================================

// Crear producto
router.post(
  "/",
  verificarToken,
  permitirRoles("admin"),
  crearProducto
);

// Actualizar producto
router.put(
  "/:id",
  verificarToken,
  permitirRoles("admin"),
  actualizarProducto
);

// Eliminar producto
router.delete(
  "/:id",
  verificarToken,
  permitirRoles("admin"),
  eliminarProducto
);

// Subir imagen de producto
router.post(
  "/:id/imagen",
  verificarToken,
  permitirRoles("admin"),
  subirImagenProducto,
  subirImagen
);

module.exports = router;