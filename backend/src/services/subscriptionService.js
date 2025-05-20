const Subscription = require('../models/Subscription');
const Delivery = require('../models/Delivery');
const User = require('../models/User');
const { createDeliveriesForSubscription } = require('./deliveryService');
class SubscriptionService {
    async createSubscription(userEmail, plan, deliveryDays, deliveryTime, startDate, initialMeals, deliveryAddress) {
        // Find the user by email to get their ID
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            throw new Error(`User with email ${userEmail} not found.`);
        }
        const userId = user._id;

        const subscriptionData = {
            userId,
            plan,
            status: 'active', // Default status
            deliveryDays,
            deliveryTime,
            startDate,
            // Add other relevant fields from your Subscription model
        };

        const subscription = new Subscription(subscriptionData);
        const savedSubscription = await subscription.save();

        // Optionally, create initial delivery records here if needed
        // For example, if 'initialMeals' and 'deliveryAddress' are for the first delivery
        if (initialMeals && initialMeals.length > 0 && deliveryAddress) {
            const firstDeliveryDate = new Date(startDate); // Or calculate based on deliveryDays
            // This is a simplified example; you'll need a robust way to calculate the first delivery date
            // based on startDate and deliveryDays.
            // For now, let's assume startDate is the first delivery date if it aligns with a deliveryDay.

            // A more robust approach for next delivery date calculation is needed here,
            // similar to what was discussed for the deliveryService.
            // For simplicity, we'll create one for the startDate if it's a delivery day.

            const dayOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][firstDeliveryDate.getDay()];
            if (deliveryDays.includes(dayOfWeek)) {
                await Delivery.create({
                    subscriptionId: savedSubscription._id,
                    userId: userId,
                    deliveryDate: firstDeliveryDate,
                    deliveryTime: deliveryTime,
                    status: 'scheduled',
                    items: initialMeals,
                    // deliveryAddress: deliveryAddress // Assuming Delivery model has address
                });
            }
        }
        createDeliveriesForSubscription(savedSubscription._id);
        return savedSubscription;
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
        console.log('Rescheduling delivery for subscription:', subscriptionId);
        console.log('New delivery date:', newDeliveryDate);
        const delivery = await Delivery.findOne({ subscriptionId });
        if (delivery) {
            delivery.deliveryDate = newDeliveryDate;
            return await delivery.save();
        }
        throw new Error('Delivery not found for this subscription');
    }
}

module.exports = new SubscriptionService();