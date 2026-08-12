const Categoria = require("./Categoria");
const Producto = require("./Producto");
const Usuario = require("./Usuario");
const Carrito = require("./Carrito");
const CarritoProducto = require("./CarritoProducto");
const Orden = require("./Orden");
const DetalleOrden = require("./DetalleOrden");


// ========================================
// CATEGORÍAS Y PRODUCTOS
// ========================================

Categoria.hasMany(Producto, {
  foreignKey: "categoria_id",
  as: "productos",
});

Producto.belongsTo(Categoria, {
  foreignKey: "categoria_id",
  as: "categoria",
});


// ========================================
// USUARIO Y CARRITO
// ========================================

Usuario.hasOne(Carrito, {
  foreignKey: "usuario_id",
  as: "carrito",
});

Carrito.belongsTo(Usuario, {
  foreignKey: "usuario_id",
  as: "usuario",
});


// ========================================
// CARRITO Y SUS PRODUCTOS
// ========================================

Carrito.hasMany(CarritoProducto, {
  foreignKey: "carrito_id",
  as: "items",
});

CarritoProducto.belongsTo(Carrito, {
  foreignKey: "carrito_id",
  as: "carrito",
});


Producto.hasMany(CarritoProducto, {
  foreignKey: "producto_id",
  as: "carritos",
});

CarritoProducto.belongsTo(Producto, {
  foreignKey: "producto_id",
  as: "producto",
});

// ========================================
// USUARIO Y ÓRDENES
// ========================================

Usuario.hasMany(Orden, {
  foreignKey: "usuario_id",
  as: "ordenes",
});

Orden.belongsTo(Usuario, {
  foreignKey: "usuario_id",
  as: "usuario",
});


// ========================================
// ORDEN Y DETALLE DE ORDEN
// ========================================

Orden.hasMany(DetalleOrden, {
  foreignKey: "orden_id",
  as: "detalles",
});

DetalleOrden.belongsTo(Orden, {
  foreignKey: "orden_id",
  as: "orden",
});


// ========================================
// PRODUCTO Y DETALLE DE ORDEN
// ========================================

Producto.hasMany(DetalleOrden, {
  foreignKey: "producto_id",
  as: "detallesOrden",
});

DetalleOrden.belongsTo(Producto, {
  foreignKey: "producto_id",
  as: "producto",
});

module.exports = {
  Categoria,
  Producto,
  Usuario,
  Carrito,
  CarritoProducto,
  Orden,
  DetalleOrden,
};