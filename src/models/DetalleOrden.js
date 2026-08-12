const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DetalleOrden = sequelize.define(
  "DetalleOrden",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    orden_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    nombre_producto: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
  },
  {
    tableName: "detalle_orden",
    timestamps: false,
  }
);

module.exports = DetalleOrden;