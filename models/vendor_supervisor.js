const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const Vendor_Supervisor = connection.define('Vendor_Supervisor', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    status: Sequelize.STRING
}, {
    timestamps: false
});

module.exports = Vendor_Supervisor;