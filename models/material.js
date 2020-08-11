const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const Material = connection.define('Material', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    materialName: Sequelize.STRING,
    description: Sequelize.STRING,
    imageUrl: Sequelize.STRING,
    uom: Sequelize.STRING
}, {
    timestamps: false
});

module.exports = Material;