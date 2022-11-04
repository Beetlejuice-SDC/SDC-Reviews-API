require("dotenv").config();
const express = require("express");
const router = require('./routes.js');

const app = express();
app.use(express.json());

app.use('/reviews', router)

app.listen(process.env.PORT)
console.log(`Listening at http://localhost:${process.env.PORT}`);