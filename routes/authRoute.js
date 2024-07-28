const express = require('express');
const authController = require('../controller/auth');

const passport = require('../utils/passport-jwt')

const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/dashboard', passport.authenticate('jwt', {session: false}), async (req,res) => {
  res.status(200).json({message: "dashboard", token : req.headers})
})

module.exports= router;
