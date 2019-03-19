const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const port = 3001;
const botConfigFilename = './bot/config.json';

const app = express();

app.use(cors());
app.use(bodyParser.json());

const jsonFileToObj = inputFileName => {
  let jsonDb = {};
  if (fs.existsSync(inputFileName)) {
    jsonDb = JSON.parse(fs.readFileSync(inputFileName));
  }

  return jsonDb;
};

app.get('/', (req, res) => res.json(jsonFileToObj(botConfigFilename)));

app.post('/', (req, res) => {
  fs.writeFileSync(botConfigFilename, JSON.stringify(req.body, null, 2));
  res.json({ result: 'Ok' });
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));
