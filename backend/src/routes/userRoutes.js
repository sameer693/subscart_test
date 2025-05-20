const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Authentication routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes (require authentication)
router.get('/me', authMiddleware, userController.getProfile);
router.put('/me', authMiddleware, userController.updateProfile);

// Admin routes
// router.get('/users', authMiddleware, userController.getAllUsers);
// router.get('/users/:id', authMiddleware, userController.getUserById);
// router.put('/users/:id', authMiddleware, userController.updateUser);
// router.delete('/users/:id', authMiddleware, userController.deleteUser);

module.exports = router;