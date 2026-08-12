require("dotenv").config();

const app = require("./app");
const sequelize = require("./config/database");

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  try {

    await sequelize.authenticate();

    console.log("Conexión a PostgreSQL exitosa");

    app.listen(PORT, () => {
      console.log(
        `Servidor ejecutándose en http://localhost:${PORT}`
      );
    });

  } catch (error) {

    console.error(
      "Error al conectar con PostgreSQL:",
      error.message
    );

  }
}

iniciarServidor();