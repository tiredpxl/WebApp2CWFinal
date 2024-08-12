const express = require('express');
const mustache = require("mustache-express");
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const logoutRoute = require('./routes/logout');

const UsersDAO = require('./models/usersModel');
const ItemsDAO = require('./models/itemsModel');
const ShopsDAO = require('./models/shopsModel');

const usersDB = new UsersDAO('users.db');
const itemsDB = new ItemsDAO('items.db');
const shopsDB = new ShopsDAO('shops.db');

// Seed databases
// usersDB.init();
// itemsDB.init();
// shopsDB.init();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(bodyParser.urlencoded({ extended: false }));

app.engine("mustache", mustache());
app.set("view engine", "mustache");
app.set('views', './views');

// Session 
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Import route files
const itemsRoutes = require('./routes/itemsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const shopsRoutes = require('./routes/shopsRoutes');

// Use route files
app.use('/', itemsRoutes);
app.use('/users', usersRoutes);
app.use('/', shopsRoutes);
app.use('/api', logoutRoute);

app.get('/about', function(req, res) {
    res.render('about');
});

app.get('/item', function(req, res) {
    res.render('item');
});

app.get('/shops', function(req, res) {
    res.render('shops');
});

function isManager(req, res, next) {
    if (req.session.user && req.session.user.role === 'Manager') {
        next();
    } else {
        res.status(403).send('Access denied');
    }
}

function isVolunteer(req, res, next) {
    if (req.session.user && req.session.user.role === 'Volunteer') {
        next();
    } else {
        res.status(403).send('Access denied');
    }
}

app.get('/admin', isManager, (req, res) => {
    usersDB.showAllEmployees((err, users) => {
        if (err) {
            return res.status(500).send('Error fetching users');
        }
        res.render('user/admin', { users, isSignedIn: true, isManager: req.session.user.role === 'Manager' });
    });
});

app.get('/', (req, res) => {
    res.render('index', {
        isSignedIn: !!req.session.user,
        isManager: req.session.user && req.session.user.role === 'Manager',
        isVolunteer: req.session.user && req.session.user.role === 'Volunteer',
        username: req.session.user ? req.session.user.username : null
    });
});

// Sign-in route
app.get('/signIn', (req, res) => {
    res.render('user/signIn');
});

// Sign-in route
app.post('/signIn', (req, res) => {
    const { username, password } = req.body;
    usersDB.verifyUser(username, password, (err, user) => {
        if (err || !user) {
            return res.status(401).send('Invalid credentials');
        }
        req.session.user = { username: user.username, role: user.role };
        res.redirect('/');
    });
});

//verify JWT
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send('No token provided');
    }
    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) {
            return res.status(500).send('Failed to authenticate token');
        }
        req.user = decoded;
        next();
    });
}

//Render the logout page
app.get('/logout', (req, res) => {
    res.render('logout');
});

// Route to render shops
app.get('/shops', (req, res) => {
    shopsDB.getAllShops((err, shops) => {
        if (err) {
            res.status(500).send('Error fetching shops');
        } else {
            res.render('shops', { shops: shops });
        }
    });
});

function checkAssignedShop(req, res, next) {
    const userId = req.session.userId;
    usersDB.db.findOne({ _id: userId }, (err, user) => {
        if (err || !user || !user.assignedShop) {
            return res.status(403).send('Access denied');
        }
        req.assignedShop = user.assignedShop;
        next();
    });
}

// Route to render items (restricted to assigned shop)
app.get('/items', checkAssignedShop, (req, res) => {
    itemsDB.getItemsByShop(req.assignedShop, (err, items) => {
        if (err) {
            res.status(500).send('Error fetching items');
        } else {
            res.render('items', { items: items });
        }
    });
});

app.post('/inventory/edit', (req, res) => {
    const { itemId, name, description, price, shop, soldOut } = req.body;

    itemsDB.db.update(
        { _id: itemId },
        { $set: { name, description, price: parseFloat(price), shop, soldOut: soldOut === 'on' } },
        {},
        (err, numReplaced) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                res.redirect('/inventory');
            }
        }
    );
});



app.use(function(req, res) {
    res.status(404);
    res.type('text/plain');
    res.send('404 Not found.');
});

app.use(function(err, req, res, next) {
    res.status(500);
    res.type('text/plain');
    res.send('Internal Server Error.');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000. Ctrl^c to exit.');
});