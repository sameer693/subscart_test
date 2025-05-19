const { Delivery } = require('../../src/models/Delivery');

describe('Delivery Model', () => {
    let delivery;

    beforeEach(() => {
        delivery = new Delivery({
            subscriptionId: '12345',
            deliveryDate: new Date(),
            status: 'scheduled'
        });
    });

    test('should create a delivery instance', () => {
        expect(delivery).toBeInstanceOf(Delivery);
        expect(delivery.subscriptionId).toBe('12345');
        expect(delivery.status).toBe('scheduled');
    });

    test('should schedule a delivery', () => {
        const newDate = new Date();
        delivery.schedule(newDate);
        expect(delivery.deliveryDate).toEqual(newDate);
        expect(delivery.status).toBe('scheduled');
    });

    test('should reschedule a delivery', () => {
        const newDate = new Date();
        delivery.reschedule(newDate);
        expect(delivery.deliveryDate).toEqual(newDate);
        expect(delivery.status).toBe('rescheduled');
    });

    test('should throw an error if delivery date is in the past', () => {
        const pastDate = new Date(Date.now() - 86400000); // 1 day in the past
        expect(() => delivery.schedule(pastDate)).toThrow('Delivery date cannot be in the past');
    });
});