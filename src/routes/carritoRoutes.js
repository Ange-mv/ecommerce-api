const express = require("express");

const {
  obtenerCarrito,
  agregarProductoAlCarrito,
  actualizarCantidadProducto,
  eliminarProductoDelCarrito,
} = require("../controllers/carritoController");

const {
  verificarToken,
} = require("../middlewares/authMiddleware");

const router = express.Router();


// Obtener carrito
router.get(
  "/",
  verificarToken,
  obtenerCarrito
);


// Agregar producto al carrito
router.post(
  "/productos",
  verificarToken,
  agregarProductoAlCarrito
);

// Actualizar cantidad de un producto
router.put(
  "/productos/:productoId",
  verificarToken,
  actualizarCantidadProducto
);

// Eliminar producto del carrito
router.delete(
  "/productos/:productoId",
  verificarToken,
  eliminarProductoDelCarrito
);

module.exports = router;