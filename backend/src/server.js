// configuracion del servidor
const express = require("express");
const port = 4000;
//require("dotenv").config();

const cors = require("cors");

const app = express();
const empaquetado = require("./routes/empaquetado.routes");

app.use(express.json());
app.use(cors());

app.use("/api", empaquetado);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
