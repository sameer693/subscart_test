const Subscription = require('../models/Subscription');
const Delivery = require('../models/Delivery');

class SubscriptionService {
    async createSubscription(userId, plan) {
        const subscription = new Subscription({ userId, plan, status: 'active' });
        return await subscription.save();
    }

    async getSubscriptionById(subscriptionId) {
        return await Subscription.findById(subscriptionId);
    }

    async updateSubscription(subscriptionId, updates) {
        return await Subscription.findByIdAndUpdate(subscriptionId, updates, { new: true });
    }

    async cancelSubscription(subscriptionId) {
        return await Subscription.findByIdAndUpdate(subscriptionId, { status: 'canceled' }, { new: true });
    }

    async getActiveSubscriptions(userId) {
        return await Subscription.find({ userId, status: 'active' });
    }

    async rescheduleDelivery(subscriptionId, newDeliveryDate) {
        const delivery = await Delivery.findOne({ subscriptionId });
        if (delivery) {
            delivery.deliveryDate = newDeliveryDate;
            return await delivery.save();
        }
        throw new Error('Delivery not found for this subscription');
    }
}

module.exports = new SubscriptionService();