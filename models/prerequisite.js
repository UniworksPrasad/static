const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const Prerequisite = connection.define('Prerequisite', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    description: Sequelize.TEXT
},{
    timestamps: false
});

module.exports = Prerequisite;