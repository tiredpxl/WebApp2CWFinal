const express = require('express');
const router = express.Router();

router.post('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        // Clear the cookie
        res.clearCookie('connect.sid');
        res.status(200).send('Logged out');
    });
});

module.exports = router;