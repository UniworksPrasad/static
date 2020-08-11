const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const Project_User = connection.define('Project_User', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
}, {
    timestamps: false
});

module.exports = Project_User;