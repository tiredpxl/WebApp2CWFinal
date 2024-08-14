const ItemDAO = require('../models/itemsModel');
const itemsDB = new ItemDAO('items.db');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/images/'); // Directory to save uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage: storage });

// Initialize the database (if not already initialized)
itemsDB.init();

// Get all items - volunteer inventory
exports.getAllItems = (req, res) => {
    const currentUser = req.session.user;
    if (!currentUser) {
        return res.status(401).send('Unauthorized');
    }

    itemsDB.getItemsByShop(currentUser.shop, (err, items) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        res.render('inventory', { items });
    });
};

// Add a new item
exports.addItem = [
    upload.single('itemImage'), //to handle file upload
    (req, res) => {
        const { name, description, price, collection } = req.body;
        const image = req.file ? req.file.filename : null;

        const newItem = {
            image,
            name,
            description,
            price: parseFloat(price),
            shop: req.session.user.shop,
            collection
        };

        itemsDB.addItem(newItem, (err) => {
            if (err) {
                return res.status(500).send('Internal Server Error');
            }
            res.redirect('/inventory');
        });
    }
];

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

exports.deleteItem = (req, res) => {
    const { itemId } = req.body;
    itemsDB.deleteItem(itemId, (err) => {
        if (err) {
            return res.status(500).send('Error deleting item');
        }
        res.redirect('/inventory');
    });
};

// Get item details
exports.getItemDetails = (req, res) => {
    const { itemName } = req.params;
    itemsDB.getItemByName(itemName, (err, item) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        if (!item) {
            return res.status(404).send('Item not found');
        }
        res.render('details', item);
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