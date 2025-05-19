const Delivery = require('../models/Delivery');
const deliveryService = require('../services/deliveryService');

exports.scheduleDelivery = async (req, res) => {
    try {
        const { subscriptionId, deliveryDate } = req.body;
        const delivery = await deliveryService.scheduleDelivery(subscriptionId, deliveryDate);
        res.status(201).json({ message: 'Delivery scheduled successfully', delivery });
    } catch (error) {
        res.status(500).json({ message: 'Error scheduling delivery', error: error.message });
    }
};

exports.rescheduleDelivery = async (req, res) => {
    try {
        const { deliveryId, newDeliveryDate } = req.body;
        const updatedDelivery = await deliveryService.rescheduleDelivery(deliveryId, newDeliveryDate);
        res.status(200).json({ message: 'Delivery rescheduled successfully', updatedDelivery });
    } catch (error) {
        res.status(500).json({ message: 'Error rescheduling delivery', error: error.message });
    }
};

exports.getDeliveryDetails = async (req, res) => {
    try {
        const { deliveryId } = req.params;
        const delivery = await deliveryService.getDeliveryDetails(deliveryId);
        res.status(200).json(delivery);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving delivery details', error: error.message });
    }
};