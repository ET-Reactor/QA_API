const express = require("express")
const router = require('./routes.js')
const path = require("path");
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router)

const PORT = 3000;

app.listen(PORT);
console.log(`server listening at http://localhost:${PORT}`)

