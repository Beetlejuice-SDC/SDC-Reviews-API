const axios = require('axios');
const dotenv = require('dotenv').config()

const URL = `http://localhost:${process.env.PORT}`;

describe('/reviews/?product_id=2 returns an array of results', () => {
  it('returns data and not null', () => {
    axios.get(`${URL}/reviews/?product_id=2`)
      .then(res => { expect(res.data.length).not.toBe(0) })
      .catch(err => { throw (err); });
  });

  it('is comprised of the following keys', () => {
    axios.get(`${URL}/reviews/?product_id=2`)
      .then(res => {
        let review = res.data.results[0]
        expect(review.review_id).toBeTruthy();
        expect(review.rating).toBeTruthy();
        expect(review.summary).toBeTruthy();
        expect(review.body).toBeTruthy();
        expect(review.date).toBeTruthy();
        expect(review.reported).not.toBeTruthy();
        expect(review.reviewer_name).toBeTruthy();
      })
      .catch(err => { throw (err); });
  });
});

describe('/reviews/meta?product_id=1000011 returns an object containing the reviews meta data', () => {
  it('results returns data and not null', () => {
    axios.get(`${URL}/reviews/meta?product_id=1000011`)
      .then(res => { expect(res.data).not.toBe(0) })
      .catch(err => { throw (err); });
  });

  it('an answer object is comprised of the following keys', () => {
    axios.get(`${URL}/reviews/meta?product_id=1000011`)
      .then(res => {
        let meta = res.data
        expect(meta.product_id).toBeTruthy();
        expect(meta.ratings).toBeTruthy();
        expect(meta.recommended).toBeTruthy();
        expect(meta.characteristics).toBeTruthy();
      })
      .catch(err => { throw (err); });
  });
});