const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();
const SECRET_KEY = 'your_jwt_secret_key'; // Replace with your own secret key

// Registration route
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        res.json({ message: 'User registered successfully!' });
    } catch (err) {
        res.status(400).json({ error: 'Username already exists!' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(400).json({ error: 'Login failed' });
    }
});

module.exports = router;

router.get('/login', (req, res) => {
    res.json({ message: req.t('login') });
});
