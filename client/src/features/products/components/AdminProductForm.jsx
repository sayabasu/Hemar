import { useState } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Grid } from '@mui/material';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { ProductFormFields } from './ProductFormFields.jsx';
import { buildProductPayload, createEmptyProductForm } from './formUtils.js';

/**
 * Renders the product creation form for administrators.
 * @param {{
 *   onSubmit: (payload: ReturnType<typeof buildProductPayload>) => Promise<boolean>;
 *   isSubmitting: boolean;
 * }} props
 */
export const AdminProductForm = ({ onSubmit, isSubmitting }) => {
  const [form, setForm] = useState(createEmptyProductForm());
  const [fileInputKey, setFileInputKey] = useState(() => Date.now());

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleFileSelect = (file) => {
    setForm((prev) => ({ ...prev, imageFile: file }));
    setFileInputKey(Date.now());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = buildProductPayload(form);
    if (!payload) {
      return;
    }
    const created = await onSubmit(payload);
    if (created) {
      setForm(createEmptyProductForm());
      setFileInputKey(Date.now());
    }
  };

  return (
    <Card component="section" elevation={2}>
      <CardHeader
        title="Add a new product"
        subheader="Provide the core catalog details. Stock updates immediately for the storefront."
      />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2.5}>
            <ProductFormFields
              form={form}
              onChange={handleChange}
              onFileSelect={handleFileSelect}
              fileInputKey={fileInputKey}
            />
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<AddCircleOutlineRoundedIcon />}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving…' : 'Create product'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};
