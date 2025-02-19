const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.listen(process.env.PORT || port);

// Connect to MongoDB
const mongoURI = "mongodb+srv://ggolafsson:ap5qqlcvidW5s0uV@cluster0.g3ygk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define User schema and model
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', userSchema);

// Define Task schema and model
const taskSchema = new mongoose.Schema({
    task: String,
    priority: String,
    dueDate: Date,
    complete: { type: String, default: 'off' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const Task = mongoose.model('Task', taskSchema);

app.use(cors());
app.use(bodyParser.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    async (username, password, done) => {
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            if (!user) {
                console.log('User not found');
            } else {
                console.log(`TESTING ONLY: Incorrect password. Password is ${user.password}`);
            }
            return done(null, false, { message: 'Incorrect username or password.' });
        }
        return done(null, user);
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
};

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");
    next();
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Routes
app.post('/sign-in', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Error during authentication:', err);
            return next(err);
        }
        if (!user) {
            console.log('Authentication failed:', info.message);
            return res.status(401).send(info.message);
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error('Error during login:', err);
                return next(err);
            }
            console.log('User authenticated successfully');
            return res.send('Authenticated');
        });
    })(req, res, next);
});

app.get('/user-check', async (req, res) => {
    const user = await User.findOne({ username: req.query.username });
    if (user) {
        return res.json(1);
    }
    res.json(0);
});

app.get('/signed-in-check', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(1);
    } else {
        res.json(0);
    }
})

app.post('/sign-up', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.send('User registered');
});

app.get('/tasks', async (req, res) => {
    console.log("ahh");
    try {
        const tasks = await Task.find({ user: req.user._id });
        res.json(tasks);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.post('/submit', ensureAuthenticated, async (req, res) => {
    const newTask = new Task({ ...req.body, user: req.user._id });
    await newTask.save();
    res.status(201).send('Task added');
});

app.post('/update-task', ensureAuthenticated, async (req, res) => {
    const { task, complete } = req.body;
    console.log(`task: ${task}, complete: ${complete}`);
    await Task.updateOne({ task: task, user: req.user._id }, { complete });
    res.send('Task updated');
});

app.post('/delete-task', ensureAuthenticated, async (req, res) => {
    const { task } = req.body;
    await Task.deleteOne({ task, user: req.user._id });
    res.send('Task deleted');
});

app.get('/auth-check', (req, res) => {
    console.log("this is the username: ${req.user.username)");
    if (req.isAuthenticated()) {
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
});

app.get('/user-info', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).send({ username: req.user.username });
    } else {
        res.sendStatus(500);
    }
});

app.post('/sign-out', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.sendStatus(200);
    });
});