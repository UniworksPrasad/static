const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const Tutorial = connection.define('Tutorial', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    topicName: Sequelize.STRING,
    videoLink: Sequelize.STRING,
    description: Sequelize.TEXT,
    thumbnail: Sequelize.STRING
},{
    timestamps: false
});

module.exports = Tutorial;