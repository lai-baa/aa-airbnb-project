'use strict';

const { Spot } = require('../models');

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
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        lat: 37.7749,
        lng: -122.4194,
        name: 'Cozy Apartment',
        description: 'A cozy apartment in the heart of the city.',
        price: 100.00
      },
      {
        ownerId: 2,
        address: '456 Elm St',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        lat: 34.0522,
        lng: -118.2437,
        name: 'Luxury Condo',
        description: 'A luxurious condo with stunning views.',
        price: 200.00
      },
      {
        ownerId: 3,
        address: '789 Oak St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        lat: 40.7128,
        lng: -74.0060,
        name: 'Modern Loft',
        description: 'A modern loft in downtown Manhattan.',
        price: 150.00
      },
      {
        ownerId: 4,
        address: '101 Pine St',
        city: 'Chicago',
        state: 'IL',
        country: 'USA',
        lat: 41.8781,
        lng: -87.6298,
        name: 'Spacious House',
        description: 'A spacious house in a quiet neighborhood.',
        price: 120.00
      },
      {
        ownerId: 5,
        address: '202 Maple St',
        city: 'Miami',
        state: 'FL',
        country: 'USA',
        lat: 25.7617,
        lng: -80.1918,
        name: 'Beachfront Villa',
        description: 'A beachfront villa with amazing views.',
        price: 300.00
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
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
