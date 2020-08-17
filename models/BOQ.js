const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const BOQ = connection.define('BOQ', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    BOQUrl: Sequelize.STRING
}, {
    timestamps: false
});

module.exports = BOQ;