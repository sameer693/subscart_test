const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

// Route to create a new subscription
router.post('/', subscriptionController.createSubscription);

// Route to update a subscription
router.put('/:id', subscriptionController.updateSubscription);

// // Route to delete a subscription
// router.delete('/:id', subscriptionController.deleteSubscription);

// Route to reschedule a subscription
//

module.exports = router;