const controllers = require('./controllers.js');
const router = require('express').Router();

router.get('/meta', controllers.getReviewsMeta)
router.get('/', controllers.getReviews)

router.post('/', controllers.postReview)

router.put('/:review_id/report', controllers.reportReview)
router.put('/:review_id/helpful', controllers.updateHelpful)

module.exports = router;

