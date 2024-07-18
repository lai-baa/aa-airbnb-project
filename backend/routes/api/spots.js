const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, Booking, SpotImage, ReviewImage, User, sequelize } = require('../../db/models');
const { Op } = require("sequelize");
const { query } = require('express-validator');

const moment = require('moment');

const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Validation middleware
const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
  check('lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be within -90 and 90'),
  check('lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be within -180 and 180'),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('price')
    .isFloat({ gt: 0 })
    .withMessage('Price per day must be a positive number'),
    handleValidationErrors
];

const validateSpotUpdate = [
    check('address')
      .exists({ checkFalsy: true })
      .withMessage('Street address is required'),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
    check('country')
      .exists({ checkFalsy: true })
      .withMessage('Country is required'),
    check('lat')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude must be within -90 and 90'),
    check('lng')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude must be within -180 and 180'),
    check('name')
      .exists({ checkFalsy: true })
      .isLength({ max: 50 })
      .withMessage('Name must be less than 50 characters'),
    check('description')
      .exists({ checkFalsy: true })
      .withMessage('Description is required'),
    check('price')
      .isFloat({ gt: 0 })
      .withMessage('Price per day must be a positive number'),
    handleValidationErrors
];

const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

const validateBooking = [
  check('startDate')
    .exists({ checkFalsy: true })
    .isISO8601()
    .withMessage('startDate must be a valid date')
    .custom(value => {
      if (moment(value).isBefore(moment(), 'day')) {
        throw new Error('startDate cannot be in the past');
      }
      return true;
    }),
  check('endDate')
    .exists({ checkFalsy: true })
    .isISO8601()
    .withMessage('endDate must be a valid date')
    .custom((value, { req }) => {
      if (moment(value).isSameOrBefore(moment(req.body.startDate), 'day')) {
        throw new Error('endDate cannot be on or before startDate');
      }
      return true;
    }),
    handleValidationErrors
];

// Validation middleware for query parameters
const validateQueryParams = [
  query('page').optional().isInt({ min: 1, max: 10 }).withMessage('Page must be between 1 and 10'),
  query('size').optional().isInt({ min: 1, max: 20 }).withMessage('Size must be between 1 and 20'),
  query('minLat').optional().isFloat().withMessage('Minimum latitude is invalid'),
  query('maxLat').optional().isFloat().withMessage('Maximum latitude is invalid'),
  query('minLng').optional().isFloat().withMessage('Minimum longitude is invalid'),
  query('maxLng').optional().isFloat().withMessage('Maximum longitude is invalid'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Minimum price must be greater than or equal to 0'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Maximum price must be greater than or equal to 0'),
  handleValidationErrors
];

// Get all spots with query filters
router.get('/', validateQueryParams, async (req, res, next) => {
  let {
    page = 1,
    size = 20,
    minLat,
    maxLat,
    minLng,
    maxLng,
    minPrice,
    maxPrice
  } = req.query;

  page = parseInt(page);
  size = parseInt(size);

  const limit = size;
  const offset = (page - 1) * size;

  const where = {};

  if (minLat) where.lat = { [Op.gte]: parseFloat(minLat) };
  if (maxLat) where.lat = { ...where.lat, [Op.lte]: parseFloat(maxLat) };
  if (minLng) where.lng = { [Op.gte]: parseFloat(minLng) };
  if (maxLng) where.lng = { ...where.lng, [Op.lte]: parseFloat(maxLng) };
  if (minPrice) where.price = { [Op.gte]: parseFloat(minPrice) };
  if (maxPrice) where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };

  try {
    // console.log("Fetching spots with filters:", { limit, offset, where });

    const spots = await Spot.findAll({
      where,
      limit,
      offset,
      include: [
        {
          model: Review,
          attributes: [],
          duplicating: false,
        },
        {
          model: SpotImage,
          attributes: ['url'],
          where: { preview: true },
          required: false,
          duplicating: false,
        }
      ],
      attributes: {
        include: [
          [
            sequelize.fn('AVG', sequelize.col('Reviews.stars')),
            'avgRating'
          ],
          [
            sequelize.col('SpotImages.url'),
            'previewImage'
          ]
        ]
      },
      group: ['Spot.id', 'SpotImages.id']
    });

    const spotsData = spots.map(spot => {
      const avgRating = spot.get('avgRating');
      const formattedAvgRating = avgRating ? Number(parseFloat(avgRating).toFixed(1)) : "No ratings yet";

      return {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: parseFloat(spot.lat),
        lng: parseFloat(spot.lng),
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: moment(spot.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment(spot.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
        avgRating: formattedAvgRating,
        previewImage: spot.get('previewImage')
      };
    });

    res.status(200).json({ Spots: spotsData, page, size });
  } catch (error) {
    console.error("Error fetching spots:", error);
    next(error);
  }
});

// Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res, next) => {
  const { user } = req;

  try {
    const spots = await Spot.findAll({
      where: {
        ownerId: user.id
      },
      include: [
        {
          model: Review,
          attributes: []
        },
        {
          model: SpotImage,
          attributes: ['url'],
          where: { preview: true },
          required: false
        }
      ],
      attributes: {
        include: [
          [
            sequelize.fn('AVG', sequelize.col('Reviews.stars')),
            'avgRating'
          ],
          [
            sequelize.col('SpotImages.url'),
            'previewImage'
          ]
        ]
      },
      group: ['Spot.id', 'SpotImages.id']
    });

    const spotsData = spots.map(spot => ({
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: parseFloat(spot.lat),
      lng: parseFloat(spot.lng),
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: moment(spot.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment(spot.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
      avgRating: spot.get('avgRating') ? Number(parseFloat(spot.get('avgRating')).toFixed(1)) : "No ratings yet",
      previewImage: spot.get('previewImage')
    }));

    res.status(200).json({ Spots: spotsData });
  } catch (error) {
    console.error("Error fetching spots:", error);
    next(error);
  }
});

// Get details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
  const { spotId } = req.params;

  try {
    // Find the spot by id
    const spot = await Spot.findByPk(spotId, {
      include: [
        {
          model: SpotImage,
          attributes: ['id', 'url', 'preview']
        },
        {
          model: Review,
          attributes: []
        },
        {
          model: User,
          as: 'Owner',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      attributes: {
        include: [
          [
            sequelize.fn('COUNT', sequelize.col('Reviews.id')),
            'numReviews'
          ],
          [
            sequelize.fn('AVG', sequelize.col('Reviews.stars')),
            'avgRating'
          ]
        ]
      },
      group: ['Spot.id', 'SpotImages.id', 'Owner.id']
    });

    // If spot is not found, return a 404 error
    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      err.errors = { message: "Spot couldn't be found" };
      return next(err);
    }

    // Format the response
    const spotData = {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: parseFloat(spot.lat),
      lng: parseFloat(spot.lng),
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: moment(spot.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment(spot.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
      numReviews: spot.get('numReviews'),
      avgStarRating: spot.get('avgStarRating') ? Number(parseFloat(spot.get('avgStarRating')).toFixed(1)) : "No ratings yet",
      SpotImages: spot.SpotImages,
      Owner: spot.Owner
    };

    res.status(200).json(spotData);
  } catch (error) {
    next(error);
  }
});

// Create a Spot
router.post("/", requireAuth, validateSpot, async (req, res) => {
  const { user } = req;
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  const newSpot = await user.createSpot({
    ownerId: user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });
  newSpot.dataValues.createdAt = moment(newSpot.createdAt).format('YYYY-MM-DD HH:mm:ss');
  newSpot.dataValues.updatedAt = moment(newSpot.createdAt).format('YYYY-MM-DD HH:mm:ss');

  return res.status(201).json(newSpot);
});

// Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;
  const { user } = req;

  try {
    // Find the spot by id
    const spot = await Spot.findByPk(spotId);

    // If spot is not found, return a 404 error
    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      err.errors = { message: "Spot couldn't be found" };
      return next(err);
    }

    // Check if the current user is the owner of the spot
    if (spot.ownerId !== user.id) {
      const err = new Error("Forbidden");
      err.status = 403;
      err.errors = { message: "You do not have permission to add an image to this spot" };
      return next(err);
    }

    // Create the new spot image
    const newSpotImage = await SpotImage.create({
      spotId,
      url,
      preview
    });

    // Return the new spot image without createdAt and updatedAt
    res.status(200).json({
      id: newSpotImage.id,
      url: newSpotImage.url,
      preview: newSpotImage.preview
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:spotId', requireAuth, validateSpotUpdate, async (req, res, next) => {
  const { spotId } = req.params;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const { user } = req;

  try {
    // Find the spot by id
    const spot = await Spot.findByPk(spotId);

    // If spot is not found, return a 404 error
    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      err.errors = { message: "Spot couldn't be found" };
      return next(err);
    }

    // Check if the current user is the owner of the spot
    if (spot.ownerId !== user.id) {
      const err = new Error("Forbidden");
      err.status = 403;
      err.errors = { message: "You do not have permission to edit this spot" };
      return next(err);
    }

    // Update the spot
    spot.address = address;
    spot.city = city;
    spot.state = state;
    spot.country = country;
    spot.lat = lat;
    spot.lng = lng;
    spot.name = name;
    spot.description = description;
    spot.price = price;

    await spot.save();

    // Format createdAt and updatedAt
    const formattedSpot = {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: parseFloat(spot.lat),
      lng: parseFloat(spot.lng),
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: moment(spot.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment(spot.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    };

    // Return the updated spot
    res.status(200).json(formattedSpot);
  } catch (error) {
    next(error);
  }
});

// Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const { user } = req;

  try {
    // Find the spot by id
    const spot = await Spot.findByPk(spotId);

    // If spot is not found, return a 404 error
    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      err.errors = { message: "Spot couldn't be found" };
      return next(err);
    }

    // Check if the current user is the owner of the spot
    if (spot.ownerId !== user.id) {
      const err = new Error("Forbidden");
      err.status = 403;
      err.errors = { message: "You do not have permission to delete this spot" };
      return next(err);
    }

    // Delete all related spot images
    await SpotImage.destroy({ where: { spotId } });

    // Delete all related reviews
    await Review.destroy({ where: { spotId } });

    // Delete all related bookings
    await Booking.destroy({ where: { spotId } });

    // Delete the spot
    await spot.destroy();

    // Return success message
    res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    next(error);
  }
});

// Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res, next) => {
  const { spotId } = req.params;

  try {
    // Check if the spot exists
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      err.errors = { message: "Spot couldn't be found" };
      return next(err);
    }

    // Find all reviews for the spot
    const reviews = await Review.findAll({
      where: {
        spotId
      },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
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
      ReviewImages: review.ReviewImages
    }));

    res.status(200).json({ Reviews: reviewsData });
  } catch (error) {
    next(error);
  }
});


// Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
  const { spotId } = req.params;
  const { review, stars } = req.body;
  const { user } = req;

  try {
    // Check if the spot exists
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      err.errors = { message: "Spot couldn't be found" };
      return next(err);
    }

    // Check if the user has already reviewed the spot
    const existingReview = await Review.findOne({
      where: {
        spotId,
        userId: user.id
      }
    });
    if (existingReview) {
      const err = new Error("User already has a review for this spot");
      err.status = 500;
      err.errors = { message: "User already has a review for this spot" };
      return next(err);
    }

    // Create the review
    const newReview = await Review.create({
      spotId,
      userId: user.id,
      review,
      stars
    });

    // Format createdAt and updatedAt
    const formattedReview = {
      id: newReview.id,
      userId: newReview.userId,
      spotId: newReview.spotId,
      review: newReview.review,
      stars: newReview.stars,
      createdAt: moment(newReview.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment(newReview.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    };

    res.status(201).json(formattedReview);
  } catch (error) {
    next(error);
  }
});

// Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const { user } = req;

  try {
    // Check if the spot exists
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      err.errors = { message: "Spot couldn't be found" };
      return next(err);
    }

    // Fetch bookings based on user role (owner or not)
    let bookings;
    if (spot.ownerId === user.id) {
      bookings = await Booking.findAll({
        where: { spotId },
        include: [{ model: User, attributes: ['id', 'firstName', 'lastName'] }]
      });
    } else {
      bookings = await Booking.findAll({
        where: { spotId },
        attributes: ['spotId', 'startDate', 'endDate']
      });
    }

    // Format the dates
    const formattedBookings = bookings.map(booking => {
      const bookingData = {
        spotId: booking.spotId,
        startDate: moment(booking.startDate).format('YYYY-MM-DD'),
        endDate: moment(booking.endDate).format('YYYY-MM-DD')
      };
      if (spot.ownerId === user.id) {
        bookingData.User = {
          id: booking.User.id,
          firstName: booking.User.firstName,
          lastName: booking.User.lastName
        };
        bookingData.id = booking.id;
        bookingData.userId = booking.userId;
        bookingData.createdAt = moment(booking.createdAt).format('YYYY-MM-DD HH:mm:ss');
        bookingData.updatedAt = moment(booking.updatedAt).format('YYYY-MM-DD HH:mm:ss');
      }
      return bookingData;
    });

    res.status(200).json({ Bookings: formattedBookings });
  } catch (error) {
    next(error);
  }
});


// Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, validateBooking, async (req, res, next) => {
  const { spotId } = req.params;
  const { startDate, endDate } = req.body;
  const { user } = req;

  try {
    // Check if the spot exists
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      err.errors = { message: "Spot couldn't be found" };
      return next(err);
    }

    // Check if the spot belongs to the current user
    if (spot.ownerId === user.id) {
      const err = new Error("Forbidden");
      err.status = 403;
      err.errors = { message: "You cannot book your own spot" };
      return next(err);
    }

    // Check for booking conflicts
    const existingBookings = await Booking.findAll({
      where: {
        spotId,
        [Op.or]: [
          {
            startDate: {
              [Op.lte]: endDate,
              [Op.gte]: startDate
            }
          },
          {
            endDate: {
              [Op.lte]: endDate,
              [Op.gte]: startDate
            }
          },
          {
            startDate: {
              [Op.lte]: startDate
            },
            endDate: {
              [Op.gte]: endDate
            }
          }
        ]
      }
    });

    if (existingBookings.length > 0) {
      const err = new Error("Sorry, this spot is already booked for the specified dates");
      err.status = 403;
      err.errors = {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking"
      };
      return next(err);
    }

    // Create the booking
    const newBooking = await Booking.create({
      spotId,
      userId: user.id,
      startDate,
      endDate
    });

    // Format dates
    const formattedBooking = {
      id: newBooking.id,
      spotId: newBooking.spotId,
      userId: newBooking.userId,
      startDate: moment(newBooking.startDate).format('YYYY-MM-DD'),
      endDate: moment(newBooking.endDate).format('YYYY-MM-DD'),
      createdAt: moment(newBooking.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment(newBooking.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    };

    res.status(200).json(formattedBooking);
  } catch (error) {
    next(error);
  }
});

module.exports = router;