import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { Button, Grid, Stack, TextField, Typography } from '@mui/material';

/**
 * Shared form fields for product management.
 * @param {{
 *   form: {
 *     name: string;
 *     description: string;
 *     price: string;
 *     imageUrl: string;
 *     imageFile: File | null;
 *     brand: string;
 *     stock: string;
 *   };
 *   onChange: (field: string) => (event: import('react').ChangeEvent<HTMLInputElement>) => void;
 *   onFileSelect: (file: File | null) => void;
 *   fileInputKey?: number | string;
 * }} props
 */
export const ProductFormFields = ({ form, onChange, onFileSelect, fileInputKey }) => (
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
      <Stack spacing={1} alignItems="flex-start">
        <Button
          component="label"
          variant="outlined"
          startIcon={<CloudUploadRoundedIcon />}
        >
          {form.imageFile ? 'Replace image' : 'Upload image'}
          <input
            key={fileInputKey}
            hidden
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              onFileSelect(file);
            }}
          />
        </Button>
        <Typography variant="caption" color="text.secondary">
          Accepted formats: JPG, PNG, GIF, SVG, WebP.
        </Typography>
        {form.imageFile ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">{form.imageFile.name}</Typography>
            <Button
              size="small"
              color="inherit"
              startIcon={<DeleteOutlineRoundedIcon />}
              onClick={() => onFileSelect(null)}
            >
              Remove
            </Button>
          </Stack>
        ) : form.imageUrl ? (
          <Typography variant="body2" color="text.secondary">
            Current image will be kept unless a new file is uploaded.
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No image selected yet.
          </Typography>
        )}
      </Stack>
    </Grid>
  </>
);
