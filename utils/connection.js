const Sequelize = require('sequelize');
const sequelize = new Sequelize('new_schema', 'root', 'Choice@123', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
global.sequelize = sequelize;