import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';

const storage = multer.diskStorage({
  // в яку директорію будуть зберігатися завантажені файли
  destination: function (req, file, cb) {
    cb(null, TEMP_UPLOAD_DIR);
  },

  // яке ім'я буде надане завантаженому файлу 
  filename: function (req, file, cb) {
    // поточна дата і час
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}_${file.originalname}`);
  },
});

export const upload = multer({ storage });
