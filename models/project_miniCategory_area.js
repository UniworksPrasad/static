const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const Project_MiniCategory_Area = connection.define('Project_MiniCategory_Area', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    description: Sequelize.STRING,
    startDate: Sequelize.DATEONLY,
    endDate: Sequelize.DATEONLY,
    address: Sequelize.STRING,
    zip: Sequelize.INTEGER,
    lat: Sequelize.STRING,
    long: Sequelize.STRING,
    totalArea: Sequelize.DOUBLE,
    areaCompleted: Sequelize.DOUBLE,
    budget: Sequelize.DOUBLE,
    skilled: Sequelize.INTEGER,
    semiSkilled: Sequelize.INTEGER,
    unSkilled: Sequelize.INTEGER,
    status: Sequelize.STRING
},{
    timestamps: false
});

module.exports = Project_MiniCategory_Area;