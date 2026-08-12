const sequelize = require("../config/database");

const {
  Carrito,
  CarritoProducto,
  Producto,
  Orden,
  DetalleOrden,
} = require("../models");

const AppError = require("../utils/AppError");


// ========================================
// CREAR ORDEN
// ========================================

async function crearOrden(req, res, next) {
  try {
    const usuarioId = req.user.id;

    const resultado = await sequelize.transaction(
      async (transaction) => {

        // ========================================
        // 1. BUSCAR CARRITO
        // ========================================

        const carrito = await Carrito.findOne({
          where: {
            usuario_id: usuarioId,
          },
          transaction,
        });


        if (!carrito) {
          throw new AppError(
            "Carrito no encontrado",
            404
          );
        }


        // ========================================
        // 2. OBTENER ITEMS
        // ========================================

        const itemsCarrito =
          await CarritoProducto.findAll({
            where: {
              carrito_id: carrito.id,
            },
            transaction,
          });


        if (itemsCarrito.length === 0) {
          throw new AppError(
            "El carrito está vacío",
            400
          );
        }


        const productosCompra = [];

        let total = 0;


        // ========================================
        // 3. VALIDAR PRODUCTOS Y STOCK
        // ========================================

        for (const item of itemsCarrito) {

          const producto =
            await Producto.findByPk(
              item.producto_id,
              {
                transaction,

                lock:
                  transaction.LOCK.UPDATE,
              }
            );


          if (!producto) {
            throw new AppError(
              `Producto ${item.producto_id} no encontrado`,
              404
            );
          }


          if (
            producto.stock <
            item.cantidad
          ) {
            throw new AppError(
              `Stock insuficiente para ${producto.nombre}`,
              400
            );
          }


          const precio =
            Number(producto.precio);

          const cantidad =
            Number(item.cantidad);

          const subtotal =
            precio * cantidad;


          total += subtotal;


          productosCompra.push({
            producto,
            cantidad,
            precio,
            subtotal,
          });
        }


        // ========================================
        // 4. CREAR ORDEN
        // ========================================

        const nuevaOrden =
          await Orden.create(
            {
              usuario_id:
                usuarioId,

              total,

              estado:
                "pagada",
            },
            {
              transaction,
            }
          );


        // ========================================
        // 5. PREPARAR DETALLES
        // ========================================

        const detalles =
          productosCompra.map(
            (item) => ({
              orden_id:
                nuevaOrden.id,

              producto_id:
                item.producto.id,

              nombre_producto:
                item.producto.nombre,

              cantidad:
                item.cantidad,

              precio_unitario:
                item.precio,

              subtotal:
                item.subtotal,
            })
          );


        // ========================================
        // 6. CREAR DETALLES
        // ========================================

        await DetalleOrden.bulkCreate(
          detalles,
          {
            transaction,
          }
        );


        // ========================================
        // 7. DESCONTAR STOCK
        // ========================================

        for (
          const item
          of productosCompra
        ) {

          const nuevoStock =
            item.producto.stock -
            item.cantidad;


          await item.producto.update(
            {
              stock:
                nuevoStock,
            },
            {
              transaction,
            }
          );
        }


        // ========================================
        // 8. VACIAR CARRITO
        // ========================================

        await CarritoProducto.destroy({
          where: {
            carrito_id:
              carrito.id,
          },
          transaction,
        });


        return {
          orden:
            nuevaOrden,

          detalles,
        };
      }
    );


    // ========================================
    // RESPUESTA
    // ========================================

    res.status(201).json({
      ok: true,

      message:
        "Orden creada correctamente",

      orden: {
        id:
          resultado.orden.id,

        usuario_id:
          resultado.orden.usuario_id,

        total:
          resultado.orden.total,

        estado:
          resultado.orden.estado,

        detalles:
          resultado.detalles,
      },
    });

  } catch (error) {
    next(error);
  }
}


// ========================================
// OBTENER ÓRDENES DEL USUARIO
// ========================================

async function obtenerOrdenes(req, res, next) {
  try {
    const usuarioId =
      req.user.id;


    const ordenes =
      await Orden.findAll({
        where: {
          usuario_id:
            usuarioId,
        },

        include: [
          {
            model:
              DetalleOrden,

            as:
              "detalles",

            attributes: [
              "id",
              "producto_id",
              "nombre_producto",
              "cantidad",
              "precio_unitario",
              "subtotal",
            ],
          },
        ],

        order: [
          [
            "created_at",
            "DESC",
          ],
        ],
      });


    res.status(200).json({
      ok: true,
      ordenes,
    });

  } catch (error) {
    next(error);
  }
}


// ========================================
// OBTENER ORDEN POR ID
// ========================================

async function obtenerOrdenPorId(
  req,
  res,
  next
) {
  try {
    const usuarioId =
      req.user.id;

    const {
      id,
    } = req.params;


    const orden =
      await Orden.findOne({
        where: {
          id,

          usuario_id:
            usuarioId,
        },

        include: [
          {
            model:
              DetalleOrden,

            as:
              "detalles",

            attributes: [
              "id",
              "producto_id",
              "nombre_producto",
              "cantidad",
              "precio_unitario",
              "subtotal",
            ],
          },
        ],
      });


    if (!orden) {
      throw new AppError(
        "Orden no encontrada",
        404
      );
    }


    res.status(200).json({
      ok: true,
      orden,
    });

  } catch (error) {
    next(error);
  }
}


// ========================================
// EXPORTAR FUNCIONES
// ========================================

module.exports = {
  crearOrden,
  obtenerOrdenes,
  obtenerOrdenPorId,
};