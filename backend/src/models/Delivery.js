class Delivery {
    constructor(subscriptionId, deliveryDate, status = 'scheduled') {
        this.subscriptionId = subscriptionId;
        this.deliveryDate = new Date(deliveryDate);
        this.status = status;
    }

    scheduleDelivery(newDeliveryDate) {
        this.deliveryDate = new Date(newDeliveryDate);
        this.status = 'scheduled';
    }

    rescheduleDelivery(newDeliveryDate) {
        this.deliveryDate = new Date(newDeliveryDate);
        this.status = 'rescheduled';
    }

    getDeliveryDetails() {
        return {
            subscriptionId: this.subscriptionId,
            deliveryDate: this.deliveryDate,
            status: this.status,
        };
    }
}

module.exports = Delivery;