const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Render sign in page
router.get('/signIn', (req, res) => {
    res.render('user/signIn');
});

//sign in
router.post('/signIn', usersController.signIn);

// Render admin page
router.get('/admin', usersController.showAdminPage);

// Handle add employee
router.post('/add', usersController.addEmployee);

// Handle delete employee
router.post('/delete', usersController.deleteEmployee);

module.exports = router;