require("dotenv").config();
const express = require("express");

const db = require("./db");

const app = express();
app.use(express.json());

app.listen(process.env.PORT)
console.log(`Listening at http://localhost:${process.env.PORT}`);

db.query("SELECT * FROM reviews WHERE ID < 10", (err, res) => {
  if (err) {
    console.log(err)
  } else {
    console.log(res)
  }
})