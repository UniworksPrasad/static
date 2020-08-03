const Sequelize = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(process.env.SCHEMA, process.env.ROOT, process.env.PASSWORD, {
  host: process.env.HOST,
  dialect: process.env.DIALECT
});

module.exports = sequelize;
global.sequelize = sequelize;