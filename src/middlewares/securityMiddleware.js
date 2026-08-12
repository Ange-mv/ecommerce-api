const {
  rateLimit,
} = require("express-rate-limit");


// ========================================
// LIMITAR INTENTOS DE LOGIN
// ========================================

const limiteLogin = rateLimit({
  windowMs:
    15 * 60 * 1000,

  limit:
    20,

  standardHeaders:
    true,

  legacyHeaders:
    false,

  message: {
    ok: false,

    message:
      "Demasiados intentos de inicio de sesión. Intenta nuevamente más tarde",
  },
});


module.exports = {
  limiteLogin,
};