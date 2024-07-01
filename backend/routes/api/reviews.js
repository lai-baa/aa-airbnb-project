const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, ReviewImage, User, sequelize } = require('../../db/models');

const moment = require('moment');

const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Validation middleware
const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];


// Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res, next) => {
  const { user } = req;

  try {
    const reviews = await Review.findAll({
      where: {
        userId: user.id
      },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Spot,
          attributes: [
            'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price',
            [
              sequelize.literal(`(
                SELECT "url"
                FROM "SpotImages"
                WHERE "SpotImages"."spotId" = "Spot"."id"
                AND "SpotImages"."preview" = true
                LIMIT 1
              )`),
              'previewImage'
            ]
          ]
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url']
        }
      ]
    });

    const reviewsData = reviews.map(review => ({
      id: review.id,
      userId: review.userId,
      spotId: review.spotId,
      review: review.review,
      stars: review.stars,
      createdAt: moment(review.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment(review.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
      User: review.User,
      Spot: {
        id: review.Spot.id,
        ownerId: review.Spot.ownerId,
        address: review.Spot.address,
        city: review.Spot.city,
        state: review.Spot.state,
        country: review.Spot.country,
        lat: parseFloat(review.Spot.lat),
        lng: parseFloat(review.Spot.lng),
        name: review.Spot.name,
        price: review.Spot.price,
        previewImage: review.Spot.dataValues.previewImage
      },
      ReviewImages: review.ReviewImages
    }));

    res.status(200).json({ Reviews: reviewsData });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    next(error);
  }
});

// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
  const { reviewId } = req.params;
  const { url } = req.body;
  const { user } = req;

  try {
    // Find the review by id
    const review = await Review.findByPk(reviewId);

    // If review is not found, return a 404 error
    if (!review) {
      const err = new Error("Review couldn't be found");
      err.status = 404;
      err.errors = { message: "Review couldn't be found" };
      return next(err);
    }

    // Check if the current user is the owner of the review
    if (review.userId !== user.id) {
      const err = new Error("Forbidden");
      err.status = 403;
      err.errors = { message: "You do not have permission to add an image to this review" };
      return next(err);
    }

    // Check if the review already has 10 images
    const imageCount = await ReviewImage.count({
      where: { reviewId }
    });
    if (imageCount >= 10) {
      const err = new Error("Maximum number of images for this resource was reached");
      err.status = 403;
      err.errors = { message: "Maximum number of images for this resource was reached" };
      return next(err);
    }

    // Create the new review image
    const newReviewImage = await ReviewImage.create({
      reviewId,
      url
    });

    // Return the new review image
    res.status(200).json({
      id: newReviewImage.id,
      url: newReviewImage.url
    });
  } catch (error) {
    next(error);
  }
});

// Edit a Review
router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
  const { reviewId } = req.params;
  const { review, stars } = req.body;
  const { user } = req;

  try {
    // Find the review by id
    const existingReview = await Review.findByPk(reviewId);

    // If review is not found, return a 404 error
    if (!existingReview) {
      const err = new Error("Review couldn't be found");
      err.status = 404;
      err.errors = { message: "Review couldn't be found" };
      return next(err);
    }

    // Check if the current user is the owner of the review
    if (existingReview.userId !== user.id) {
      const err = new Error("Forbidden");
      err.status = 403;
      err.errors = { message: "You do not have permission to edit this review" };
      return next(err);
    }

    // Update the review
    existingReview.review = review;
    existingReview.stars = stars;

    await existingReview.save();

    // Format createdAt and updatedAt
    const formattedReview = {
      id: existingReview.id,
      userId: existingReview.userId,
      spotId: existingReview.spotId,
      review: existingReview.review,
      stars: existingReview.stars,
      createdAt: moment(existingReview.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment(existingReview.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    };

    res.status(200).json(formattedReview);
  } catch (error) {
    next(error);
  }
});

// Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
  const { reviewId } = req.params;
  const { user } = req;

  try {
    // Find the review by id
    const review = await Review.findByPk(reviewId);

    // If review is not found, return a 404 error
    if (!review) {
      const err = new Error("Review couldn't be found");
      err.status = 404;
      err.errors = { message: "Review couldn't be found" };
      return next(err);
    }

    // Check if the current user is the owner of the review
    if (review.userId !== user.id) {
      const err = new Error("Forbidden");
      err.status = 403;
      err.errors = { message: "You do not have permission to delete this review" };
      return next(err);
    }

    // Delete all related review images
    await ReviewImage.destroy({ where: { reviewId } });

    // Delete the review
    await review.destroy();

    // Return success message
    res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    next(error);
  }
});


module.exports = router;