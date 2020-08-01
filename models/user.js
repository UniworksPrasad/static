const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const User = connection.define('User', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userName: Sequelize.STRING,
    role: Sequelize.STRING,
    zip: Sequelize.INTEGER,
    agreement: Sequelize.TEXT,
    contact: Sequelize.STRING
},{
    timestamps: false
});

module.exports = User;