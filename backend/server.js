const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/data', (req, res) => {
  fs.readFile('../data/data_procesada.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send("Error leyendo los datos");
    res.json(JSON.parse(data));
  });
});

app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});
