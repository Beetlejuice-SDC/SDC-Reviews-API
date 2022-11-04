const models = require('./models.js')

module.exports = {
  getReviewsMeta: function(req, res) {
    console.log('get meta: ', req.query)
  },
  getReviews: function(req, res) {
    console.log('get reviews: ', req.query)
    const queries = {
      page: req.query.page || 1,
      count: req.query.count || 5,
      sort: req.query.sort || 'date',
      product_id: req.query.product_id
    }
    models.getReviews(queries, (err, data) => {
      if (err) {
        console.log(err)
        res.status(400).send(err)
      } else {
        res.send(data)
      }
    })
  },
  postReview: function(req, res) {
    console.log('post review: ', req.body)
  },
  updateHelpful: function(req, res) {
    console.log('update helpful: ', req.params)
  },
  reportReview: function(req, res) {
    console.log('report review: ', req.params)
  }
}