class User {
    constructor(name, email, subscriptionStatus) {
        this.name = name;
        this.email = email;
        this.subscriptionStatus = subscriptionStatus;
    }

    static createUser(name, email, subscriptionStatus) {
        // Logic to create a new user in the database
    }

    static getUserByEmail(email) {
        // Logic to retrieve a user by email from the database
    }

    static getAllUsers() {
        // Logic to retrieve all users from the database
    }
}

module.exports = User;