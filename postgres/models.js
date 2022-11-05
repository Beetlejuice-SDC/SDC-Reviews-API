const db = require("./db");

module.exports = {
  getReviews: function(query, cb){
    const { product_id, page, count, sort } = query;
    const queryStr =
    `SELECT
      reviews.id AS review_id,
      reviews.rating,
      reviews.summary,
      reviews.recommend,
      reviews.response,
      reviews.body,
      reviews.date,
      reviews.reviewer_name,
      reviews.helpfulness,
      json_agg(
        json_strip_nulls(json_build_object(
          'id', reviews_photos.id,
          'url', reviews_photos.url
        ))
      ) AS photos
    FROM reviews
    LEFT JOIN reviews_photos ON reviews_photos.review_id = reviews.id
    WHERE product_id=${product_id} AND reviews.reported=false
    GROUP BY reviews.id
    ORDER BY ${sort} DESC
    LIMIT ${count} OFFSET ${(page - 1) * count}`;

    db.query(queryStr, (err, result) => {
      if (err) {
        cb(err);
      } else {
        cb(null, {
          product: product_id,
          page: count * (page - 1),
          count: count,
          results: result.rows
        });
      }
    });
  },
 postReview: function(reqBody, cb) {
  const { product_id, rating, summary, body, recommend, name, email, photos, characteristics } = reqBody;
  const reviewsStr =
  `INSERT INTO reviews(
    product_id, rating, summary, body, recommend, reviewer_name, reviewer_email
  ) VALUES (
    ${product_id}, ${rating}, '${summary}', '${body}', ${recommend}, '${name}', '${email}')
  RETURNING id`

  db.query(reviewsStr, (err, result) => {
    if (err) {
      cb(err)
    } else {
      const review_id = result.rows[0].id

      const reviews_photosQuery =
        `INSERT INTO reviews_photos ( review_id, url ) VALUES ${photos.map((url) => (`(${review_id}, '${url}')`)).join(', ')}`;

      const characteristics_reviewsQuery =
        `INSERT INTO characteristic_reviews ( review_id, characteristic_id, value ) VALUES ${
          Object.keys(characteristics).map((key) => `(${review_id}, ${key}, ${characteristics[key]})`).join(', ')
        }`;

      console.log(reviews_photosQuery)
      console.log(characteristics_reviewsQuery)

      db.query(reviews_photosQuery, (err, result) => {
        if (err) {
          cb(err)
        } else {
          db.query(characteristics_reviewsQuery, (err, result) => {
            if (err) {
              cb('error uploading characteristics reviews')
            } else {
              cb(null, result)
            }
          })
        }
      })
    }
  })
 },
 updateHelpful: function(review_id, cb) {
  const query = `UPDATE reviews SET helpfulness = helpfulness+1 WHERE id = ${review_id}`
  db.query(query, (err, result) => {
    if (err) {
      cb(err)
    } else {
      cb(null, result)
    }
  })
 },
 reportReview: function(review_id, cb) {
  const query = `UPDATE reviews SET reported = true WHERE id = ${review_id}`
  db.query(query, (err, result) => {
    if (err) {
      cb(err)
    } else {
      cb(null, result)
    }
  })
 },
 getReviewsMeta: function(product_id, cb) {
  const result = {
    product_id: product_id,
    ratings: {},
    recommended: {},
    characteristics: {}
  }
  db.query(`SELECT recommend, COUNT(*) FROM reviews WHERE product_id = ${product_id} GROUP by recommend`)
    .then((res) => res.rows.forEach((obj) => {result.recommended[obj.recommend] = Number(obj.count)}))
  db.query(`SELECT rating, COUNT(*) FROM reviews WHERE product_id = ${product_id} GROUP BY rating`)
    .then((res) => res.rows.forEach((obj) => {result.ratings[obj.rating] = Number(obj.count)}))
    .then(() => {
      db.query(`SELECT id, name FROM characteristics WHERE product_id = ${product_id}`)
        .then(res => {
          Promise.all(res.rows.map((row) => (
            db.query(`SELECT AVG(value) FROM characteristic_reviews WHERE characteristic_id = ${row.id}`)
              .then((res) => result.characteristics[row.name] = {id: row.id, value: res.rows[0].avg})
          )))
            .then(() => cb(null, result))
            .catch(err => cb(err));
        })
        .catch(err => {cb(err)});
    })
 }
}