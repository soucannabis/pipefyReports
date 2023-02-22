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

api.get('/novo-relatorio', async (req, res) => {
 
  var idReport = ''
  var urlReport = ''

 optionsPipe = {
      method: 'POST',
      headers: {
          'accept': 'application/json',
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VyIjp7ImlkIjozMDE5OTU2ODEsImVtYWlsIjoiZmVsaXBlcm9zZW5la0BnbWFpbC5jb20iLCJhcHBsaWNhdGlvbiI6MzAwMTQyMDIwfX0.JugAF92MqbUV_fLVKEcF5jUI3G4G2hlAmLeBJ-dEfsEIlX3gdKO1IfbQRUYvHvAk569vuD9K_zCrKylY6R6agw',
          'Content-Type': 'application/json'
      },
      data: JSON.stringify({
          query: 'mutation { exportPipeReport(input: {pipeId: 301587647, pipeReportId: 300369040}) { pipeReportExport { id fileURL report { id } } } }'

      })
  };

  await axios('https://api.pipefy.com/graphql', optionsPipe)
    .then(function (response) {
      idReport = response.data.data.exportPipeReport.pipeReportExport.id
      return idReport
    })
    .catch(function (error) {
      console.log(error);
    });
    console.log(idReport)


    optionsPipe = {
      method: 'POST',
      headers: {
          'accept': 'application/json',
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VyIjp7ImlkIjozMDE5OTU2ODEsImVtYWlsIjoiZmVsaXBlcm9zZW5la0BnbWFpbC5jb20iLCJhcHBsaWNhdGlvbiI6MzAwMTQyMDIwfX0.JugAF92MqbUV_fLVKEcF5jUI3G4G2hlAmLeBJ-dEfsEIlX3gdKO1IfbQRUYvHvAk569vuD9K_zCrKylY6R6agw',
          'Content-Type': 'application/json'
      },
      data: JSON.stringify({
          query: '{ pipeReportExport(id: '+idReport+') { fileURL state startedAt requestedBy { id } } }'

      })
  };

  await axios('https://api.pipefy.com/graphql', optionsPipe)
    .then(function (response) {

      urlReport = response.data.data.pipeReportExport.fileURL

      file = fs.createWriteStream("relatorio.xlsx");
   
      https.get(urlReport,  function(response) {
        response.pipe(file);

        file.on("finish", () => {
            file.close();
            console.log("Download Completed");
        });
      });
    })
    .catch(function (error) {
      console.log(error);
    });

  res.send("<h4>Novo relatório emitido! Atualize a fonte de dados: <a href='"+urlReport+"'>Baixar o arquivo original</a></h4></br>"+urlReport)
})

  api.get('/', async (req, res) => {

    const xlsx = `${__dirname}/relatorio.xlsx`;
    res.download(xlsx)

  })

  api.listen(process.env.PORT || 3000, () => {
      console.log('API RUN!');
    });
  