const {
  Carrito,
  CarritoProducto,
  Producto,
} = require("../models");

const AppError = require("../utils/AppError");

const {
  obtenerIdValido,
  obtenerEnteroPositivo,
} = require("../utils/validaciones");


// ========================================
// OBTENER CARRITO DEL USUARIO
// ========================================

async function obtenerCarrito(req, res, next) {
  try {
    const usuarioId = req.user.id;

    // Buscar carrito o crearlo si no existe
    const [carrito] = await Carrito.findOrCreate({
      where: {
        usuario_id: usuarioId,
      },

      defaults: {
        usuario_id: usuarioId,
      },
    });


    // Buscar carrito completo con sus productos
    const carritoCompleto = await Carrito.findByPk(
      carrito.id,
      {
        include: [
          {
            model: CarritoProducto,
            as: "items",

            attributes: [
              "id",
              "cantidad",
            ],

            include: [
              {
                model: Producto,
                as: "producto",

                attributes: [
                  "id",
                  "nombre",
                  "descripcion",
                  "precio",
                  "stock",
                ],
              },
            ],
          },
        ],
      }
    );


    // Preparar productos con subtotal
    const items = carritoCompleto.items.map(
      (item) => {
        const precio =
          Number(item.producto.precio);

        return {
          id: item.id,

          cantidad:
            item.cantidad,

          producto: {
            id:
              item.producto.id,

            nombre:
              item.producto.nombre,

            descripcion:
              item.producto.descripcion,

            precio:
              item.producto.precio,

            stock:
              item.producto.stock,
          },

          subtotal:
            precio * item.cantidad,
        };
      }
    );


    // Calcular total del carrito
    const total = items.reduce(
      (acumulador, item) =>
        acumulador + item.subtotal,
      0
    );


    res.status(200).json({
      ok: true,

      carrito: {
        id:
          carritoCompleto.id,

        usuario_id:
          carritoCompleto.usuario_id,

        items,

        total,
      },
    });

  } catch (error) {
    next(error);
  }
}


// ========================================
// AGREGAR PRODUCTO AL CARRITO
// ========================================

async function agregarProductoAlCarrito(
  req,
  res,
  next
) {
  try {
    const usuarioId =
      req.user.id;

    const {
      producto_id,
      cantidad,
    } = req.body;


    // ========================================
    // VALIDAR CAMPOS OBLIGATORIOS
    // ========================================

    if (
      producto_id === undefined ||
      cantidad === undefined
    ) {
      throw new AppError(
        "producto_id y cantidad son obligatorios",
        400
      );
    }


    // ========================================
    // VALIDAR ID DEL PRODUCTO
    // ========================================

    const productoId =
      obtenerIdValido(
        producto_id,
        "producto_id"
      );


    // ========================================
    // VALIDAR CANTIDAD
    // ========================================

    const cantidadNumerica =
      obtenerEnteroPositivo(
        cantidad,
        "cantidad"
      );


    // ========================================
    // BUSCAR PRODUCTO
    // ========================================

    const producto =
      await Producto.findByPk(
        productoId
      );


    if (!producto) {
      throw new AppError(
        "Producto no encontrado",
        404
      );
    }


    // ========================================
    // VALIDAR STOCK
    // ========================================

    if (
      cantidadNumerica >
      producto.stock
    ) {
      throw new AppError(
        "Stock insuficiente",
        400
      );
    }


    // ========================================
    // BUSCAR O CREAR CARRITO
    // ========================================

    const [carrito] =
      await Carrito.findOrCreate({
        where: {
          usuario_id:
            usuarioId,
        },

        defaults: {
          usuario_id:
            usuarioId,
        },
      });


    // ========================================
    // BUSCAR SI EL PRODUCTO YA ESTÁ
    // EN EL CARRITO
    // ========================================

    const itemExistente =
      await CarritoProducto.findOne({
        where: {
          carrito_id:
            carrito.id,

          producto_id:
            productoId,
        },
      });


    // ========================================
    // SI YA EXISTE, SUMAR CANTIDAD
    // ========================================

    if (itemExistente) {
      const nuevaCantidad =
        itemExistente.cantidad +
        cantidadNumerica;


      if (
        nuevaCantidad >
        producto.stock
      ) {
        throw new AppError(
          "La cantidad solicitada supera el stock disponible",
          400
        );
      }


      await itemExistente.update({
        cantidad:
          nuevaCantidad,
      });


      return res.status(200).json({
        ok: true,

        message:
          "Cantidad del producto actualizada en el carrito",

        item: {
          id:
            itemExistente.id,

          producto_id:
            productoId,

          cantidad:
            itemExistente.cantidad,
        },
      });
    }


    // ========================================
    // CREAR NUEVO ITEM
    // ========================================

    const nuevoItem =
      await CarritoProducto.create({
        carrito_id:
          carrito.id,

        producto_id:
          productoId,

        cantidad:
          cantidadNumerica,
      });


    res.status(201).json({
      ok: true,

      message:
        "Producto agregado al carrito correctamente",

      item: {
        id:
          nuevoItem.id,

        producto_id:
          nuevoItem.producto_id,

        cantidad:
          nuevoItem.cantidad,
      },
    });

  } catch (error) {
    next(error);
  }
}


// ========================================
// ACTUALIZAR CANTIDAD DE UN PRODUCTO
// ========================================

async function actualizarCantidadProducto(
  req,
  res,
  next
) {
  try {
    const usuarioId =
      req.user.id;

    const {
      productoId,
    } = req.params;

    const {
      cantidad,
    } = req.body;


    // ========================================
    // VALIDAR ID DEL PRODUCTO
    // ========================================

    const productoIdValido =
      obtenerIdValido(
        productoId,
        "productoId"
      );


    // ========================================
    // VALIDAR CANTIDAD
    // ========================================

    if (cantidad === undefined) {
      throw new AppError(
        "La cantidad es obligatoria",
        400
      );
    }


    const cantidadNumerica =
      obtenerEnteroPositivo(
        cantidad,
        "cantidad"
      );


    // ========================================
    // BUSCAR PRODUCTO
    // ========================================

    const producto =
      await Producto.findByPk(
        productoIdValido
      );


    if (!producto) {
      throw new AppError(
        "Producto no encontrado",
        404
      );
    }


    // ========================================
    // VALIDAR STOCK
    // ========================================

    if (
      cantidadNumerica >
      producto.stock
    ) {
      throw new AppError(
        "La cantidad supera el stock disponible",
        400
      );
    }


    // ========================================
    // BUSCAR CARRITO
    // ========================================

    const carrito =
      await Carrito.findOne({
        where: {
          usuario_id:
            usuarioId,
        },
      });


    if (!carrito) {
      throw new AppError(
        "Carrito no encontrado",
        404
      );
    }


    // ========================================
    // BUSCAR PRODUCTO EN EL CARRITO
    // ========================================

    const item =
      await CarritoProducto.findOne({
        where: {
          carrito_id:
            carrito.id,

          producto_id:
            productoIdValido,
        },
      });


    if (!item) {
      throw new AppError(
        "El producto no está en el carrito",
        404
      );
    }


    // ========================================
    // ACTUALIZAR CANTIDAD
    // ========================================

    await item.update({
      cantidad:
        cantidadNumerica,
    });


    res.status(200).json({
      ok: true,

      message:
        "Cantidad actualizada correctamente",

      item: {
        id:
          item.id,

        producto_id:
          productoIdValido,

        cantidad:
          item.cantidad,
      },
    });

  } catch (error) {
    next(error);
  }
}


// ========================================
// ELIMINAR PRODUCTO DEL CARRITO
// ========================================

async function eliminarProductoDelCarrito(
  req,
  res,
  next
) {
  try {
    const usuarioId =
      req.user.id;

    const {
      productoId,
    } = req.params;


    // ========================================
    // VALIDAR ID DEL PRODUCTO
    // ========================================

    const productoIdValido =
      obtenerIdValido(
        productoId,
        "productoId"
      );


    // ========================================
    // BUSCAR CARRITO
    // ========================================

    const carrito =
      await Carrito.findOne({
        where: {
          usuario_id:
            usuarioId,
        },
      });


    if (!carrito) {
      throw new AppError(
        "Carrito no encontrado",
        404
      );
    }


    // ========================================
    // BUSCAR PRODUCTO EN EL CARRITO
    // ========================================

    const item =
      await CarritoProducto.findOne({
        where: {
          carrito_id:
            carrito.id,

          producto_id:
            productoIdValido,
        },
      });


    if (!item) {
      throw new AppError(
        "El producto no está en el carrito",
        404
      );
    }


    // ========================================
    // ELIMINAR ITEM
    // ========================================

    await item.destroy();


    res.status(200).json({
      ok: true,

      message:
        "Producto eliminado del carrito correctamente",
    });

  } catch (error) {
    next(error);
  }
}


// ========================================
// EXPORTAR FUNCIONES
// ========================================

module.exports = {
  obtenerCarrito,
  agregarProductoAlCarrito,
  actualizarCantidadProducto,
  eliminarProductoDelCarrito,
};