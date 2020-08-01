const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const Resource = connection.define('Resource', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING
},{
    timestamps: false
});

module.exports = Resource;

//Carpentry