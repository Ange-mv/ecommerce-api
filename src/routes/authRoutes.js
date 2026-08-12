const express = require("express");

const {
  registrarUsuario,
  iniciarSesion,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registrarUsuario);

router.post("/login", iniciarSesion);

module.exports = router;