const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Carrito = sequelize.define(
  "Carrito",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    created_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "carritos",
    timestamps: false,
  }
);

module.exports = Carrito;