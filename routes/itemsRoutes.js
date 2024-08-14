const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');

// Route to get items of user's shop
router.get('/inventory', itemsController.getAllItems);

// Route to add a new item
router.post('/inventory/add', itemsController.addItem);

// Route to edit an existing item
router.post('/inventory/edit', itemsController.editItem);

// Route to get item details
router.get('/inventory/:itemId', itemsController.getItemDetails);

// Route to delete an existing item
router.post('/inventory/delete', itemsController.deleteItem);

//get all items for "items" page
router.get('/items', itemsController.getAllItems);

// Route to get all items for inStore
router.get('/inStore', itemsController.getInStoreItems);

// Route to get item details
router.get('/details/:itemName', itemsController.getItemDetails);

module.exports = router;