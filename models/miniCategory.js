const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const MiniCategory = connection.define('MiniCategory', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    miniCategoryName: Sequelize.STRING,
    description: Sequelize.TEXT,
    predecessor: Sequelize.TEXT,
    successor: Sequelize.TEXT
},{
    timestamps: false
});

module.exports = MiniCategory;

//Partion - Cutting and Preparing