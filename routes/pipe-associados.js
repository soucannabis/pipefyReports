const axios = require('axios')
const express = require("express")
const router = express.Router()
const fs = require('fs');
const https = require('https');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const puppeteer = require('puppeteer');

router.get('/novo-relatorio', async (req, res) => {
    var idReport = ''
    var urlReport = ''
    var pipeId = 301738151
    var pipeReporId = 300427413
  
   optionsPipe = {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VyIjp7ImlkIjozMDE5OTU2ODEsImVtYWlsIjoiZmVsaXBlcm9zZW5la0BnbWFpbC5jb20iLCJhcHBsaWNhdGlvbiI6MzAwMTQyMDIwfX0.JugAF92MqbUV_fLVKEcF5jUI3G4G2hlAmLeBJ-dEfsEIlX3gdKO1IfbQRUYvHvAk569vuD9K_zCrKylY6R6agw',
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            query: 'mutation { exportPipeReport(input: {pipeId: '+pipeId+', pipeReportId: '+pipeReporId+'}) { pipeReportExport { id fileURL report { id } } } }'
  
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
  
      await delay(10000)
   
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
  
        return urlReport
      })
      .catch(function (error) {
        console.log(error);
      });
  
      file = fs.createWriteStream("relatorio-associados.xlsx");
     
        https.get(urlReport,  function(response) {
          response.pipe(file);
  
          file.on("finish", () => {
              file.close();
              console.log("NOVO RELATÓRIO CRIADO!   - "+idReport+" - "+req.body.hour+":"+req.body.minute+"h");
              console.log(urlReport)
              console.log()
          });
        });
        res.send("<h4>Relatório criado com sucessso!</h4>")
  
        res.status(200).end()
   
});

router.get('/', async (req, res) => {   
  console.log(res.body)
  var archive = "novo_relatorio_"; 
  const xlsx = archive+"xlsx";
   res.download(xlsx)

})

router.get('/database-report', async (req, res) => {    
  const xlsx = `relatorio-associados.xlsx`;
   res.download(xlsx)

})

router.get('/pipe-report', async (req, res) => {    
  async function app(){
    try{
        let options = {
            defaultViewport: {
              width: 1366,
              height: 768,
            },
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            ignoreDefaultArgs: ['--disable-extensions'],
            headless: true,
          };
        
        let browser = await puppeteer.launch(options);
        let page = await browser.newPage();
  
        const client = await page.target().createCDPSession()
        await client.send('Page.setDownloadBehavior', {
         behavior: 'allow',
        downloadPath: __dirname,
        })
        
          await page.goto("https://app.pipefy.com/") 
          await page.waitForSelector(".auth0-lock-submit")   
          await delay(2000) 
          var usernameInput = await page.$("input[name='username']");
          var passwordInput = await page.$("input[name='password']");
  
          await delay(3000)
  
          await usernameInput.click();
          await page.keyboard.type("feliperosenek@gmail.com", {
            delay: 100
          });
          await passwordInput.click();
          await page.keyboard.type("feliperosene2130", {
            delay: 100
          });
  
          var loginButton = await page.$("button[name='submit']");
          await loginButton.click()
  
          await delay(6000)
  
          await page.goto("https://app.pipefy.com/apollo_databases/301585673")
  
          await delay(5000)
  
          var exportButton = await page.$("button[aria-label='Exportar']");
          await exportButton.click()   
          
          await delay(5000)
  
          browser.close()

          res.send("OK")
          res.status(200)
       
    }
    catch (error) {
        console.log(error);
        process.exit(1);
      }
  }
  
  app()

})

module.exports = router