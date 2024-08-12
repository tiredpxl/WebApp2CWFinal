const UsersDAO = require('../models/usersModel');
const usersDB = new UsersDAO('users.db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Sign in
exports.signIn = (req, res) => {
    const { username, password } = req.body;
    usersDB.verifyUser(username, password, (err, user) => {
        if (err || !user) {
            return res.status(401).send('Invalid credentials');
        }
        const token = jwt.sign({ username: user.username, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
        req.session.user = { username: user.username, role: user.role }; // Set session user
        res.redirect('/'); // Redirect to home page after successful sign-in
    });
};

//to show admin page with all users
exports.showAdminPage = (req, res) => {
    usersDB.showAllEmployees((err, users) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.render('user/admin', { users, isSignedIn: true, isManager: req.session.user.role === 'Manager' });
        }
    });
};

// add a new employee
exports.addEmployee = (req, res) => {
    if (req.session.user && req.session.user.role === 'Manager') {
        const { username, password, role } = req.body;
        usersDB.addEmployee({ username, password, role }, (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.redirect('/users/admin');
            }
        });
    } else {
        res.status(403).send('Access denied');
    }
};

//delete an employee
exports.deleteEmployee = (req, res) => {
    if (req.session.user && req.session.user.role === 'Manager') {
        const { username } = req.body;
        usersDB.deleteEmployee(username, (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.redirect('/users/admin');
            }
        });
    } else {
        res.status(403).send('Access denied');
    }
};