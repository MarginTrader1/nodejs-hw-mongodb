import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';
import { env } from './env.js';

// функцію, яка буде зберігати зображення в постійну папку, 
// а також видаляти її з тимчасової
export const saveFileToUploadDir = async (file) => {
    // метод rename якщо рiзнi шляхи, то фактично здiйснює перемiщення файлу
  await fs.rename(
    path.join(TEMP_UPLOAD_DIR, file.filename),
    path.join(UPLOAD_DIR, file.filename),
  );

  return `${env('APP_DOMAIN')}/uploads/${file.filename}`;
};
