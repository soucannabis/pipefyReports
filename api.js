const reader = require('xlsx')
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
const https = require('https'); // or 'https' for https:// URLs
const fs = require('fs');

const file = fs.createWriteStream("relatorio.xlsx");
https.get("https://app-storage-service.pipefy.com/v1/signed/orgs/0ec0a956-43d7-4305-8b15-0faa0a513586/reports/94176a02-c43c-472f-93bb-f5c150149b8c/pedidos_concluidos_18-02-2023.xlsx?expires_on=1676734416&signature=tSk6op7xtjYXUTASMnqCsyUBTBu7nRcjVtfodR9%2BOYI%3D", function(response) {
   response.pipe(file);

   // after download completed close filestream
   file.on("finish", () => {
       file.close();
       console.log("Download Completed");
   });
});



app.get('/', async (req, res) => {

const file = `${__dirname}/relatorio.xlsx`;
res.download(file)


})

app.listen(process.env.PORT || 3000, () => {
    console.log('API RUN!');
  });
  