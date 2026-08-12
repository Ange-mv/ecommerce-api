// ========================================
// RUTA NO ENCONTRADA
// ========================================

function rutaNoEncontrada(req, res) {
  res.status(404).json({
    ok: false,
    message: "Ruta no encontrada",
  });
}


// ========================================
// MANEJADOR GLOBAL DE ERRORES
// ========================================

function manejarErrores(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;

  const message =
    status === 500
      ? "Error interno del servidor"
      : err.message;

  res.status(status).json({
    ok: false,
    message,
  });
}


module.exports = {
  rutaNoEncontrada,
  manejarErrores,
};