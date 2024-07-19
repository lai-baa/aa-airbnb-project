'use strict';

const { ReviewImage } = require('../models');
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
   await ReviewImage.bulkCreate([
    // {
    //   reviewId: 1,
    //   url: 'https://example.com/image1.jpg'
    // },
    // {
    //   reviewId: 2,
    //   url: 'https://example.com/image2.jpg'
    // },
    // {
    //   reviewId: 3,
    //   url: 'https://example.com/image3.jpg'
    // },
    // {
    //   reviewId: 4,
    //   url: 'https://example.com/image4.jpg'
    // },
    // {
    //   reviewId: 5,
    //   url: 'https://example.com/image5.jpg'
    // }
  ], { validate: true });
},

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});

  }
};
