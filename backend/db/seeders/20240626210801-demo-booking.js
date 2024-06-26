'use strict';

const { Booking } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: '2024-11-20 19:00:00',
        endDate: '2024-11-20 20:00:00'
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2024-11-21 19:00:00',
        endDate: '2024-11-21 20:00:00'
      },
      {
        spotId: 3,
        userId: 3,
        startDate: '2024-11-22 19:00:00',
        endDate: '2024-11-22 20:00:00'
      },
      {
        spotId: 4,
        userId: 4,
        startDate: '2024-11-23 19:00:00',
        endDate: '2024-11-23 20:00:00'
      },
      {
        spotId: 5,
        userId: 5,
        startDate: '2024-11-24 19:00:00',
        endDate: '2024-11-24 20:00:00'
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});

  }
};
