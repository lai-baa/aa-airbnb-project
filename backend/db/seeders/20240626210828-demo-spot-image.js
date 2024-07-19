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
        url: 'https://www.thespruce.com/thmb/S8tYKXzFhGjDB_X6BHXZyPMhejs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/rsw2320h1548-aafef038b55e4ca5ac3f2ed49337971a.jpeg',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://miro.medium.com/v2/resize:fit:1080/1*e4Lhx1dwJKkwLKlc6dmetQ.jpeg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://as1.ftcdn.net/v2/jpg/04/91/98/04/1000_F_491980487_9AieZjr5OEolpxNAV1lzQiH231PCKu0A.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://www.designstudio210.com/wp-content/uploads/2023/10/Warm-apartment-aesthetic-light-1.jpeg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://www.zurich-hotels-now.com/data/Pics/700x500w/12668/1266862/1266862417/pic-zurich-1.JPEG',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://i.pinimg.com/originals/e9/38/b5/e938b5938abc08cc90eb1fd73009d317.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://i.pinimg.com/originals/83/9e/10/839e10a4851ab9c1a940a68358ed9e17.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://marc-michaels.com/wp-content/uploads/2023/02/luxury-condo-design-bristol.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://t4.ftcdn.net/jpg/05/56/77/09/360_F_556770966_xxkhlRKWTJTB5YtbnDyqeai6ptsksFbF.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://images.squarespace-cdn.com/content/v1/5fb449ff821d2b5bd579a0eb/1614049856225-W4O6RTKQLMGCFV55OC8G/madarin-oriental-living_902.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://as1.ftcdn.net/v2/jpg/01/83/36/76/1000_F_183367641_X23j3PtJxct6IXBtARvnIu4zafJ4OmMl.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://static.vecteezy.com/system/resources/previews/022/845/451/non_2x/new-modern-scandinavian-loft-apartment-generative-ai-photo.JPG',
        preview: false
      },
      {
        spotId: 3,
        url: '/images/modern-loft-3.jpeg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://design-milk.com/images/2016/10/Roundup-Loft-Karakoy-Loft-Ofist.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://aertsen.in/wp-content/uploads/2023/08/What-Is-A-Loft-And-Should-Your-Home-Have-One.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://wallpapers.com/images/featured/big-house-pictures-tdb7ptxj6fgkqkkg.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://www.build-review.com/wp-content/uploads/2021/01/large-house.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://www.probuilder.com/sites/default/files/pb/House-Review-Plan-1-Dahlin-living-min.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://whiskwheelandhome.wordpress.com/wp-content/uploads/2015/04/image-4.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://as2.ftcdn.net/v2/jpg/01/35/44/65/1000_F_135446518_sYPqv6b0VLawbFtId0is7fv9QhpUOZW6.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://t3.ftcdn.net/jpg/05/90/99/70/360_F_590997039_UMB1A15qyV8VccvkgHThXNg5pWzRKe98.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://www.travelandleisure.com/thmb/v6p42p6GOtHWMY0mq1cXAH_FsKg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/santa-rosa-beachfront-home-terrace-VRBOSUMFL0522-4ddb2e3a33044938be3bd4d04428cf9b.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://cdn.trendir.com/wp-content/uploads/old/house-design/airy-beachfront-home-with-contemporary-casual-style-11.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://img.freepik.com/premium-photo/beachfront-villa-with-amazing-sunset-view_605022-16117.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://www.assets.houfy.com/assets/images/properties/f5c9071c53258b2b8e8e8c7a6b92cef1.jpg',
        preview: false
      },
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
