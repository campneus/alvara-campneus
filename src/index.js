const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize } = require("./models");
const allRoutes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use("/api", allRoutes);

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, "..", "client", "dist")));

// Para qualquer outra rota, servir o index.html do frontend
app.get("", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
});

// Tratamento de erros
app.use(errorHandler);

// Sincronizar modelos com o banco de dados e iniciar o servidor
sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Database synchronized");
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });


