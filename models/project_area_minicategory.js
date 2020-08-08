const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const Project_Area_Minicategory = connection.define('Project_Area_Minicategory', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    status: Sequelize.STRING
},{
    timestamps: false
});

module.exports = Project_Area_Minicategory;