const express = require("express")
const router = require('./routes.js')
const path = require("path");
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router)

app.get('/loaderio-1695083befd222cebe7c479316073e2c', (req, res) => {
  res.send('loaderio-1695083befd222cebe7c479316073e2c');
})

const PORT = 3000;

app.listen(PORT);
console.log(`server listening at http://localhost:${PORT}`)

