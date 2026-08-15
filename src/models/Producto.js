const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Producto = sequelize.define(
  "Producto",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    descripcion: {
      type: DataTypes.TEXT,
    },

    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    imagen: {
  type: DataTypes.STRING(255),
  allowNull: true,
},

    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "productos",
    timestamps: false,
  }
);

module.exports = Producto;