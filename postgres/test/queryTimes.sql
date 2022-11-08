\c sdc_reviews;
\t
\timing

-- get /reviews/meta?product_id=1000011
SELECT json_build_object(
  'product_id', 1000011,
  'ratings', (SELECT json_build_object(
    1, (SELECT COUNT(rating) FROM reviews WHERE product_id = 1000011 AND rating = 1),
    2, (SELECT COUNT(rating) FROM reviews WHERE product_id = 1000011 AND rating = 2),
    3, (SELECT COUNT(rating) FROM reviews WHERE product_id = 1000011 AND rating = 3),
    4, (SELECT COUNT(rating) FROM reviews WHERE product_id = 1000011 AND rating = 4),
    5, (SELECT COUNT(rating) FROM reviews WHERE product_id = 1000011 AND rating = 5)
  )),
  'recommended', (SELECT json_build_object(
    false, (SELECT COUNT(recommend) FROM reviews WHERE product_id = 1000011 AND recommend = 'f'),
    true, (SELECT COUNT(recommend) FROM reviews WHERE product_id = 1000011 AND recommend = 't')
  )),
  'characteristics', (SELECT json_object_agg(
    name, (json_build_object(
      'id', id,
      'value', (select AVG(value) from characteristic_reviews where characteristic_id = characteristics.id)
    ))
  )FROM characteristics WHERE product_id = 1000011)
);

-- get /reviews/?product_id=2
SELECT
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
WHERE product_id=2 AND reviews.reported=false
GROUP BY reviews.id
ORDER BY helpfulness DESC
LIMIT 100 OFFSET 0

\timing
\T