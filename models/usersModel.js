const nedb = require("nedb");
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class UsersDAO {
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
                console.error('Error counting users:', err);
            } else if (count === 0) {
                const initialUsers = [
                    { username: "Manager", password: "Manager1", role: "Manager" },
                    { username: "Volunteer1", password: "Volunteer1", role: "Volunteer", shop: "Glasgow Hospice Charity Shop - Victoria Rd", shopNumber: 1 },
                    { username: "Volunteer2", password: "Volunteer2", role: "Volunteer", shop: "Glasgow Hospice Charity Shop - Kilmarnock Rd", shopNumber: 2 },
                    { username: "Volunteer3", password: "Volunteer3", role: "Volunteer", shop: "Glasgow Hospice Charity Shop - Broomielaw", shopNumber: 3 },
                    { username: "Volunteer4", password: "Volunteer4", role: "Volunteer", shop: "Glasgow Hospice Charity Shop - Partick", shopNumber: 4 },
                ];

                const hashPromises = initialUsers.map(user => {
                    return bcrypt.hash(user.password, saltRounds).then(hash => {
                        user.password = hash;
                        return user;
                    });
                });

                Promise.all(hashPromises).then(users => {
                    this.db.insert(users, (err) => {
                        if (err) {
                            console.error('Error inserting initial users:', err);
                        }
                    });
                }).catch(err => {
                    console.error('Error hashing passwords:', err);
                });
            }
        });
    }

    showAllEmployees(callback) {
        this.db.find({}, callback);
    }

    addEmployee(user, callback) {
        bcrypt.hash(user.password, saltRounds).then(hash => {
            user.password = hash;
            this.db.insert(user, callback);
        }).catch(err => {
            console.error('Error hashing password:', err);
            callback(err);
        });
    }

    viewEmployee(username, callback) {
        this.db.findOne({ username: username }, callback);
    }

    showAllEmployees(callback) {
        this.db.find({}, callback);
    }

    updateEmployee(user, callback) {
        const { username, password, role } = user;
        bcrypt.hash(password, saltRounds).then(hash => {
            this.db.update({ username: username }, { $set: { password: hash, role: role } }, {}, callback);
        }).catch(err => {
            console.error('Error hashing password:', err);
            callback(err);
        });
    }

    deleteEmployee(username, callback) {
        this.db.remove({ username: username }, {}, callback);
    }

    verifyUser(username, password, callback) {
        this.db.findOne({ username: username }, (err, user) => {
            if (err || !user) {
                return callback(err, null);
            }
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    callback(null, user);
                } else {
                    callback(err, null);
                }
            });
        });
    }

}

module.exports = UsersDAO;