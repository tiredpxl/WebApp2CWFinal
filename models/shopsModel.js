const nedb = require('nedb');
const fs = require('fs');

class ShopDAO {
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
                console.error('Error counting shops:', err);
            } else if (count === 0) {
                // Insert initial data only if the database is empty
                this.db.insert([
                    {
                        number: 1,
                        location: "Glasgow Hospice Charity Shop - Victoria Rd",
                        address: "20 Victoria Rd, Glasgow",
                        postcode: "G41 2QB",
                        phone: "0141 456 7890"
                    },
                    {
                        number: 2,
                        location: "Glasgow Hospice Charity Shop - Kilmarnock Rd",
                        address: "40 Kilmarnock Rd, Glasgow",
                        postcode: "G41 3NH",
                        phone: "0141 345 6789"
                    },
                    {
                        number: 3,
                        location: "Glasgow Hospice Charity Shop - Broomielaw",
                        address: "60 Broomielaw, Glasgow",
                        postcode: "G1 4PR",
                        phone: "0141 789 0123"
                    },
                    {
                        number: 4,
                        location: "Glasgow Hospice Charity Shop - Partick",
                        address: "349 Dumbarton Rd, Glasgow",
                        postcode: "G11 6AL",
                        phone: "0141 012 3456"
                    }
                ], (err) => {
                    if (err) {
                        console.error('Error inserting initial shops:', err);
                    } else {
                        console.log('Shop database initialized');
                    }
                });
            }
        });
    }

    getAllShops(callback) {
        console.log('Executing query to fetch all shops...');
        this.db.find({}, (err, docs) => {
            if (err) {
                console.error('Error executing query:', err);
            } else {
                console.log('Query executed successfully:', docs);
            }
            callback(err, docs);
        });
    }
}

module.exports = ShopDAO;