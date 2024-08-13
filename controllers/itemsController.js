const ItemDAO = require('../models/itemsModel');
const itemsDB = new ItemDAO('items.db');

// Initialize the database (if not already initialized)
itemsDB.init();

// Get all items - volunteer inventory
exports.getAllItems = (req, res) => {
    itemsDB.getAllItems((err, items) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        res.render('inventory', { items });
    });
};

// Add a new item
exports.addItem = (req, res) => {
    const { name, description, price, shop, soldOut } = req.body;
    const newItem = {
        name,
        description,
        price: parseFloat(price),
        shop,
        soldOut: soldOut === 'on' // Convert checkbox to boolean
    };
    itemsDB.addItem(newItem, (err) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/inventory');
    });
};

// Edit an item
exports.editItem = (req, res) => {
    const { itemId, name, description, price, shop, soldOut } = req.body;
    const updatedItem = {
        name,
        description,
        price: parseFloat(price),
        shop,
        soldOut: soldOut === 'on'
    };

    itemsDB.updateItemById(itemId, updatedItem, (err, numReplaced) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        if (numReplaced === 0) {
            return res.status(404).send('Item not found');
        }
        res.redirect('/inventory');
    });
};

// Delete an item
exports.deleteItem = (req, res) => {
    const { itemId } = req.params;
    itemsDB.deleteItem(itemId, (err) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).send('Item deleted');
    });
};

// Get item details
exports.getItemDetails = (req, res) => {
    const { itemId } = req.params;
    itemsDB.getItemById(itemId, (err, item) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        if (!item) {
            return res.status(404).send('Item not found');
        }
        res.status(200).json(item);
    });
};

// Get all items for inStore page
exports.getInStoreItems = (req, res) => {
    itemsDB.getAllItems((err, items) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        res.render('inStore', { items });
    });
};