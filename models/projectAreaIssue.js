const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const ProjectAreaIssue = connection.define('ProjectAreaIssue', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    description: Sequelize.TEXT,
    status: Sequelize.STRING
}, {
    timestamps: false
});

module.exports = ProjectAreaIssue;