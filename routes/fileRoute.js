const express = require('express');
const filesController = require('../controller/file');

const router = express.Router();
router.post('/files-upload', filesController.upload ,filesController.filesAdd);
router.get('/files-get', filesController.filesGet);
router.delete('/files-delete/:id', filesController.filesDelete);
router.put('/files-update/:id', filesController.upload ,filesController.filesUpdate);

module.exports= router;