const multer = require("multer");
const path = require("path");


// ========================================
// CONFIGURACIÓN DE ALMACENAMIENTO
// ========================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(
        __dirname,
        "../../uploads/productos"
      )
    );
  },

  filename: function (req, file, cb) {
    const extension =
      path.extname(file.originalname);

    const nombreArchivo =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      extension;

    cb(null, nombreArchivo);
  },
});


// ========================================
// VALIDAR TIPO DE ARCHIVO
// ========================================

const fileFilter = (req, file, cb) => {
  const tiposPermitidos = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!tiposPermitidos.includes(file.mimetype)) {
    return cb(
      new Error(
        "Solo se permiten imágenes JPG, PNG o WEBP"
      )
    );
  }

  cb(null, true);
};


// ========================================
// CONFIGURAR MULTER
// ========================================

const uploadProducto = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter,
});


// ========================================
// MANEJAR ERRORES DE MULTER
// ========================================

function subirImagenProducto(req, res, next) {
  uploadProducto.single("imagen")(
    req,
    res,
    function (error) {

      if (error) {

        if (
          error instanceof multer.MulterError &&
          error.code === "LIMIT_FILE_SIZE"
        ) {
          return res.status(400).json({
            ok: false,
            message:
              "La imagen no puede superar los 5 MB",
          });
        }

        return res.status(400).json({
          ok: false,
          message:
            error.message ||
            "Error al subir la imagen",
        });
      }

      next();
    }
  );
}


module.exports = {
  subirImagenProducto,
};