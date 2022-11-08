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
      array_remove(array_agg(
        CASE
          WHEN reviews_photos.id IS NOT NULL THEN
            jsonb_build_object(
              'id', reviews_photos.id,
              'url', reviews_photos.url
            )
        END
      ), null) AS photos
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
      console.log('here')
      cb(err)
    } else {
      const review_id = result.rows[0].id

      const reviews_photosQuery =
        `INSERT INTO reviews_photos ( review_id, url ) VALUES ${photos.map((url) => (`(${review_id}, '${url}')`)).join(', ')}`;

      const characteristics_reviewsQuery =
        `INSERT INTO characteristic_reviews ( review_id, characteristic_id, value ) VALUES ${
          Object.keys(characteristics).map((key) => `(${review_id}, ${key}, ${characteristics[key]})`).join(', ')
        }`;

      db.query(characteristics_reviewsQuery, (err, result) => {
        if (err) {
          cb('error uploading characteristics reviews')
        } else {
          if (photos.length > 0) {
            db.query(reviews_photosQuery, (err, result) => {
              if (err) {
                cb(err)
              } else {
                cb(null, result)
              }
            })
          } else {
            cb(null, result)
          }
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
  let query = `SELECT json_build_object(
    'product_id', ${product_id},
    'ratings', (SELECT json_build_object(
      1, (SELECT COUNT(rating) FROM reviews WHERE product_id = ${product_id} AND rating = 1),
      2, (SELECT COUNT(rating) FROM reviews WHERE product_id = ${product_id} AND rating = 2),
      3, (SELECT COUNT(rating) FROM reviews WHERE product_id = ${product_id} AND rating = 3),
      4, (SELECT COUNT(rating) FROM reviews WHERE product_id = ${product_id} AND rating = 4),
      5, (SELECT COUNT(rating) FROM reviews WHERE product_id = ${product_id} AND rating = 5)
    )),
    'recommended', (SELECT json_build_object(
      false, (SELECT COUNT(recommend) FROM reviews WHERE product_id = ${product_id} AND recommend = 'f'),
      true, (SELECT COUNT(recommend) FROM reviews WHERE product_id = ${product_id} AND recommend = 't')
    )),
    'characteristics', (SELECT json_object_agg(
      name, (json_build_object(
        'id', id,
        'value', (select AVG(value) from characteristic_reviews where characteristic_id = characteristics.id)
      ))
    )FROM characteristics WHERE product_id = ${product_id})
  )`

  db.query(query, (err, res)=>{
    if (err) {
      console.log(err)
    } else {
      cb(null, res.rows[0].json_build_object)
    }
  })

//   const result = {
//     product_id: product_id,
//     ratings: {},
//     recommended: {},
//     characteristics: {}
//   }
//   db.query(`SELECT recommend, COUNT(*) FROM reviews WHERE product_id = ${product_id} GROUP by recommend`)
//     .then((res) => res.rows.forEach((obj) => {result.recommended[obj.recommend] = Number(obj.count)}))
//     .then(() => {
//       db.query(`SELECT rating, COUNT(*) FROM reviews WHERE product_id = ${product_id} GROUP BY rating`)
//         .then((res) => res.rows.forEach((obj) => {result.ratings[obj.rating] = Number(obj.count)}))
//         .then(() => {
//           db.query(`SELECT id, name FROM characteristics WHERE product_id = ${product_id}`)
//             .then(res => {
//               Promise.all(res.rows.map((row) => (
//                 db.query(`SELECT AVG(value) FROM characteristic_reviews WHERE characteristic_id = ${row.id}`)
//                   .then((res) => result.characteristics[row.name] = {id: row.id, value: res.rows[0].avg})
//               )))
//                 .then(() => cb(null, result))
//                 .catch(err => cb(err));
//             })
//             .catch(err => {cb(err)});
//         })
//     })
 }
}
