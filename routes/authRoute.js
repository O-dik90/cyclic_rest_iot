const express = require('express');
const authController = require('../controller/auth');
const tableController = require('../controller/table')
const passport = require('../utils/passport-jwt');

const router = express.Router();
const protect = passport.authenticate('jwt', { session: false });

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser)
router.get('/dashboard', protect, authController.currentUser)

// router.get('/table-get',protect, tableController.tableGet)

module.exports= router;
