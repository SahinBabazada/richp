const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 8008;

// Use CORS middleware
app.use(cors());

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Endpoint to handle file uploads
app.post('/uploadFile', upload.single('image'), (req, res) => { // Ensure the field name matches here
  res.send({
    success: 1,
    file: {
      url: `http://localhost:${port}/uploads/${req.file.filename}`,
    },
  });
});

// Serve static files
app.use('/uploads', express.static('uploads'));

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
