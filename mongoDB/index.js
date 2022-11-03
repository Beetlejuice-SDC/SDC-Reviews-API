require("dotenv").config();
const express = require("express");

const db = require("./db");

const app = express();
app.use(express.json());

app.listen(process.env.PORT)
console.log(`Listening at http://localhost:${process.env.PORT}`);

// db.Review.create({
//   review_id: '1',
//   user_name: 'jaden',
//   product_id: 12345,
//   rating: 5,
//   summary: 'hello',
//   recommend: true,
//   response: false,
//   body: 'recommend this product',
//   reviewer_name: 'jaden',
//   helpfulness: 10,
//   photos: [{
//     id: 1,
//     url: 'www.www.com'
//   }],
//   characteristics: [{
//     id: 123,
//     value: 1
//   }]
// })

// db.Review.find({}, (err, res) => {
//   if (err) {
//     console.log(err)
//   } else {
//     console.log(res)
//   }
// })