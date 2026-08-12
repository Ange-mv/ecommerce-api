const express = require("express");
const cors = require("cors");
const path = require("path");

const productoRoutes = require("./routes/productoRoutes");
const authRoutes = require("./routes/authRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");
const carritoRoutes = require("./routes/carritoRoutes");
const ordenRoutes = require("./routes/ordenRoutes");

const {
  rutaNoEncontrada,
  manejarErrores,
} = require("./middlewares/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "../uploads")
  )
);

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "E-commerce API funcionando",
  });
});

app.use("/api/productos", productoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/carrito", carritoRoutes);
app.use("/api/ordenes", ordenRoutes);

// Ruta inexistente
app.use(rutaNoEncontrada);

// Manejo global de errores
app.use(manejarErrores);

module.exports = app;