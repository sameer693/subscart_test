const SubscriptionService = require('../services/subscriptionService');

exports.createSubscription = async (req, res) => {
    try {
        // Assuming the user's email is available, e.g., from an authenticated session or request body
        // For this example, let's assume it's in req.body.userEmail
        // And other subscription details are also in req.body
        const { userEmail, plan, deliveryDays, deliveryTime, startDate, initialMeals, deliveryAddress } = req.body;

        if (!userEmail || !plan || !deliveryDays || !deliveryTime || !startDate) {
            return res.status(400).json({ message: "Missing required subscription details (userEmail, plan, deliveryDays, deliveryTime, startDate)." });
        }

        const newSubscription = await SubscriptionService.createSubscription(
            userEmail,
            plan,
            deliveryDays,
            deliveryTime,
            startDate,
            initialMeals, // Optional
            deliveryAddress // Optional
        );
        res.status(201).json(newSubscription);
    } catch (error) {
        // Differentiate between user not found and other errors
        if (error.message.includes("not found")) {
            return res.status(404).json({ message: error.message });
        }
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