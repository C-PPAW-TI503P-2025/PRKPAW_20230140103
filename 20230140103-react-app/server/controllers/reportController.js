// controllers/reportController.js
const presensiRecords = require('../data/presensiData');

const getDailyReport = (req, res) => {
  res.json({
    reportDate: new Date().toLocaleDateString(),
    data: presensiRecords,
  });
};

module.exports = { getDailyReport };
