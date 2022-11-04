const db = require("./db");

module.exports = {
  getReviews: function(query, cb){
    var { product_id, page, count, sort } = query;
    var response = {
      product: product_id,
      page: page || 0,
      count: count || 5
    };
    response.results = db.query(`SELECT reviews.id AS review_id, reviews.rating, reviews.summary, reviews.recommend, reviews.response, reviews.body, to_timestamp(reviews.date/1000) as date, reviews.reviewer_name, reviews.helpfulness,
    json_agg(json_build_object('id', reviews_photos.id, 'url', reviews_photos.url)) AS photos FROM reviews LEFT JOIN reviews_photos ON reviews_photos.review_id = reviews.id WHERE product_id=${product_id} AND reviews.reported=false GROUP BY reviews.id LIMIT 50`, (err, result) => {
      if (err) {
        console.log('review ', err);
      } else {
        cb(null, {
          product: response.product,
          page: response.page,
          count: response.count,
          results: result.rows
        });
      }
    });
  }
}