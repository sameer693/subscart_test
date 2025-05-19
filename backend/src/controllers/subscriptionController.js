const SubscriptionService = require('../services/subscriptionService');

exports.createSubscription = async (req, res) => {
    try {
        const subscriptionData = req.body;
        const newSubscription = await SubscriptionService.createSubscription(subscriptionData);
        res.status(201).json(newSubscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        const subscriptionData = req.body;
        const updatedSubscription = await SubscriptionService.updateSubscription(id, subscriptionData);
        res.status(200).json(updatedSubscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        const subscription = await SubscriptionService.getSubscription(id);
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.status(200).json(subscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};