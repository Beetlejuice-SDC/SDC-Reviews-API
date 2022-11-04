DROP DATABASE IF EXISTS sdc_reviews;
CREATE DATABASE sdc_reviews;

\c sdc_reviews;

CREATE TABLE reviews_meta (
  product_id int UNIQUE
);

CREATE TABLE ratings (
  product_id int REFERENCES reviews_meta(product_id),
  "1" int,
  "2" int,
  "3" int,
  "4" int,
  "5" int
);

CREATE TABLE recommended (
  product_id int REFERENCES reviews_meta(product_id),
  "false" int,
  "true" int
);

CREATE TABLE characteristics (
  id int,
  product_id int,
  name text
);

CREATE TABLE reviews (
  id serial PRIMARY KEY UNIQUE,
  product_id int,
  rating int,
  date bigint,
  summary text,
  body text,
  recommend boolean,
  reported boolean,
  reviewer_name text,
  reviewer_email text,
  response text,
  helpfulness int
);

CREATE TABLE reviews_photos (
  id serial PRIMARY KEY UNIQUE,
  review_id int REFERENCES reviews(id),
  url text
);

CREATE TABLE characteristic_reviews (
  id serial PRIMARY KEY UNIQUE,
  characteristic_id int,
  review_id int REFERENCES reviews(id),
  value int
);

\COPY reviews FROM 'data/reviews.csv' DELIMITER ',' CSV HEADER;

\COPY reviews_photos FROM 'data/reviews_photos.csv' DELIMITER ',' CSV HEADER;

\COPY characteristic_reviews FROM 'data/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;

\COPY characteristics FROM 'data/characteristics.csv' DELIMITER ',' CSV HEADER;

ALTER TABLE reviews ALTER COLUMN date TYPE TIMESTAMP USING to_timestamp(date/1000);

SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM reviews) + 1);
SELECT setval('reviews_photos_id_seq', (SELECT MAX(id) FROM reviews_photos) + 1);
SELECT setval('characteristic_reviews_id_seq', (SELECT MAX(id) FROM characteristic_reviews) + 1);