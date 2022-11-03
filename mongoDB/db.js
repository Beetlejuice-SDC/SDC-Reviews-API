require("dotenv").config();
const mongoose = require("mongoose")

mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`);

const reviewSchema = new mongoose.Schema(
  {
    review_id: String,
    user_name: String,
    product_id: Number,
    rating: Number,
    summary: String,
    recommend: Boolean,
    response: Boolean,
    body: String,
    reviewer_name: String,
    helpfulness: Number,
    photos: [{
      id: Number,
      url: String
    }],
    characteristics: [{
      id: Number,
      value: Number
    }]
  },
  { timestamps: true }
);

const reviewsSchema = new mongoose.Schema({
  product_id: Number,
  reviews: [reviewSchema]
});

const reviewMetaSchema = new mongoose.Schema({
  product_id: Number,
  rating: {
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number
  },
  recommended: {
    true: Number,
    false: Number
  },
  characteristics: {
    id: Number,
    value: Number
  }
});

const Reviews = new mongoose.model('Reviews', reviewsSchema);
const Review = new mongoose.model('Review', reviewSchema);
const ReviewMeta = new mongoose.model('ReviewMeta', reviewMetaSchema);

module.exports.Reviews = Reviews;
module.exports.Review = Review;
module.exports.ReviewMeta = ReviewMeta;