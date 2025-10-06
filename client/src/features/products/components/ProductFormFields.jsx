import { Grid, TextField } from '@mui/material';

/**
 * Shared form fields for product management.
 * @param {{
 *   form: {
 *     name: string;
 *     description: string;
 *     price: string;
 *     imageUrl: string;
 *     brand: string;
 *     stock: string;
 *   };
 *   onChange: (field: string) => (event: import('react').ChangeEvent<HTMLInputElement>) => void;
 * }} props
 */
export const ProductFormFields = ({ form, onChange }) => (
  <>
    <Grid item xs={12} md={6}>
      <TextField required fullWidth label="Product name" value={form.name} onChange={onChange('name')} />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField required fullWidth label="Brand" value={form.brand} onChange={onChange('brand')} />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        required
        fullWidth
        type="number"
        inputProps={{ step: '0.01', min: '0' }}
        label="Price (USD)"
        value={form.price}
        onChange={onChange('price')}
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
        onChange={onChange('stock')}
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
        onChange={onChange('description')}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        required
        fullWidth
        label="Image URL"
        value={form.imageUrl}
        onChange={onChange('imageUrl')}
      />
    </Grid>
  </>
);
