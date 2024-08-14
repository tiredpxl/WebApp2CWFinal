const express = require('express');
const router = express.Router();
const shopsController = require('../controllers/shopsController');

//get all shops
router.get('/shops', shopsController.getAllShops);

//render items (restricted to assigned shop)
router.get('/items', checkAssignedShop, (req, res) => {
    itemsDB.getItemsByShop(req.assignedShop, (err, items) => {
        if (err) {
            res.status(500).send('Error fetching items');
        } else {
            res.render('items', { items: items });
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

//render inventory page (restricted to assigned shop)
router.get('/inventory', checkAssignedShop, (req, res) => {
    itemsDB.getItemsByShop(req.assignedShop, (err, items) => {
        if (err) {
            res.status(500).send('Error fetching items');
        } else {
            res.render('inventory', { items: items });
        }
    });
});

// New route for collections
router.get('/collections/:name', shopsController.getCollection);


module.exports = router;