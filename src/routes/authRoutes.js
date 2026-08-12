const express = require("express");

const {
  registrarUsuario,
  iniciarSesion,
} = require("../controllers/authController");

const {
  limiteLogin,
} = require("../middlewares/securityMiddleware");


const router = express.Router();

router.post("/register", registrarUsuario);

router.post(
  "/login",
  limiteLogin,
  iniciarSesion
);

module.exports = router;