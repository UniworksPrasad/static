const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const Order = connection.define('Order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    bookingId: Sequelize.STRING,
    description: Sequelize.STRING,
    date: Sequelize.DATEONLY,
    address: Sequelize.STRING,
    zip: Sequelize.INTEGER,
    lat: Sequelize.STRING,
    long: Sequelize.STRING
}, {
    timestamps: false
});

module.exports = Order;