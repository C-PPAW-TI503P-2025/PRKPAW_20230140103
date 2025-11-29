const express = require('express');
const router = express.Router();

const reportController = require('../controllers/reportController');
const authenticateToken = require('../middleware/authenticateToken');
const { addUserData, isAdmin } = require('../middleware/permissionMiddleware');

// PAKAI SATU ROUTE AJA, JANGAN DOUBEL
router.get(
  '/daily',
  authenticateToken, // ambil user dari JWT
  addUserData,       // kalau gak ada JWT bisa fallback dari header (optional)
  isAdmin,           // cek role admin
  reportController.getDailyReport
);

module.exports = router;
