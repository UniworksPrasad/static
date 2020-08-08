const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const Tool = connection.define('Tool', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    toolName: Sequelize.STRING,
    imageUrl: Sequelize.STRING,
    description: Sequelize.TEXT
}, {
    timestamps: false
});

module.exports = Tool;