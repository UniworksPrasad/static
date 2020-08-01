const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const Milestone = connection.define('Milestone', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    milestoneName: Sequelize.STRING
},{
    timestamps: false
});

module.exports = Milestone;

//Carpentry