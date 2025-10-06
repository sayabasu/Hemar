/**
 * @returns {{
 *   name: string;
 *   description: string;
 *   price: string;
 *   imageUrl: string;
 *   imageFile: File | null;
 *   brand: string;
 *   stock: string;
 * }}
 */
export const createEmptyProductForm = () => ({
  name: '',
  description: '',
  price: '',
  imageUrl: '',
  imageFile: null,
  brand: '',
  stock: '',
});

/**
 * Maps a product into editable form values.
 * @param {import('../../../shared/types/products.js').Product | null | undefined} product
 */
export const mapProductToFormValues = (product) => ({
  name: product?.name ?? '',
  description: product?.description ?? '',
  price: product?.price != null ? String(product.price) : '',
  imageUrl: product?.imageUrl ?? '',
  imageFile: null,
  brand: product?.brand ?? '',
  stock: product?.stock != null ? String(product.stock) : '',
});

/**
 * Builds the payload expected by the API from the editable form values.
 * @param {{
 *   name: string;
 *   description: string;
 *   price: string;
 *   imageUrl: string;
 *   imageFile: File | null;
 *   brand: string;
 *   stock: string;
 * }} form
 */
export const buildProductPayload = (form) => {
  const price = Number.parseFloat(form.price);
  const stock = Number.parseInt(form.stock, 10);
  if (Number.isNaN(price) || Number.isNaN(stock)) {
    return null;
  }
  return {
    body: {
      name: form.name.trim(),
      description: form.description.trim(),
      brand: form.brand.trim(),
      price,
      stock,
    },
    imageFile: form.imageFile,
    imageUrl: form.imageUrl.trim(),
  };
};
