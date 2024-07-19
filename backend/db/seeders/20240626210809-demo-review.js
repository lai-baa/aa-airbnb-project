'use strict';

const { Review } = require('../models');
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
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 3,
        review: 'Great place, very clean and cozy.',
        stars: 5
      },
      {
        spotId: 1,
        userId: 2,
        review: 'Amazing views and comfortable stay.',
        stars: 4
      },
      {
        spotId: 3,
        userId: 4,
        review: 'Loved the modern decor and location.',
        stars: 5
      },
      {
        spotId: 4,
        userId: 4,
        review: 'Spacious and quiet neighborhood.',
        stars: 4
      },
      {
        spotId: 5,
        userId: 5,
        review: 'Beautiful villa right on the beach.',
        stars: 5
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
