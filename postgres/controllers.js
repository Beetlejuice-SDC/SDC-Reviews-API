const models = require('./models.js')

module.exports = {
  getReviewsMeta: function(req, res) {
    console.log('get meta: ', req.query)
    models.getReviewsMeta(req.query.product_id, (err, data) => {
      if (err) {
        console.log('getReviewsMeta err: ', err)
        res.status(400).send(err)
      } else {
        res.send(data)
      }
    })
  },
  getReviews: function(req, res) {
    const queries = {
      page: req.query.page || 1,
      count: req.query.count || 5,
      sort: req.query.sort || 'date',
      product_id: req.query.product_id
    }
    models.getReviews(queries, (err, data) => {
      if (err) {
        console.log('getReviews err: ', err)
        res.status(400).send(err)
      } else {
        res.send(data)
      }
    })
  },
  postReview: function(req, res) {
    console.log('post review: ', req.body)
    models.postReview(req.body, (err, data) => {
      if (err) {
        console.log('postReview err: ', err)
        res.status(400).send(err)
      } else {
        res.send(data)
      }
    })
  },
  updateHelpful: function(req, res) {
    console.log('update helpful: ', req.params)
    models.updateHelpful(req.params.review_id, (err, data) => {
      if (err) {
        console.log('updateHelpful err: ', err)
        res.status(400).send(err)
      } else {
        res.send(data)
      }
    })
  },
  reportReview: function(req, res) {
    console.log('report review: ', req.params)
    models.reportReview(req.params.review_id, (err, data) => {
      if (err) {
        console.log('reportReview err: ', err)
        res.status(400).send(err)
      } else {
        res.send(data)
      }
    })
  }
}