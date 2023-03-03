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

app.use("/", pipePedidos)
app.use("/", pipeLiga)
app.use("/", pipeAssociados)
app.use("/", pipeServicos)

api.get('/novo-relatorio', async (req, res) => {
 
 
})

  api.get('/', async (req, res) => {
    
    const xlsx = `${__dirname}/relatorio.xlsx`;
    res.download(xlsx)

  })

  api.listen(process.env.PORT || 3000, () => {
      console.log('API RUN!');
    });
  