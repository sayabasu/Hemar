import multer from 'multer';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB limit for product images

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
});
