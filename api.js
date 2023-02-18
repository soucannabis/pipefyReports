const reader = require('xlsx')
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.get('/', async (req, res) => {


const file = reader.readFile('pedidos.xlsx')

let data = []

const sheets = file.SheetNames

for(let i = 0; i < sheets.length; i++)
{
const temp = reader.utils.sheet_to_json(
		file.Sheets[file.SheetNames[i]])
temp.forEach((res) => {
	data.push(res)
})
}

// Printing data
console.log(data)

return data

})

app.listen(process.env.PORT || 3000, () => {
    console.log('API RUN!');
  });
  