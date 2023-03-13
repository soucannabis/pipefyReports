const axios = require('axios')
const express = require("express")
const router = express.Router()
const fs = require('fs');
const https = require('https');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser')
const multer = require('multer');

router.get('/', async (req, res) => {   
  res.download(__dirname+"/uploads/pipe-liga/relatorio.xlsx")
})

const storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null, "routes/uploads/pipe-liga")
  },
  filename: function(req,file,cb){
    cb(null, "relatorio.xlsx")
  }
})

const upload = multer({storage}); 

router.post('/upload', upload.single('arquivo'), (req, res) => {
  res.send('Arquivo enviado com sucesso!');
});

router.get('/upload', async (req, res) => {    
  res.send('<form action="upload" method="POST" enctype="multipart/form-data"><input type="file" name="arquivo"><button type="submit">Enviar</button></form>')
})

module.exports = router