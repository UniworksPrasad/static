const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const Project_Area_Mini_Mile = connection.define('Project_Area_Mini_Mile', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    status: Sequelize.STRING,
    imageUrl: Sequelize.STRING
},{
    timestamps: false
});

module.exports = Project_Area_Mini_Mile;