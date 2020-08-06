const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const User = connection.define('User', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: true,
        primaryKey: true
    },
    userName: {
        // needs to be unique
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
    },
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
    zip: Sequelize.INTEGER,
    lat: Sequelize.STRING,
    long: Sequelize.STRING,
    agreement: Sequelize.TEXT,
    status: Sequelize.STRING,
    accountNum: Sequelize.STRING,
    IFSC: Sequelize.STRING,
    accountHolder: Sequelize.STRING,
    PAN: Sequelize.STRING,
    aadharLink: Sequelize.STRING,
    GSTIN: Sequelize.STRING
},{
    timestamps: false
});

module.exports = User;