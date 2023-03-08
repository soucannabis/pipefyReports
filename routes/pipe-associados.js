const axios = require('axios')
const express = require("express")
const router = express.Router()
const fs = require('fs');
const https = require('https');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser')

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
  var ano = new Date().getFullYear()
  var mes = new Date().getMonth()
  mes = mes+1
  var dia = new Date().getDate()
  if(mes <= 9){mes = "0"+mes}
  if(dia <= 9){dia = "0"+dia}

  var date = dia + "-" + mes + "-" + ano
  const xlsx = "routes/novo_relatório_"+date+".xlsx";
   res.download(xlsx)

})

router.get('/database-report', async (req, res) => {    
  const xlsx = `relatorio-associados.xlsx`;
   res.download(xlsx)

})

router.get('/pipe-report', async (req, res) => {  

  res.status(200)
 
  async function app(){
    try{
      process.setMaxListeners(Infinity)
        let options = {
            defaultViewport: {
              width: 1366,
              height: 768,
            },
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            ignoreDefaultArgs: ['--disable-extensions'],
            headless: true,
          };

          console.log("Abrindo Browser")
        
        let browser = await puppeteer.launch(options);
        let page = await browser.newPage();
  
        const client = await page.target().createCDPSession()
        await client.send('Page.setDownloadBehavior', {
         behavior: 'allow',
        downloadPath: __dirname,
        })
       
        console.log("Abrindo Pipefy")
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

          console.log("Login OK")
  
          await delay(6000)
  
          await page.goto("https://app.pipefy.com/apollo_databases/301585673")
  
          await delay(10000)
  
          var exportButton = await page.$("button[aria-label='Exportar']");
          await exportButton.click()   
          
          console.log("Baixando relatório")
          
          await delay(10000)
  
          browser.close()

          console.log("Download OK")
          console.log("Browser fechado")

          res.send("Relatório do database exportado com sucesso!")
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