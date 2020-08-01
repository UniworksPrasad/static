const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const Tool = connection.define('Tool', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    toolName: Sequelize.STRING
},{
    timestamps: false
});

module.exports = Tool;

//Carpentry