const Busboy = require('busboy');
const fs = require('fs');
const path = require('path');

const customUpload = (req, res, next) => {
  let bb;
  try {
    // Try both instantiation methods for Busboy depending on the version
    try {
      bb = new Busboy({ headers: req.headers });
    } catch (err) {
      bb = Busboy({ headers: req.headers });
    }
  } catch (err) {
      return res.status(400).json({ success: false, message: 'Invalid multipart request' });
  }

  const uploadDir = 'uploads/';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  req.files = [];
  const filePromises = [];

  // Catch the file even if fieldname is completely missing/empty!
  bb.on('file', function(fieldname, file, filenameOrInfo, encoding, mimetype) {
    let filename = 'file.xlsx';
    if (typeof filenameOrInfo === 'object' && filenameOrInfo !== null) {
      filename = filenameOrInfo.filename || filename;
    } else if (typeof filenameOrInfo === 'string' && filenameOrInfo) {
      filename = filenameOrInfo;
    }

    const savePath = path.join(uploadDir, Date.now() + '-' + filename);
    const writeStream = fs.createWriteStream(savePath);

    const promise = new Promise((resolve, reject) => {
      writeStream.on('finish', () => resolve());
      writeStream.on('error', reject);
    });

    filePromises.push(promise);
    
    file.pipe(writeStream);

    // Save metadata
    req.files.push({ path: savePath, originalname: filename });
  });

  bb.on('finish', () => {
    Promise.all(filePromises).then(() => {
      if (req.files.length > 0) {
        req.file = req.files[0];
      }
      next();
    }).catch(err => {
      return res.status(500).json({ success: false, message: 'File save error: ' + err.message });
    });
  });

  req.pipe(bb);
};

module.exports = customUpload;
