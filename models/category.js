const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const Category = connection.define('Category', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    categoryName: Sequelize.STRING
},{
    timestamps: false
});

module.exports = Category;

//Carpentry