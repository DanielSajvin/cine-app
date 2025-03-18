// configuracion del servidor
const express = require("express");
const port = 3000;
//require("dotenv").config();

const app = express();
const empaquetado = require("./routes/empaquetado.routes");

app.use(express.json());

app.use("/api", empaquetado);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
