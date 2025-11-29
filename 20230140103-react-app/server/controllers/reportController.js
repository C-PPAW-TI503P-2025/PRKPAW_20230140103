// controllers/reportController.js
const { Presensi } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama } = req.query;

    // bikin range hari ini (laporan harian)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const where = {
      checkIn: {
        [Op.between]: [startOfDay, endOfDay],
      },
    };

    // filter nama kalau ada query ?nama=...
    if (nama) {
      where.nama = {
        [Op.like]: `%${nama}%`,
      };
    }

    const records = await Presensi.findAll({
      where,
      order: [["checkIn", "DESC"]],
    });

    res.json({
      reportDate: new Date().toLocaleDateString("id-ID"),
      data: records,
    });
  } catch (error) {
    console.error("ERROR getDailyReport:", error);
    res.status(500).json({
      message: "Gagal mengambil laporan",
      error: error.message,
    });
  }
};
