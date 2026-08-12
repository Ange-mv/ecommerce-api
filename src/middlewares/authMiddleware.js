const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  try {
    // Obtener el header Authorization
    const authHeader = req.headers.authorization;

    // Comprobar que exista
    if (!authHeader) {
      return res.status(401).json({
        ok: false,
        message: "Token no proporcionado",
      });
    }

    // El formato esperado es:
    // Bearer TOKEN
    const [tipo, token] = authHeader.split(" ");

    if (tipo !== "Bearer" || !token) {
      return res.status(401).json({
        ok: false,
        message: "Formato de token inválido",
      });
    }

    // Verificar token
    const usuarioDecodificado = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Guardar la información del usuario en la petición
    req.user = usuarioDecodificado;

    // Continuar hacia el controller
    next();

  } catch (error) {

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        ok: false,
        message: "Token expirado",
      });
    }

    return res.status(401).json({
      ok: false,
      message: "Token inválido",
    });
  }
}

module.exports = {
  verificarToken,
};