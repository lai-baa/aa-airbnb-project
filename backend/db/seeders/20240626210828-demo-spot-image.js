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
        url: '/images/cozy-apt-1.jpeg',
        preview: true
      },
      // {
      //   spotId: 1,
      //   url: '/images/cozy-apt-2.jpeg',
      //   preview: false
      // },
      // {
      //   spotId: 1,
      //   url: '/images/cozy-apt-3.jpeg',
      //   preview: false
      // },
      // {
      //   spotId: 1,
      //   url: '/images/cozy-apt-4.jpeg',
      //   preview: false
      // },
      // {
      //   spotId: 1,
      //   url: '/images/cozy-apt-5.jpeg',
      //   preview: false
      // },
      // {
      //   spotId: 2,
      //   url: 'backend/images/lux-condo-1.jpeg',
      //   preview: true
      // },
      {
        spotId: 2,
        url: '/images/lux-condo-1.jpeg',
        preview: true
      },
      // {
      //   spotId: 2,
      //   url: '/images/lux-condo-3.jpeg',
      //   preview: false
      // },
      // {
      //   spotId: 2,
      //   url: '/images/lux-condo-4.jpeg',
      //   preview: false
      // },
      // {
      //   spotId: 2,
      //   url: '/images/lux-condo-5.jpeg',
      //   preview: false
      // },
      {
        spotId: 3,
        url: '/images/modern-loft-1.jpeg',
        preview: true
      },
      // {
      //   spotId: 3,
      //   url: '/images/modern-loft-2.jpeg',
      //   preview: false
      // },
      // {
      //   spotId: 3,
      //   url: '/images/modern-loft-3.jpeg',
      //   preview: false
      // },
      // {
      //   spotId: 3,
      //   url: '/images/modern-loft-4.jpeg',
      //   preview: false
      // },
      // {
      //   spotId: 3,
      //   url: '/images/modern-loft-5.jpeg',
      //   preview: false
      // },
      {
        spotId: 4,
        url: '/images/spacious-house-1.jpeg',
        preview: true
      },
      // {
      //   spotId: 4,
      //   url: '/images/spacious-house-2.jpeg',
      //   preview: false
      // },
      // {
      //   spotId: 4,
      //   url: '/images/spacious-house-3.jpeg',
      //   preview: false
      // },
      // {
      //   spotId: 4,
      //   url: '/images/spacious-house-4.jpeg',
      //   preview: false
      // },
      // {
      //   spotId: 4,
      //   url: '/images/spacious-house-5.jpeg',
      //   preview: false
      // },
      {
        spotId: 5,
        url: '/images/beachfront-1.jpeg',
        preview: true
      },
      // {
      //   spotId: 5,
      //   url: '/images/beachfront-2.jpeg',
      //   preview: false
      // },
      // {
      //   spotId: 5,
      //   url: '/images/beachfront-3.jpeg',
      //   preview: false
      // },
      // {
      //   spotId: 5,
      //   url: '/images/beachfront-4.jpeg',
      //   preview: false
      // },
      // {
      //   spotId: 5,
      //   url: '/images/beachfront-5.jpeg',
      //   preview: false
      // },
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
