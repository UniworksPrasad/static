const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const BOM = connection.define('BOM', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    BOMUrl: Sequelize.STRING
}, {
    timestamps: false
});

module.exports = BOM;