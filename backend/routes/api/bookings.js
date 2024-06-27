const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, Booking, User, SpotImage, sequelize } = require('../../db/models');

const moment = require('moment');

const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

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
              attributes: ['url'],
              where: { preview: true },
              required: false
            }
          ],
          attributes: [
            'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price',
            [sequelize.col('SpotImages.url'), 'previewImage']
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
        previewImage: booking.Spot.SpotImages[0] ? booking.Spot.SpotImages[0].url : null
      },
      userId: booking.userId,
      startDate: moment(booking.startDate).format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment(booking.endDate).format('YYYY-MM-DD HH:mm:ss'),
      createdAt: moment(booking.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment(booking.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    }));

    res.status(200).json({ Bookings: bookingsData });
  } catch (error) {
    next(error);
  }
});

// Edit a Booking


// Delete a Booking

module.exports = router;