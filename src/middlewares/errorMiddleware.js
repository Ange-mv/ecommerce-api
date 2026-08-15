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

function manejarErrores(
  err,
  req,
  res,
  next
) {
  console.error(err);


  // ========================================
  // ERROR DE CLAVE FORÁNEA DE SEQUELIZE
  // ========================================

  if (
    err.name ===
    "SequelizeForeignKeyConstraintError"
  ) {
    return res.status(409).json({
      ok: false,

      message:
        "No se puede realizar la operación porque el registro está relacionado con otros datos",
    });
  }


  const status =
    err.status || 500;


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