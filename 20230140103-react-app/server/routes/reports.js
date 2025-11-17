const express = require('express');
const router = express.Router();

const reportController = require('../controllers/reportController');
const { addUserData, isAdmin } = require('../middleware/permissionMiddleware');

// JANGAN: router.get('/daily', [addUserData, isAdmin], reportController.getDailyReport);
// PAKAI:
router.get('/daily', addUserData, isAdmin, reportController.getDailyReport);
router.get("/daily", reportController.getDailyReport);


module.exports = router; // <- penting
