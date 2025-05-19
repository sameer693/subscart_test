class Subscription {
    constructor(userId, plan, status = 'active') {
        this.userId = userId;
        this.plan = plan;
        this.status = status;
    }

    static create(subscriptionData) {
        // Logic to create a new subscription in the database
    }

    static update(subscriptionId, updatedData) {
        // Logic to update an existing subscription in the database
    }

    static retrieve(subscriptionId) {
        // Logic to retrieve a subscription from the database
    }

    static retrieveByUserId(userId) {
        // Logic to retrieve subscriptions by user ID from the database
    }
}

module.exports = Subscription;