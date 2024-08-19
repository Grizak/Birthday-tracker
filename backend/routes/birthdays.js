const express = require('express');
const Birthday = require('../models/birthday');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// Get all birthdays (protected route)
router.get('/', authenticateToken, async (req, res) => {
    const birthdays = await Birthday.find();
    res.json(birthdays);
});

// Add a new birthday (protected route)
router.post('/', authenticateToken, async (req, res) => {
    const birthday = new Birthday(req.body);
    await birthday.save();
    res.json({ message: 'Birthday added!' });
});

module.exports = router;
