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

function addAuthVariables(req, res, next) {
    res.locals.isSignedIn = !!req.session.user;
    res.locals.isManager = req.session.user && req.session.user.role === 'Manager';
    res.locals.isVolunteer = req.session.user && req.session.user.role === 'Volunteer';
    res.locals.username = req.session.user ? req.session.user.username : null;
    next();
}
app.use(addAuthVariables);

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

app.get('/inStore', (req, res) => {
    getItems((items) => {
    res.render('inStore', {items: items});
    });
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



app.get('/admin', isManager, (req, res) => {
    usersDB.showAllEmployees((err, users) => {
        if (err) {
            return res.status(500).send('Error fetching users');
        }
        res.render('user/admin', { users, isSignedIn: true, isManager: req.session.user.role === 'Manager' });
    });
});

app.get('/', (req, res) => {
    itemsDB.getAllItems((err, items) => {
        if (err) {
            return res.status(500).send('Error fetching items');
        }
        const collections = [...new Set(items.map(item => item.collection))];
        res.render('index', {
            isSignedIn: !!req.session.user,
            isManager: req.session.user && req.session.user.role === 'Manager',
            isVolunteer: req.session.user && req.session.user.role === 'Volunteer',
            username: req.session.user ? req.session.user.username : null,
            collections: collections.map(name => ({ name }))
        });
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
        req.session.user = { username: user.username, role: user.role, shop: user.shop };
        res.redirect('/');
    });
});

function getCurrentUser(req) {
    return req.session.user;
}

// Route to get filtered items
app.get('/inventory', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
        return res.status(401).send('Unauthorized');
    }

    itemsDB.getAllItems((err, items) => {
        if (err) {
            return res.status(500).send('Error fetching items');
        }

    const filteredItems = items.filter(item => item.shop === currentUser.shop);
    res.json(filteredItems);
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

app.get('/details/:itemName', (req, res) => {
    res.render('details', { itemName: req.params.itemName });
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
                res.redirect('/inventory', );
            }
        }
    );
});

app.get('/collection/:collectionName', (req, res) => {
    res.render('collection', { collectionName: req.params.collection });
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

//deployed on Heroku
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}. Ctrl^c to exit.`);
});

//local host
// app.listen(3000, () => {
//     console.log('Server is running on http://localhost:3000. Ctrl^c to exit.');
// });