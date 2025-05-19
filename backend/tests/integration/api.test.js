const request = require('supertest');
const app = require('../../src/app');
const mongoose = require('mongoose');

describe('Subscription Delivery API Integration Tests', () => {
    beforeAll(async () => {
        // Connect to the test database
        await mongoose.connect(process.env.TEST_DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        // Disconnect from the database
        await mongoose.disconnect();
    });

    describe('User Routes', () => {
        it('should create a new user', async () => {
            const response = await request(app)
                .post('/api/users')
                .send({ name: 'John Doe', email: 'john@example.com' });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('user');
        });

        it('should retrieve a user by ID', async () => {
            const response = await request(app).get('/api/users/1');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('user');
        });
    });

    describe('Subscription Routes', () => {
        it('should create a new subscription', async () => {
            const response = await request(app)
                .post('/api/subscriptions')
                .send({ userId: '1', plan: 'monthly' });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('subscription');
        });

        it('should retrieve subscriptions for a user', async () => {
            const response = await request(app).get('/api/subscriptions/user/1');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('subscriptions');
        });
    });

    describe('Delivery Routes', () => {
        it('should schedule a new delivery', async () => {
            const response = await request(app)
                .post('/api/deliveries')
                .send({ subscriptionId: '1', deliveryDate: '2023-10-01' });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('delivery');
        });

        it('should reschedule a delivery', async () => {
            const response = await request(app)
                .put('/api/deliveries/1/reschedule')
                .send({ newDeliveryDate: '2023-10-15' });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('delivery');
        });
    });
});