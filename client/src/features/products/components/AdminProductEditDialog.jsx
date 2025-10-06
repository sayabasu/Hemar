import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { ProductFormFields } from './ProductFormFields.jsx';
import { buildProductPayload, createEmptyProductForm, mapProductToFormValues } from './formUtils.js';

/**
 * Modal dialog used to edit an existing product.
 * @param {{
 *   open: boolean;
 *   product: import('../../../shared/types/products.js').Product | null;
 *   onClose: () => void;
 *   onSubmit: (payload: ReturnType<typeof buildProductPayload>) => Promise<boolean>;
 *   isSubmitting: boolean;
 * }} props
 */
export const AdminProductEditDialog = ({ open, product, onClose, onSubmit, isSubmitting }) => {
  const [form, setForm] = useState(createEmptyProductForm());

  useEffect(() => {
    if (open && product) {
      setForm(mapProductToFormValues(product));
    } else {
      setForm(createEmptyProductForm());
    }
  }, [open, product]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = buildProductPayload(form);
    if (!payload) {
      return;
    }
    const updated = await onSubmit(payload);
    if (updated) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit product</DialogTitle>
      <DialogContent>
        <Box component="form" id="admin-product-edit-form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Grid container spacing={2.5}>
            <ProductFormFields form={form} onChange={handleChange} />
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} disabled={isSubmitting} color="inherit">
          Cancel
        </Button>
        <Button
          form="admin-product-edit-form"
          type="submit"
          variant="contained"
          startIcon={<SaveRoundedIcon />}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving…' : 'Update product'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
