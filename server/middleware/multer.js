const multer = require('multer');
const path = require('path');


const picturePATH = path.resolve(__dirname, '../pictures');
console.log(picturePATH)

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, picturePATH)
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext).replace(/[/\\?%*:|"<>]/g, '_');
        cb(null, `${base}-${Date.now()}${ext}`)
    }
});


function fileFilter(req, file, cb) {
  const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
  if (!allowed.has(file.mimetype)) return cb(new Error('Only JPG/PNG/WEBP allowed'));
  cb(null, true);
}

const upload = multer({
    storage: storage,
    fileFilter,
    limits: {
        files: 3,
        fileSize: 5 * 1024 * 1024
    }
})


module.exports = { upload }