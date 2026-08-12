const AppError = require("./AppError");


// ========================================
// VALIDAR ID
// ========================================

function obtenerIdValido(
  valor,
  nombreCampo = "id"
) {
  const numero = Number(valor);

  if (
    !Number.isInteger(numero) ||
    numero <= 0
  ) {
    throw new AppError(
      `${nombreCampo} debe ser un número entero válido`,
      400
    );
  }

  return numero;
}


// ========================================
// VALIDAR ENTERO POSITIVO
// ========================================

function obtenerEnteroPositivo(
  valor,
  nombreCampo
) {
  const numero = Number(valor);

  if (
    !Number.isInteger(numero) ||
    numero <= 0
  ) {
    throw new AppError(
      `${nombreCampo} debe ser un número entero mayor a 0`,
      400
    );
  }

  return numero;
}


// ========================================
// VALIDAR NÚMERO NO NEGATIVO
// ========================================

function obtenerNumeroNoNegativo(
  valor,
  nombreCampo
) {
  const numero = Number(valor);

  if (
    Number.isNaN(numero) ||
    numero < 0
  ) {
    throw new AppError(
      `${nombreCampo} debe ser un número mayor o igual a 0`,
      400
    );
  }

  return numero;
}


// ========================================
// VALIDAR EMAIL
// ========================================

function validarEmail(email) {
  const expresion =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    typeof email !== "string" ||
    !expresion.test(email.trim())
  ) {
    throw new AppError(
      "El email no tiene un formato válido",
      400
    );
  }

  return email
    .trim()
    .toLowerCase();
}


module.exports = {
  obtenerIdValido,
  obtenerEnteroPositivo,
  obtenerNumeroNoNegativo,
  validarEmail,
};