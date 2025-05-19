const Subscription = require('../../src/models/Subscription');
const SubscriptionService = require('../../src/services/subscriptionService');

describe('Subscription Service', () => {
    let subscription;

    beforeEach(() => {
        subscription = new Subscription({
            userId: '12345',
            plan: 'monthly',
            status: 'active'
        });
    });

    test('should create a subscription', async () => {
        const result = await SubscriptionService.createSubscription(subscription);
        expect(result).toHaveProperty('userId', '12345');
        expect(result).toHaveProperty('plan', 'monthly');
        expect(result).toHaveProperty('status', 'active');
    });

    test('should update a subscription', async () => {
        subscription.plan = 'yearly';
        const result = await SubscriptionService.updateSubscription(subscription);
        expect(result).toHaveProperty('plan', 'yearly');
    });

    test('should retrieve a subscription', async () => {
        await SubscriptionService.createSubscription(subscription);
        const result = await SubscriptionService.getSubscription(subscription.userId);
        expect(result).toHaveProperty('userId', '12345');
    });

    test('should handle subscription not found', async () => {
        const result = await SubscriptionService.getSubscription('nonexistentId');
        expect(result).toBeNull();
    });
});