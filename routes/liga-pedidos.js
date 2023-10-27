const express = require("express")
const router = express.Router()
const multer = require('multer');
const createReport = require('./createReport')
const path = require('path');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const archiveName = 'relatorio-liga-pedidos.xlsx'

router.get('/novo-relatorio', async (req, res) => {
  const report = createReport(302420297, 300427414,archiveName)
  await delay(10000)
  res.send("<h4>Relatório criado com sucessso!</h4>").status(200)

});

router.get('/', async (req, res) => {
  res.download(archiveName)
})

var dirname = __dirname.toString()
dirname = dirname.split("\\routes")
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dirname[0])
  },
  filename: function (req, file, cb) {
    cb(null, archiveName)
  }
})
const upload = multer({ storage });

router.post('/upload', upload.single('arquivo'), (req, res) => {
  res.send('Arquivo enviado com sucesso!');
});

router.get('/upload', async (req, res) => {
  res.send('<form action="upload" method="POST" enctype="multipart/form-data"><input type="file" name="arquivo"><button type="submit">Enviar</button></form>')
})

module.exports = router