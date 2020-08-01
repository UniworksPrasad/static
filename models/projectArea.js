const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const Area = connection.define('Area', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    areaName: Sequelize.STRING
},{
    timestamps: false
});

module.exports = Area;

//Carpentry