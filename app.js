const reader = require('xlsx')
const axios = require("axios");
const express = require('express');
const api = express();
api.use(express.json());
api.use(express.urlencoded({
  extended: true
}));

const pipePedidos = require("./routes/pipe-pedidos")
const pipeLiga = require("./routes/pipe-pedidos")
const pipeAssociados = require("./routes/pipe-pedidos")
const pipeServicos = require("./routes/pipe-pedidos")

api.use("/pipe-pedidos", pipePedidos)
api.use("/pipe-liga", pipeLiga)
api.use("/pipe-associados", pipeAssociados)
api.use("/pipe-servicos", pipeServicos)

  api.listen(process.env.PORT || 3000, () => {
      console.log('API RUN!');
    });
  