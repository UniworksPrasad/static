const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const MiniCategory_Material = connection.define('MiniCategory_Material', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
},{
    timestamps: false
});

module.exports = MiniCategory_Material;