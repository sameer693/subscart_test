const express = require('express');
const deliveryController = require('../controllers/deliveryController');

const router = express.Router();

// Route to schedule a delivery
router.post('/schedule', deliveryController.scheduleDelivery);

// Route to reschedule a delivery
router.put('/reschedule/:id', deliveryController.rescheduleDelivery);

// Route to get delivery details
router.get('/:id', deliveryController.getDeliveryDetails);

// Route to get all deliveries for a subscription
// router.get('/subscription/:subscriptionId', deliveryController.getDeliveriesBySubscription);

module.exports = router;