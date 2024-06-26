'use strict';

const { SpotImage } = require('../models');
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
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'https://example.com/spotimage1.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://example.com/spotimage2.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://example.com/spotimage3.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://example.com/spotimage4.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://example.com/spotimage5.jpg',
        preview: true
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
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});

  }
};
