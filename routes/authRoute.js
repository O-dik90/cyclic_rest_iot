const express = require('express');
const authController = require('../controller/auth');

const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.post('/verify',authController.verifyUser);
router.post('/forgot-password',authController.forgotUser);
router.post('/reset-password/:id',authController.resettingUser);

// router.get('/table-get',protect, tableController.tableGet)

module.exports= router;
