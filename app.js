const reader = require('xlsx')
const axios = require("axios");
const express = require('express');
const api = express();
api.use(express.json());
api.use(express.urlencoded({
  extended: true
}));
const https = require('https');
const fs = require('fs');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const pipePedidos = require("./routes/pipe-pedidos")
const pipeLiga = require("./routes/pipe-pedidos")
const pipeAssociados = require("./routes/pipe-pedidos")
const pipeServicos = require("./routes/pipe-pedidos")

api.use("/", pipePedidos)
api.use("/", pipeLiga)
api.use("/", pipeAssociados)
api.use("/", pipeServicos)

  api.listen(process.env.PORT || 3000, () => {
      console.log('API RUN!');
    });
  