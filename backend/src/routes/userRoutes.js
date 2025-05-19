const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Route to create a new user
router.post('/users', userController.createUser);

// Route to get user details
router.get('/users/:id', userController.getUser);

// Route to update user details
// router.put('/users/:id', userController.updateUser);

// Route to delete a user
// router.delete('/users/:id', userController.deleteUser);

module.exports = router;