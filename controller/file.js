const multer = require("multer");
const path = require('path');
const { format, nextDay } = require('date-fns');
const File = require('../models/file');
const file = require("../models/file");

const now = new Date();
const formattedDate = format(now, 'yyyy_MM_dd_HH:mm:ss');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + formattedDate + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: (50 * 1024 * 1024 ) } // 50 MB file size limit
}).single('file');

const filesAdd = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'File upload error', details: err });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'Please provide a file' });
      }

      // Create a new document in MongoDB for the uploaded file
      const file = new File({
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
        uploadDate: new Date(),
      });

      try {
        // Save the file document to MongoDB
        await file.save();
        res.send({ message: 'success upload file', file });
      } catch (dbError) {
        console.error(dbError);
        res.status(500).send({ message: 'Error saving file information to the database' });
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'File upload failed', error });
  }
};

const filesGet = async (req, res) => {
  try {
    const files = await File.find();
    
    if (!files) 
      throw new Error('Empty files')
    
    res.status(200).json(files)
  } catch (error) {
    res.status(500).json({message: error})
  }
}


module.exports = {
  upload,
  filesAdd,
  filesGet
}