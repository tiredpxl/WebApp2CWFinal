const nedb = require('nedb');
const fs = require('fs');
const path = require('path');

class ItemDAO {
    constructor(dbFilePath) {
        if (dbFilePath) {
            const tempFilePath = `${dbFilePath}~`;
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
            this.db = new nedb({ filename: dbFilePath, autoload: true });
        } else {
            this.db = new nedb();
        }
    }

    init() {
        this.db.count({}, (err, count) => {
            if (err) {
                console.error('Error counting items:', err);
            } else if (count === 0) {
                // Insert initial data only if the database is empty
                this.db.insert([
                    {
                        shopNumber: 1,
                        name: "T-shirt",
                        description: 'A plain white t-shirt',
                        price: 5.00,
                        shop: "Glasgow Hospice Charity Shop - Victoria Rd",
                        soldOut: false,
                        image: 'tshirt.jpg'
                    },
                    {
                        shopNumber: 2,
                        name: "Jeans",
                        description: 'A pair of blue jeans',
                        price: 10.00,
                        shop: "Glasgow Hospice Charity Shop - Kilmarnock Rd",
                        soldOut: false,
                        image: 'jeans.jpg'

                    },
                    {
                        shopNumber: 3,
                        name: "Vase",
                        description: 'A glass vase',
                        price: 15.00,
                        shop: "Glasgow Hospice Charity Shop - Broomielaw",
                        soldOut: false,
                        image: 'vase.jpg'
                    },
                    {
                        shopNumber: 4,
                        name: "Book",
                        description: 'A book',
                        price: 4.00,
                        shop: "Glasgow Hospice Charity Shop - Partick",
                        soldOut: false,
                        image: 'book.jpg'
                    },
                    {
                        shopNumber: 1,
                        name: "Bracelet",
                        description: 'Silver bracelet with heart charm',
                        price: 8.00,
                        shop: "Glasgow Hospice Charity Shop - Victoria Rd",
                        soldOut: false,
                        image: 'bracelet.jpg'
                    },
                    {
                        shopNumber: 2,
                        name: "Candle",
                        description: 'Jasmine and patchouli scented candle',
                        price: 3.00,
                        shop: "Glasgow Hospice Charity Shop - Kilmarnock Rd",
                        soldOut: false,
                        image: 'candle.jpg'
                    },
                    {
                        shopNumber: 3,
                        name: "Bag",
                        description: 'A small brown leather bag',
                        price: 15.00,
                        shop: "Glasgow Hospice Charity Shop - Broomielaw",
                        soldOut: false,
                        image: 'bag.jpg'
                    },
                    {
                        shopNumber: 1,
                        name: "Shoes",
                        description: 'A pair of black leather shoes',
                        price: 9.00,
                        shop: "Glasgow Hospice Charity Shop - Partick",
                        soldOut: true,
                        image: 'shoes.jpg'
                    },
                    {
                        shopNumber: 2,
                        name: "Coat",
                        description: 'A waterproof navy coat',
                        price: 20.00,
                        shop: "Glasgow Hospice Charity Shop - Victoria Rd",
                        soldOut: true,
                        image: 'coat.jpg'
                    },
                    {
                        shopNumber: 1,
                        name: "Hat",
                        description: 'A straw hat',
                        price: 6.00,
                        shop: "Glasgow Hospice Charity Shop - Kilmarnock Rd",
                        soldOut: true,
                        image: 'hat.jpg'
                    }
                ], (err) => {
                    if (err) {
                        console.error('Error inserting initial items:', err);
                    } else {
                        console.log('Item database initialized');
                    }
                });
            }
        });
    }

    getAllItems(callback) {
        console.log('Executing query to fetch all items...');
        this.db.find({}, (err, docs) => {
            if (err) {
                console.error('Error executing query:', err);
            } else {
                console.log('Query executed successfully:', docs);
            }
            callback(err, docs);
        });
    }

    getItemById(itemId, callback) {
        this.db.findOne({ _id: itemId }, (err, item) => {
            callback(err, item);
        });
    }

    addItem(item, callback) {
        this.db.insert(item, (err, newDoc) => {
            callback(err, newDoc);
        });
    }

    updateItemById(itemId, updatedItem, callback) {
        this.db.update({ _id: itemId }, { $set: updatedItem }, {}, (err, numReplaced) => {
            callback(err, numReplaced);
        });
    }

    deleteItem(itemId, callback) {
        this.db.remove({ _id: itemId }, {}, (err, numRemoved) => {
            callback(err, numRemoved);
        });
    }

    getItemsByShop(shopNumber, callback) {
        this.db.find({ shopNumber: shopNumber }, callback);
    }
}

module.exports = ItemDAO;