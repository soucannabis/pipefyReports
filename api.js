const reader = require('xlsx')
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));



app.get('/', async (req, res) => {

const file = `${__dirname}/relatorio.xlsx`;
res.download(file)


})

app.listen(process.env.PORT || 3000, () => {
    console.log('API RUN!');
  });
  