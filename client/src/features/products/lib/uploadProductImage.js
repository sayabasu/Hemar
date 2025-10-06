import { api } from '../../../lib/api.js';

/**
 * Uploads a product image via the API and returns its public URL.
 * @param {File} file
 */
export const uploadProductImage = async (file) => {
  if (!file) {
    throw new Error('Please choose an image to upload.');
  }

  if (!file.type || !file.type.startsWith('image/')) {
    throw new Error('Only image files are supported.');
  }

  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post('/products/images/upload', formData);

  if (!data?.fileUrl) {
    throw new Error('Upload service returned an unexpected response.');
  }

  return { fileUrl: data.fileUrl };
};
