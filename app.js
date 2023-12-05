const reader = require('xlsx')
const axios = require("axios");
const express = require('express');
const api = express();
api.use(express.json());
api.use(express.urlencoded({
  extended: true
}));

const pipePedidos = require("./routes/pipe-pedidos")
const pipeLigaPedidos = require("./routes/liga-pedidos")
const pipeLigaAssociados = require("./routes/liga-associados")
const pipeAssociados = require("./routes/pipe-associados")
const pipeServicos = require("./routes/pipe-servicos")
const est01 = require("./routes/est-01")
const est02 = require("./routes/est-02")
const est03 = require("./routes/est-03")
const est04 = require("./routes/est-04")
const est05 = require("./routes/est-05")

api.use("/pipe-pedidos", pipePedidos)
api.use("/liga", pipeLigaPedidos)
api.use("/liga-associados", pipeLigaAssociados)
api.use("/pipe-associados", pipeAssociados)
api.use("/pipe-servicos", pipeServicos)
api.use("/estoque/est01", est01)
api.use("/estoque/est02", est02)
api.use("/estoque/est03", est03)
api.use("/estoque/est04", est04)
api.use("/estoque/est05", est05)

api.listen(process.env.PORT || 3000, () => {
  console.log('API RUN!');
});
