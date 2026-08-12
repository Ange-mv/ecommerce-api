const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CarritoProducto = sequelize.define(
  "CarritoProducto",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    carrito_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    created_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "carrito_productos",
    timestamps: false,
  }
);

module.exports = CarritoProducto;