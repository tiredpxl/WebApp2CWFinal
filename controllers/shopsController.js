const ShopDAO = require('../models/shopsModel');
const shopsDB = new ShopDAO('shops.db');

// Initialize the database
shopsDB.init();

// Get all shops
exports.getAllShops = (req, res) => {
    console.log('Fetching all shops from database...');
    shopsDB.getAllShops((err, shops) => {
        if (err) {
            console.error('Error fetching shops:', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Shops data fetched:', shops);  
        res.render('shops', { shops });
    });
};

