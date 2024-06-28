const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, Booking, User, SpotImage, sequelize } = require('../../db/models');

const { Op } = require('sequelize');

const moment = require('moment');

const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Validation middleware
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

// Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res, next) => {
  const { user } = req;

  try {
    const bookings = await Booking.findAll({
      where: {
        userId: user.id
      },
      include: [
        {
          model: Spot,
          include: [
            {
              model: SpotImage,
              attributes: [],
              where: { preview: true },
              required: false
            }
          ],
          attributes: [
            'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price',
            [sequelize.literal('(SELECT url FROM "SpotImages" WHERE "SpotImages"."spotId" = "Spot"."id" AND "SpotImages"."preview" = true LIMIT 1)'), 'previewImage']
          ]
        }
      ]
    });

    const bookingsData = bookings.map(booking => ({
      id: booking.id,
      spotId: booking.spotId,
      Spot: {
        id: booking.Spot.id,
        ownerId: booking.Spot.ownerId,
        address: booking.Spot.address,
        city: booking.Spot.city,
        state: booking.Spot.state,
        country: booking.Spot.country,
        lat: booking.Spot.lat,
        lng: booking.Spot.lng,
        name: booking.Spot.name,
        price: booking.Spot.price,
        previewImage: booking.Spot.dataValues.previewImage || null
      },
      userId: booking.userId,
      startDate: moment(booking.startDate).format('YYYY-MM-DD'),
      endDate: moment(booking.endDate).format('YYYY-MM-DD'),
      createdAt: moment(booking.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment(booking.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    }));

    res.status(200).json({ Bookings: bookingsData });
  } catch (error) {
    next(error);
  }
});

// Edit a Booking
router.put('/:bookingId', requireAuth, validateBooking, async (req, res, next) => {
  const { bookingId } = req.params;
  const { startDate, endDate } = req.body;
  const { user } = req;

  try {
    // Find the booking by id
    const booking = await Booking.findByPk(bookingId);

    // If booking is not found, return a 404 error
    if (!booking) {
      const err = new Error("Booking couldn't be found");
      err.status = 404;
      err.errors = { message: "Booking couldn't be found" };
      return next(err);
    }

    // Check if the current user is the owner of the booking
    if (booking.userId !== user.id) {
      const err = new Error("Forbidden");
      err.status = 403;
      err.errors = { message: "You do not have permission to edit this booking" };
      return next(err);
    }

    // Check if the booking is already past the end date
    if (moment(booking.endDate).isBefore(moment(), 'day')) {
      const err = new Error("Past bookings can't be modified");
      err.status = 403;
      err.errors = { message: "Past bookings can't be modified" };
      return next(err);
    }

    // Check for booking conflicts
    const existingBookings = await Booking.findAll({
      where: {
        spotId: booking.spotId,
        id: { [Op.ne]: bookingId }, // Exclude the current booking
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [startDate, endDate]
            }
          },
          {
            endDate: {
              [Op.between]: [startDate, endDate]
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

    // Update the booking
    booking.startDate = startDate;
    booking.endDate = endDate;

    await booking.save();

    // Format dates
    const formattedBooking = {
      id: booking.id,
      spotId: booking.spotId,
      userId: booking.userId,
      startDate: moment(booking.startDate).format('YYYY-MM-DD'),
      endDate: moment(booking.endDate).format('YYYY-MM-DD'),
      createdAt: moment(booking.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment(booking.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    };

    res.status(200).json(formattedBooking);
  } catch (error) {
    next(error);
  }
});

// Delete a Booking
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
  const { bookingId } = req.params;
  const { user } = req;

  try {
    // Find the booking by id
    const booking = await Booking.findByPk(bookingId, {
      include: [{ model: Spot }]
    });

    // If booking is not found, return a 404 error
    if (!booking) {
      const err = new Error("Booking couldn't be found");
      err.status = 404;
      err.errors = { message: "Booking couldn't be found" };
      return next(err);
    }

    // Check if the booking has already started
    if (moment(booking.startDate).isBefore(moment(), 'day')) {
      const err = new Error("Bookings that have been started can't be deleted");
      err.status = 403;
      err.errors = { message: "Bookings that have been started can't be deleted" };
      return next(err);
    }

    // Check if the current user is the owner of the booking or the owner of the spot
    if (booking.userId !== user.id && booking.Spot.ownerId !== user.id) {
      const err = new Error("Forbidden");
      err.status = 403;
      err.errors = { message: "You do not have permission to delete this booking" };
      return next(err);
    }

    // Delete the booking
    await booking.destroy();

    // Return success message
    res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    next(error);
  }
});


module.exports = router;