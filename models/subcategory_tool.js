const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const SubCategory_Tool = connection.define('SubCategory_Tool', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
},{
    timestamps: false
});

module.exports = SubCategory_Tool;