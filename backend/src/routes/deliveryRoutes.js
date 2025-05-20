const express = require('express');
const deliveryController = require('../controllers/deliveryController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Apply auth middleware to all delivery routes
// router.use(authMiddleware);

// Get deliveries for a specific date
// GET /api/deliveries/by-date?date=2023-05-19
router.get('/by-date', deliveryController.getDeliveriesByDate);

// Get all upcoming deliveries
// GET /api/deliveries/upcoming
router.get('/upcoming', deliveryController.getUpcomingDeliveries);

// Get a specific delivery
// GET /api/deliveries/:id
router.get('/:id', deliveryController.getDelivery);

// Reschedule a delivery
// PUT /api/deliveries/:id/reschedule
router.put('/:id/reschedule', deliveryController.rescheduleDelivery);

// Skip a delivery
// PUT /api/deliveries/:id/skip
router.put('/:id/skip', deliveryController.skipDelivery);

module.exports = router;