const express = require("express");

const {
  obtenerCategorias,
  obtenerCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} = require("../controllers/categoriaController");

const {
  verificarToken,
} = require("../middlewares/authMiddleware");

const {
  permitirRoles,
} = require("../middlewares/roleMiddleware");

const router = express.Router();


// ========================================
// RUTAS PÚBLICAS
// ========================================

// Obtener todas
router.get("/", obtenerCategorias);

// Obtener una por ID
router.get("/:id", obtenerCategoriaPorId);


// ========================================
// RUTAS SOLO ADMIN
// ========================================

// Crear
router.post(
  "/",
  verificarToken,
  permitirRoles("admin"),
  crearCategoria
);

// Actualizar
router.put(
  "/:id",
  verificarToken,
  permitirRoles("admin"),
  actualizarCategoria
);

// Eliminar
router.delete(
  "/:id",
  verificarToken,
  permitirRoles("admin"),
  eliminarCategoria
);


module.exports = router;