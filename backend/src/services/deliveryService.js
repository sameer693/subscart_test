// filepath: subscription-delivery-api/subscription-delivery-api/src/services/deliveryService.js

const Delivery = require('../models/Delivery');
const { calculateNextDeliveryDate } = require('../utils/dateUtils');

class DeliveryService {
    async scheduleDelivery(subscriptionId, deliveryDate) {
        const delivery = new Delivery({ subscriptionId, deliveryDate, status: 'scheduled' });
        return await delivery.save();
    }

    async rescheduleDelivery(deliveryId, days) {
        const delivery = await Delivery.findById(deliveryId);
        if (!delivery) {
            throw new Error('Delivery not found');
        }
        delivery.deliveryDate = calculateNextDeliveryDate(delivery.deliveryDate, days);
        return await delivery.save();
    }

    async getDeliveryById(deliveryId) {
        return await Delivery.findById(deliveryId);
    }

    async getDeliveriesBySubscriptionId(subscriptionId) {
        return await Delivery.find({ subscriptionId });
    }
}

module.exports = new DeliveryService();