const sequelize = require("../config/database");

const {
  Carrito,
  CarritoProducto,
  Producto,
  Orden,
  DetalleOrden,
} = require("../models");


// ========================================
// CREAR ORDEN
// ========================================

async function crearOrden(req, res) {
  try {
    const usuarioId = req.user.id;

    const resultado = await sequelize.transaction(
      async (transaction) => {

        // ========================================
        // 1. BUSCAR CARRITO DEL USUARIO
        // ========================================

        const carrito = await Carrito.findOne({
          where: {
            usuario_id: usuarioId,
          },
          transaction,
        });

        if (!carrito) {
          const error = new Error(
            "Carrito no encontrado"
          );

          error.status = 404;

          throw error;
        }


        // ========================================
        // 2. OBTENER ITEMS DEL CARRITO
        // ========================================

        const itemsCarrito =
          await CarritoProducto.findAll({
            where: {
              carrito_id: carrito.id,
            },
            transaction,
          });


        if (itemsCarrito.length === 0) {
          const error = new Error(
            "El carrito está vacío"
          );

          error.status = 400;

          throw error;
        }


        // Aquí guardaremos los productos
        // validados antes de crear la orden
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

                // Bloqueamos el producto durante
                // esta transacción
                lock: transaction.LOCK.UPDATE,
              }
            );


          if (!producto) {
            const error = new Error(
              `Producto ${item.producto_id} no encontrado`
            );

            error.status = 404;

            throw error;
          }


          if (producto.stock < item.cantidad) {
            const error = new Error(
              `Stock insuficiente para ${producto.nombre}`
            );

            error.status = 400;

            throw error;
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
              usuario_id: usuarioId,

              total,

              // Como todavía no tenemos
              // pasarela de pago, simularemos
              // una compra completada.
              estado: "pagada",
            },
            {
              transaction,
            }
          );


        // ========================================
        // 5. PREPARAR DETALLE DE ORDEN
        // ========================================

        const detalles =
          productosCompra.map((item) => {
            return {
              orden_id: nuevaOrden.id,

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
            };
          });


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

        for (const item of productosCompra) {

          const nuevoStock =
            item.producto.stock -
            item.cantidad;


          await item.producto.update(
            {
              stock: nuevoStock,
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
            carrito_id: carrito.id,
          },
          transaction,
        });


        // Todo salió correctamente.
        // Sequelize hará COMMIT.
        return {
          orden: nuevaOrden,
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
        id: resultado.orden.id,

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

    console.error(error);


    res.status(
      error.status || 500
    ).json({
      ok: false,

      message:
        error.status
          ? error.message
          : "Error al crear la orden",
    });
  }
}

// ========================================
// OBTENER ÓRDENES DEL USUARIO
// ========================================

async function obtenerOrdenes(req, res) {
  try {
    const usuarioId = req.user.id;

    const ordenes = await Orden.findAll({
      where: {
        usuario_id: usuarioId,
      },

      include: [
        {
          model: DetalleOrden,
          as: "detalles",
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
        ["created_at", "DESC"],
      ],
    });

    res.status(200).json({
      ok: true,
      ordenes,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      message: "Error al obtener las órdenes",
    });
  }
}

// ========================================
// OBTENER ORDEN POR ID
// ========================================

async function obtenerOrdenPorId(req, res) {
  try {
    const usuarioId = req.user.id;
    const { id } = req.params;

    const orden = await Orden.findOne({
      where: {
        id,
        usuario_id: usuarioId,
      },

      include: [
        {
          model: DetalleOrden,
          as: "detalles",
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
      return res.status(404).json({
        ok: false,
        message: "Orden no encontrada",
      });
    }

    res.status(200).json({
      ok: true,
      orden,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      message: "Error al obtener la orden",
    });
  }
}

module.exports = {
  crearOrden,
  obtenerOrdenes,
  obtenerOrdenPorId,
};