const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Usuario } = require("../models");
const AppError = require("../utils/AppError");


// ========================================
// REGISTRAR USUARIO
// ========================================

async function registrarUsuario(req, res, next) {
  try {
    const {
      nombre,
      email,
      password,
    } = req.body;


    // ========================================
    // VALIDAR CAMPOS
    // ========================================

    if (
      !nombre ||
      !email ||
      !password
    ) {
      throw new AppError(
        "Nombre, email y password son obligatorios",
        400
      );
    }


    // Validar contraseña
    if (password.length < 6) {
      throw new AppError(
        "La contraseña debe tener al menos 6 caracteres",
        400
      );
    }


    // ========================================
    // NORMALIZAR EMAIL
    // ========================================

    const emailNormalizado =
      email.trim().toLowerCase();


    // ========================================
    // COMPROBAR EMAIL EXISTENTE
    // ========================================

    const usuarioExistente =
      await Usuario.findOne({
        where: {
          email: emailNormalizado,
        },
      });


    if (usuarioExistente) {
      throw new AppError(
        "El email ya está registrado",
        400
      );
    }


    // ========================================
    // ENCRIPTAR CONTRASEÑA
    // ========================================

    const passwordHash =
      await bcrypt.hash(
        password,
        10
      );


    // ========================================
    // CREAR USUARIO
    // ========================================

    const nuevoUsuario =
      await Usuario.create({
        nombre: nombre.trim(),
        email: emailNormalizado,
        password: passwordHash,
        rol: "cliente",
      });


    // ========================================
    // RESPUESTA
    // ========================================

    res.status(201).json({
      ok: true,

      message:
        "Usuario registrado correctamente",

      usuario: {
        id:
          nuevoUsuario.id,

        nombre:
          nuevoUsuario.nombre,

        email:
          nuevoUsuario.email,

        rol:
          nuevoUsuario.rol,
      },
    });

  } catch (error) {
    next(error);
  }
}


// ========================================
// INICIAR SESIÓN
// ========================================

async function iniciarSesion(req, res, next) {
  try {
    const {
      email,
      password,
    } = req.body;


    // ========================================
    // VALIDAR CAMPOS
    // ========================================

    if (
      !email ||
      !password
    ) {
      throw new AppError(
        "Email y password son obligatorios",
        400
      );
    }


    const emailNormalizado =
      email.trim().toLowerCase();


    // ========================================
    // BUSCAR USUARIO
    // ========================================

    const usuario =
      await Usuario.findOne({
        where: {
          email: emailNormalizado,
        },
      });


    if (!usuario) {
      throw new AppError(
        "Credenciales inválidas",
        401
      );
    }


    // ========================================
    // COMPARAR CONTRASEÑA
    // ========================================

    const passwordCorrecta =
      await bcrypt.compare(
        password,
        usuario.password
      );


    if (!passwordCorrecta) {
      throw new AppError(
        "Credenciales inválidas",
        401
      );
    }


    // ========================================
    // GENERAR JWT
    // ========================================

    const token =
      jwt.sign(
        {
          id:
            usuario.id,

          email:
            usuario.email,

          rol:
            usuario.rol,
        },

        process.env.JWT_SECRET,

        {
          expiresIn: "1h",
        }
      );


    // ========================================
    // RESPUESTA
    // ========================================

    res.status(200).json({
      ok: true,

      message:
        "Inicio de sesión correcto",

      token,

      usuario: {
        id:
          usuario.id,

        nombre:
          usuario.nombre,

        email:
          usuario.email,

        rol:
          usuario.rol,
      },
    });

  } catch (error) {
    next(error);
  }
}


// ========================================
// EXPORTAR FUNCIONES
// ========================================

module.exports = {
  registrarUsuario,
  iniciarSesion,
};