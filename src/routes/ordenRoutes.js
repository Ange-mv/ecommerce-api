const express = require("express");

const {
  crearOrden,
  obtenerOrdenes,
  obtenerOrdenPorId,
} = require("../controllers/ordenController");

const {
  verificarToken,
} = require("../middlewares/authMiddleware");

const router = express.Router();


// ========================================
// OBTENER HISTORIAL DE ÓRDENES
// ========================================

router.get(
  "/",
  verificarToken,
  obtenerOrdenes
);


// ========================================
// OBTENER UNA ORDEN
// ========================================

router.get(
  "/:id",
  verificarToken,
  obtenerOrdenPorId
);


// ========================================
// CREAR ORDEN
// ========================================

router.post(
  "/",
  verificarToken,
  crearOrden
);


module.exports = router;