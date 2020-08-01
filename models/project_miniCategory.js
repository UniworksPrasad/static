const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const Project_MiniCategory = connection.define('Project_MiniCategory', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
},{
    timestamps: false
});

module.exports = Project_MiniCategory;