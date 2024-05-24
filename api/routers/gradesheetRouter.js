const express = require('express');
const gradesheetsController = require('../controllers/gradesheetsController');

const router = express.Router();

router.get('/', gradesheetsController.getGradesheets);
router.get('/:rollNo', gradesheetsController.getGradesheetByRoll);

module.exports = router;
