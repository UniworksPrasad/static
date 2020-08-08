const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const ProjectIssueComment = connection.define('ProjectIssueComment', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    comment: Sequelize.TEXT
}, {
    timestamps: false
});

module.exports = ProjectIssueComment;