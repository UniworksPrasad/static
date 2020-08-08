const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const ProjectIssue = connection.define('ProjectIssue', {
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

module.exports = ProjectIssue;