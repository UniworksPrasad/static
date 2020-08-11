const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const ConstructVend_Category = connection.define('ConstructVend_Category', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
}, {
    timestamps: false
});

module.exports = ConstructVend_Category;