const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Orden = sequelize.define(
  "Orden",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    estado: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "pendiente",
    },

    created_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "ordenes",
    timestamps: false,
  }
);

module.exports = Orden;