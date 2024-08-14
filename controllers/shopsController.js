const ShopDAO = require('../models/shopsModel');
const shopsDB = new ShopDAO('shops.db');
const ItemDAO = require('../models/itemsModel');
const itemsDB = new ItemDAO('items.db');

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

exports.getCollection = (req, res) => {
    const collectionName = req.params.name;
    itemsDB.getItemsByCollection(collectionName, (err, items) => {
        if (err) {
            console.error('Error fetching items:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.render('collection', { collectionName, items });
    });
};