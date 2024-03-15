const express = require('express');
const mongoose = require('mongoose');
var cors = require('cors')
const bcrypt = require('bcrypt');
const jwt = require('jwt');

('dotenv').config() 
const host = process.env.HOST 


const app = express();

app.use(express.json());

app.use(cors());

mongoose.connect(process.env.URL_MONGOOSE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));

app.use('/auteurs', require('./Routes/Autheur'));
app.use('/editeur', require('./Routes/Editeur'));
app.use('/livre', require('./Routes/Livre'));

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const accessToken = jwt.sign({ username: user.username }, process.env.TOKEN_SECRET);
        res.json({ accessToken });
        
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

const PORT = process.env.PORT || 3015;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});