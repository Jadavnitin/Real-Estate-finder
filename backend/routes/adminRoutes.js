const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, logoutAdmin } = require('../controllers/adminController');
const { adminAddProperty, getAllProperties } = require('../controllers/adminPropertyController');
const upload = require('../middleware/upload');

// Auth routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);

// Property routes
router.post('/add-property', upload.single('image'), adminAddProperty);
router.get('/all-property', getAllProperties);

module.exports = router;
