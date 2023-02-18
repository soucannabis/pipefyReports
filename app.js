const https = require('https'); // or 'https' for https:// URLs
const fs = require('fs');

optionsPipe = {
    method: 'POST',
    headers: {
        'accept': 'application/json',
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VyIjp7ImlkIjozMDE5OTU2ODEsImVtYWlsIjoiZmVsaXBlcm9zZW5la0BnbWFpbC5jb20iLCJhcHBsaWNhdGlvbiI6MzAwMTQyMDIwfX0.JugAF92MqbUV_fLVKEcF5jUI3G4G2hlAmLeBJ-dEfsEIlX3gdKO1IfbQRUYvHvAk569vuD9K_zCrKylY6R6agw',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        query: 'mutation { exportPipeReport(input: {pipeId: 301587647, pipeReportId: 300369040}) { pipeReportExport { id fileURL report { id } } } }'

    })
};

https.post('https://api.pipefy.com/graphql', optionsPipe)
.then(res => res.json())
.then(json => {
    console.log(json)
 })
.catch(err => console.log(err))

const file = fs.createWriteStream("relatorio.xlsx");
https.get("https://app-storage-service.pipefy.com/v1/signed/orgs/0ec0a956-43d7-4305-8b15-0faa0a513586/reports/94176a02-c43c-472f-93bb-f5c150149b8c/pedidos_concluidos_18-02-2023.xlsx?expires_on=1676729981&signature=X%2B%2Fk%2FZHQ4ZudIW5nVOFXiGSECbvUcPl6cZltWoGn%2BpU%3D", function(response) {
   response.pipe(file);

   // after download completed close filestream
   file.on("finish", () => {
       file.close();
       console.log("Download Completed");
   });
});