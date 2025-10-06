import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from '@mui/material';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  imageUrl: '',
  brand: '',
  stock: '',
};

/**
 * Renders the product creation form for administrators.
 * @param {{
 *   onSubmit: (payload: {
 *     name: string;
 *     description: string;
 *     price: number;
 *     imageUrl: string;
 *     brand: string;
 *     stock: number;
 *   }) => Promise<boolean>;
 *   isSubmitting: boolean;
 * }} props
 */
export const AdminProductForm = ({ onSubmit, isSubmitting }) => {
  const [form, setForm] = useState(emptyForm);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
      brand: form.brand.trim(),
      price: Number.parseFloat(form.price),
      stock: Number.parseInt(form.stock, 10),
    };
    if (Number.isNaN(payload.price) || Number.isNaN(payload.stock)) {
      return;
    }
    const created = await onSubmit(payload);
    if (created) {
      setForm(emptyForm);
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
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Product name"
                value={form.name}
                onChange={handleChange('name')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Brand"
                value={form.brand}
                onChange={handleChange('brand')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                type="number"
                inputProps={{ step: '0.01', min: '0' }}
                label="Price (USD)"
                value={form.price}
                onChange={handleChange('price')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                type="number"
                inputProps={{ min: '0' }}
                label="Stock"
                value={form.stock}
                onChange={handleChange('stock')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                minRows={3}
                label="Description"
                value={form.description}
                onChange={handleChange('description')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Image URL"
                value={form.imageUrl}
                onChange={handleChange('imageUrl')}
              />
            </Grid>
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
