const Sequelize = require('sequelize');
const connection = require('../utils/connection');

const GanttChart = connection.define('GanttChart', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    ganttChartUrl: Sequelize.STRING
}, {
    timestamps: false
});

module.exports = GanttChart;