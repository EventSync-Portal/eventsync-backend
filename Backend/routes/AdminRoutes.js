// AdminRoutes.js
const express = require('express');
const router = express.Router();
const AdminController = require('../Controller/AdminController');

// Route to get all events
router.get('/events', AdminController.getAllEvents);

// Route to get event counts (approved, declined, pending, and total)
router.get('/events/counts', AdminController.getEventCounts);

module.exports = router;
