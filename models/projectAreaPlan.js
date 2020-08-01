const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const ProjectAreaPlan = connection.define('ProjectAreaPlan', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    planUrl: Sequelize.STRING
},{
    timestamps: false
});

module.exports = ProjectAreaPlan;