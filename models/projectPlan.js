const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const ProjectPlan = connection.define('ProjectPlan', {
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

module.exports = ProjectPlan;