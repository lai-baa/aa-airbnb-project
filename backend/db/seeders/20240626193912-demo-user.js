'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName: 'Demo',
        lastName: 'Lition',
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Fake',
        lastName: 'User',
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'User',
        lastName: 'Isfake',
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john.doe@example.com',
        hashedPassword: bcrypt.hashSync('password4') // Corrected to use bcrypt.hashSync
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        username: 'janesmith',
        email: 'jane.smith@example.com',
        hashedPassword: bcrypt.hashSync('password5') // Corrected to use bcrypt.hashSync
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', 'johndoe', 'janesmith'] }
    }, {});
  }
};
