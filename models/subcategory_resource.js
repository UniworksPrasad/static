const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const SubCategory_Resource = connection.define('SubCategory_Resource', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
}, {
    timestamps: false
});

module.exports = SubCategory_Resource;