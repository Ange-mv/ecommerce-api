const { Producto, Categoria } = require("../models");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");

const AppError = require("../utils/AppError");


// ========================================
// OBTENER TODOS LOS PRODUCTOS
// BÚSQUEDA + FILTROS + PAGINACIÓN
// ========================================

async function obtenerProductos(req, res, next) {
  try {
    const {
      buscar,
      categoria_id,
      min_precio,
      max_precio,
      pagina = 1,
      limite = 5,
      orden = "recientes",
    } = req.query;


    // ========================================
    // PAGINACIÓN
    // ========================================

    const numeroPagina = Math.max(
      parseInt(pagina, 10) || 1,
      1
    );

    const limiteSolicitado = Math.max(
      parseInt(limite, 10) || 5,
      1
    );

    const limiteFinal = Math.min(
      limiteSolicitado,
      50
    );

    const offset =
      (numeroPagina - 1) * limiteFinal;


    // ========================================
    // FILTROS
    // ========================================

    const where = {};


    // Buscar por nombre o descripción
    if (buscar && buscar.trim()) {
      where[Op.or] = [
        {
          nombre: {
            [Op.iLike]:
              `%${buscar.trim()}%`,
          },
        },
        {
          descripcion: {
            [Op.iLike]:
              `%${buscar.trim()}%`,
          },
        },
      ];
    }


    // Filtrar por categoría
    if (categoria_id !== undefined) {
      const categoriaId =
        Number(categoria_id);

      if (
        !Number.isInteger(categoriaId) ||
        categoriaId <= 0
      ) {
        throw new AppError(
          "categoria_id debe ser un número válido",
          400
        );
      }

      where.categoria_id =
        categoriaId;
    }


    // ========================================
    // FILTRO POR PRECIO
    // ========================================

    if (
      min_precio !== undefined ||
      max_precio !== undefined
    ) {
      where.precio = {};
    }


    if (min_precio !== undefined) {
      const precioMinimo =
        Number(min_precio);

      if (
        Number.isNaN(precioMinimo) ||
        precioMinimo < 0
      ) {
        throw new AppError(
          "min_precio debe ser un número válido",
          400
        );
      }

      where.precio[Op.gte] =
        precioMinimo;
    }


    if (max_precio !== undefined) {
      const precioMaximo =
        Number(max_precio);

      if (
        Number.isNaN(precioMaximo) ||
        precioMaximo < 0
      ) {
        throw new AppError(
          "max_precio debe ser un número válido",
          400
        );
      }

      where.precio[Op.lte] =
        precioMaximo;
    }


    if (
      min_precio !== undefined &&
      max_precio !== undefined &&
      Number(min_precio) >
        Number(max_precio)
    ) {
      throw new AppError(
        "min_precio no puede ser mayor que max_precio",
        400
      );
    }


    // ========================================
    // ORDENAMIENTO
    // ========================================

    let order;

    switch (orden) {
      case "precio_asc":
        order = [["precio", "ASC"]];
        break;

      case "precio_desc":
        order = [["precio", "DESC"]];
        break;

      case "nombre_asc":
        order = [["nombre", "ASC"]];
        break;

      case "nombre_desc":
        order = [["nombre", "DESC"]];
        break;

      default:
        order = [["id", "DESC"]];
    }


    // ========================================
    // CONSULTAR PRODUCTOS
    // ========================================

    const resultado =
      await Producto.findAndCountAll({
        where,

        include: [
          {
            model: Categoria,
            as: "categoria",
            attributes: [
              "id",
              "nombre",
            ],
          },
        ],

        order,

        limit: limiteFinal,

        offset,

        distinct: true,
      });


    // ========================================
    // AGREGAR URL DE IMAGEN
    // ========================================

    const productosConImagen =
      resultado.rows.map((producto) => {

        const productoJSON =
          producto.toJSON();

        return {
          ...productoJSON,

          imagen_url:
            producto.imagen
              ? `${req.protocol}://${req.get("host")}/uploads/productos/${producto.imagen}`
              : null,
        };
      });


    // ========================================
    // PAGINACIÓN
    // ========================================

    const totalProductos =
      resultado.count;

    const totalPaginas =
      Math.ceil(
        totalProductos / limiteFinal
      );


    // ========================================
    // RESPUESTA
    // ========================================

    res.status(200).json({
      ok: true,

      productos:
        productosConImagen,

      paginacion: {
        pagina:
          numeroPagina,

        limite:
          limiteFinal,

        totalProductos,

        totalPaginas,
      },
    });

  } catch (error) {
    next(error);
  }
}


// ========================================
// OBTENER PRODUCTO POR ID
// ========================================

async function obtenerProductoPorId(req, res, next) {
  try {
    const { id } = req.params;

    const producto =
      await Producto.findByPk(
        id,
        {
          include: [
            {
              model: Categoria,
              as: "categoria",
              attributes: [
                "id",
                "nombre",
              ],
            },
          ],
        }
      );


    if (!producto) {
      throw new AppError(
        "Producto no encontrado",
        404
      );
    }


    const productoJSON =
      producto.toJSON();


    productoJSON.imagen_url =
      producto.imagen
        ? `${req.protocol}://${req.get("host")}/uploads/productos/${producto.imagen}`
        : null;


    res.status(200).json({
      ok: true,
      producto: productoJSON,
    });

  } catch (error) {
    next(error);
  }
}


// ========================================
// CREAR PRODUCTO
// ========================================

async function crearProducto(req, res, next) {
  try {
    const {
      nombre,
      descripcion,
      precio,
      stock,
      categoria_id,
    } = req.body;


    // Validar campos obligatorios
    if (
      !nombre ||
      precio === undefined ||
      stock === undefined ||
      !categoria_id
    ) {
      throw new AppError(
        "Los campos nombre, precio, stock y categoria_id son obligatorios",
        400
      );
    }


    // Validar precio
    if (Number(precio) < 0) {
      throw new AppError(
        "El precio no puede ser negativo",
        400
      );
    }


    // Validar stock
    if (Number(stock) < 0) {
      throw new AppError(
        "El stock no puede ser negativo",
        400
      );
    }


    // Validar categoría
    const categoria =
      await Categoria.findByPk(
        categoria_id
      );


    if (!categoria) {
      throw new AppError(
        "La categoría indicada no existe",
        400
      );
    }


    // Crear producto
    const nuevoProducto =
      await Producto.create({
        nombre,
        descripcion,
        precio,
        stock,
        categoria_id,
      });


    res.status(201).json({
      ok: true,

      message:
        "Producto creado correctamente",

      producto:
        nuevoProducto,
    });

  } catch (error) {
    next(error);
  }
}


// ========================================
// ACTUALIZAR PRODUCTO
// ========================================

async function actualizarProducto(req, res, next) {
  try {
    const { id } = req.params;

    const {
      nombre,
      descripcion,
      precio,
      stock,
      categoria_id,
    } = req.body;


    // Buscar producto
    const producto =
      await Producto.findByPk(id);


    if (!producto) {
      throw new AppError(
        "Producto no encontrado",
        404
      );
    }


    // Validar precio
    if (
      precio !== undefined &&
      Number(precio) < 0
    ) {
      throw new AppError(
        "El precio no puede ser negativo",
        400
      );
    }


    // Validar stock
    if (
      stock !== undefined &&
      Number(stock) < 0
    ) {
      throw new AppError(
        "El stock no puede ser negativo",
        400
      );
    }


    // Validar categoría
    if (categoria_id !== undefined) {

      const categoria =
        await Categoria.findByPk(
          categoria_id
        );


      if (!categoria) {
        throw new AppError(
          "La categoría indicada no existe",
          400
        );
      }
    }


    // Actualizar producto
    await producto.update({
      nombre:
        nombre ?? producto.nombre,

      descripcion:
        descripcion ??
        producto.descripcion,

      precio:
        precio ?? producto.precio,

      stock:
        stock ?? producto.stock,

      categoria_id:
        categoria_id ??
        producto.categoria_id,
    });


    res.status(200).json({
      ok: true,

      message:
        "Producto actualizado correctamente",

      producto,
    });

  } catch (error) {
    next(error);
  }
}


// ========================================
// ELIMINAR PRODUCTO
// ========================================

async function eliminarProducto(req, res, next) {
  try {
    const { id } = req.params;


    const producto =
      await Producto.findByPk(id);


    if (!producto) {
      throw new AppError(
        "Producto no encontrado",
        404
      );
    }


    // Guardamos el nombre de la imagen
    // antes de eliminar el producto
    const imagenAnterior =
      producto.imagen;


    await producto.destroy();


    // Si tenía imagen, eliminamos
    // también el archivo físico
    if (imagenAnterior) {

      const rutaImagen = path.join(
        __dirname,
        "../../uploads/productos",
        imagenAnterior
      );


      if (fs.existsSync(rutaImagen)) {
        fs.unlinkSync(rutaImagen);
      }
    }


    res.status(200).json({
      ok: true,

      message:
        "Producto eliminado correctamente",
    });

  } catch (error) {
    next(error);
  }
}


// ========================================
// SUBIR IMAGEN DEL PRODUCTO
// ========================================

async function subirImagen(req, res, next) {
  try {
    const { id } = req.params;


    // Buscar producto
    const producto =
      await Producto.findByPk(id);


    // Producto inexistente
    if (!producto) {

      // Multer puede haber guardado
      // el archivo antes de llegar aquí.
      if (req.file) {

        if (
          fs.existsSync(
            req.file.path
          )
        ) {
          fs.unlinkSync(
            req.file.path
          );
        }
      }


      throw new AppError(
        "Producto no encontrado",
        404
      );
    }


    // No se envió archivo
    if (!req.file) {
      throw new AppError(
        "Debes enviar una imagen",
        400
      );
    }


    // Guardar referencia de imagen anterior
    const imagenAnterior =
      producto.imagen;


    // Actualizar base de datos
    await producto.update({
      imagen:
        req.file.filename,
    });


    // ========================================
    // ELIMINAR IMAGEN ANTERIOR
    // ========================================

    if (imagenAnterior) {

      const rutaAnterior =
        path.join(
          __dirname,
          "../../uploads/productos",
          imagenAnterior
        );


      if (
        fs.existsSync(
          rutaAnterior
        )
      ) {
        fs.unlinkSync(
          rutaAnterior
        );
      }
    }


    // ========================================
    // RESPUESTA
    // ========================================

    res.status(200).json({
      ok: true,

      message:
        "Imagen del producto actualizada correctamente",

      producto: {
        id:
          producto.id,

        nombre:
          producto.nombre,

        imagen:
          producto.imagen,

        imagen_url:
          `${req.protocol}://${req.get("host")}` +
          `/uploads/productos/${producto.imagen}`,
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
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  subirImagen,
};