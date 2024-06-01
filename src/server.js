const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const dbPath = path.join(__dirname, 'db.json');

app.use(bodyParser.json());

app.get('/articles', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading database');
    }
    res.send(JSON.parse(data));
  });
});

app.put('/articles', (req, res) => {
  fs.writeFile(dbPath, JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      return res.status(500).send('Error saving data');
    }
    res.send({ message: 'Data saved successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
