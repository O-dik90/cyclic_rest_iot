const express = require('express');
const tableController = require('../controller/table')

const passport = require('../utils/passport-jwt');

const router = express.Router();
const protect = passport.authenticate('jwt', { session: false });

router.get('/table-get', protect,tableController.tableGet)
router.get('/table-add', protect,tableController.tableGet)
router.get('/table-delete/:id', protect,tableController.tableGet)
router.get('/table-update/:id', protect,tableController.tableGet)

module.exports = router;