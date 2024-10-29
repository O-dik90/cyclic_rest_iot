const multer = require("multer");
const path = require('path');
const { format, nextDay } = require('date-fns');
const File = require('../models/file');

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
  limits: { fileSize: (50 * 1024 * 1024) } // 50 MB file size limit
}).single('file');

const filesAdd = async (req, res) => {
  try {
    const file = new File({
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
      uploadDate: new Date(),
    });

    await file.save();
    res.status(200).json({ message: 'success upload file', file });
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
    res.status(500).json({ message: error })
  }
}

const filesDelete = async (req, res) => {
  try {
    const id = { _id: req.params.id }
    const deletedFile = await File.findByIdAndDelete(id);

    if (!deletedFile) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting file', error });
  }
}

const filesUpdate = async (req, res) => {
  try {
    console.log(req.file)
    const id = { _id: req.params.id }
    const params = {
      "name": req.file.originalname,
      "size": req.file.size,
      "type": req.file.type,
      "UploadDate": new Date()
    }

    const updateFile = await File.findByIdAndUpdate(id, params, { new: true })

    if (!updateFile)
      return res.status(400).json({ messgae: 'File not Found' })

    res.status(200).json(updateFile)
  } catch (error) {
    res.status(500).json({ message: 'Error updating file', error });
  }
}
module.exports = {
  upload,
  filesAdd,
  filesGet,
  filesDelete,
  filesUpdate
}