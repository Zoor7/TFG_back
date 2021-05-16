const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

// Aquí le diremos donde guardaremos nuestras imágenes y otras opciones
const fileUpload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/images');
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, 'randomId' + '.' + ext);
    }
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype]; // Esto lo hago para forzar a que me devuelva un true o un false si la extensión está permitida
    let error = isValid ? null : new Error('Mime type no permitido!');
    cb(error, isValid);
  }
});


module.exports = fileUpload;