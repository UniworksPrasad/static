const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const ProjectAreaIssueComment = connection.define('ProjectAreaIssueComment', {
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

module.exports = ProjectAreaIssueComment;