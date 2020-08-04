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
    contact: Sequelize.STRING,
    role: Sequelize.STRING,
    emergencyContact: Sequelize.STRING,
    email: Sequelize.STRING,
    state: Sequelize.STRING,
    city: Sequelize.STRING,
    area: Sequelize.STRING,
    street: Sequelize.STRING,
    building: Sequelize.STRING,
    flat: Sequelize.STRING,
    lat: Sequelize.STRING,
    long: Sequelize.STRING,
    agreement: Sequelize.TEXT,
    status: Sequelize.STRING
},{
    timestamps: false
});

module.exports = User;