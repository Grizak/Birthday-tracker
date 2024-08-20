const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

// Import routes
const authRoutes = require('./routes/auth');
const birthdayRoutes = require('./routes/birthdays');

const app = express();
const SECRET_KEY = 'your_jwt_secret_key';
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/birthday-tracker', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.sendFile(path.join(__filename, 'index.html'));
})
app.use(express.json());

// Registration route
app.post('/register', async (req, res) => {
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
app.post('/login', async (req, res) => {
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

// Middleware to protect routes
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(403);

    jwt.verify(token.split(' ')[1], SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Define Birthday schema and model
const birthdaySchema = new mongoose.Schema({
    name: String,
    date: Date,
    notes: String
});

const Birthday = mongoose.model('Birthday', birthdaySchema);

// API routes
app.get('/birthdays', async (req, res) => {
    const birthdays = await Birthday.find();
    res.json(birthdays);
});

app.post('/birthdays', async (req, res) => {
    const birthday = new Birthday(req.body);
    await birthday.save();
    res.json({ message: 'Birthday added!' });
});

// Use routes
app.use('/auth', authRoutes);
app.use('/birthdays', birthdayRoutes);

// User schema and model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

const i18n = require('./config/i18n');
app.use(i18n);

const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
