const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const SubCategory = connection.define('SubCategory', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    subcategoryName: Sequelize.STRING,
    description: Sequelize.TEXT
},{
    timestamps: false
});

module.exports = SubCategory;

//Wooden Partition