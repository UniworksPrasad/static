const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const Order_Detail = connection.define('Order_Detail', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: Sequelize.INTEGER,
    qualityCheckStatus: Sequelize.STRING,
    remarks: Sequelize.STRING,
}, {
    timestamps: false
});

module.exports = Order_Detail;