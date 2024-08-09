const express = require('express');
const tableController = require('../controller/table')

const passport = require('../utils/passport-jwt');

const router = express.Router();
const protect = passport.authenticate('jwt', { session: false });

router.get('/table-get', protect,tableController.tableGet)
router.post('/table-add', protect,tableController.tableAdd)
router.delete('/table-delete/:id', protect,tableController.tableDelete)
router.put('/table-update/:id', protect,tableController.tableUpdate)

module.exports = router;