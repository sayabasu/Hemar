import { api } from '../../../lib/api.js';

/**
 * Uploads a product image using a presigned URL flow.
 * @param {File} file
 */
export const uploadProductImage = async (file) => {
  if (!file) {
    throw new Error('Please choose an image to upload.');
  }

  if (!file.type || !file.type.startsWith('image/')) {
    throw new Error('Only image files are supported.');
  }

  const { data } = await api.post('/products/images/upload', {
    fileName: file.name,
    contentType: file.type,
  });

  if (!data?.uploadUrl || !data?.fileUrl) {
    throw new Error('Upload service returned an unexpected response.');
  }

  const uploadResponse = await fetch(data.uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload the image to storage. Please try again.');
  }

  return { fileUrl: data.fileUrl };
};
