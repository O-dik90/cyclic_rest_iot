const express = require('express');
const tableController = require('../controller/table')

const passport = require('../utils/passport-jwt');

const router = express.Router();
const protect = passport.authenticate('jwt', { session: false });

router.get('/table-get', protect,tableController.tablesGet)
router.post('/table-add', protect,tableController.tablesAdd)
router.delete('/table-delete/:id', protect,tableController.tablesDelete)
router.put('/table-update/:id', protect,tableController.tablesUpdate)

module.exports = router;