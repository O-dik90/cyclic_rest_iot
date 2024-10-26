const express = require('express');
const filesController = require('../controller/file');

const router = express.Router();
router.post('/files-upload', filesController.filesAdd);
router.get('/files-get', filesController.filesGet);

module.exports= router;