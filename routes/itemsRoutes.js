const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');

// Route to get all items
router.get('/inventory', itemsController.getAllItems);

// Route to add a new item
router.post('/inventory/add', itemsController.addItem);

// Route to edit an existing item
router.post('/inventory/edit', itemsController.editItem);

// Route to get item details
router.get('/inventory/:itemId', itemsController.getItemDetails);

// Route to delete an existing item
router.delete('/inventory/delete/:itemId', itemsController.deleteItem);

module.exports = router;