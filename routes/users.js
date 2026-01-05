const express = require('express');
const { getAllUsers, updateUser, deleteUser } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin only.' });
    }
};

// GET /api/users - Get all users (admin only)
router.get('/', authenticate, isAdmin, getAllUsers);

// PUT /api/users/:id - Update user (admin only)
router.put('/:id', authenticate, isAdmin, updateUser);

// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', authenticate, isAdmin, deleteUser);

module.exports = router;
