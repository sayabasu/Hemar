import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import { api } from '../../lib/api.js';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { AdminProductForm } from './components/AdminProductForm.jsx';
import { AdminProductEditDialog } from './components/AdminProductEditDialog.jsx';
import { uploadProductImage } from './lib/uploadProductImage.js';

const formatCurrency = (value) => {
  const amount = Number.isFinite(value) ? value : 0;
  return `$${amount.toFixed(2)}`;
};

/**
 * Administrative console that enables catalog management.
 * @returns {JSX.Element}
 */
const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/products');
      setProducts(response.data.products);
      setFetchError(null);
    } catch (error) {
      setFetchError('Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleCreate = useCallback(
    async (submission) => {
      setSubmitError(null);
      setSubmitSuccess(null);

      if (!submission?.imageFile) {
        setSubmitError('Please choose a product image before saving.');
        return false;
      }

      setIsSubmitting(true);
      try {
        const { fileUrl } = await uploadProductImage(submission.imageFile);
        await api.post('/products', { ...submission.body, imageUrl: fileUrl });
        setSubmitSuccess('Product added successfully.');
        await loadProducts();
        return true;
      } catch (error) {
        const message =
          error?.response?.data?.message || error?.message || 'Unable to create product. Check the fields and try again.';
        setSubmitError(message);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [loadProducts]
  );

  const handleUpdate = useCallback(
    async (id, submission) => {
      setSubmitError(null);
      setSubmitSuccess(null);
      setIsSubmitting(true);
      try {
        let imageUrl = submission.imageUrl;
        if (submission.imageFile) {
          const { fileUrl } = await uploadProductImage(submission.imageFile);
          imageUrl = fileUrl;
        }

        if (!imageUrl) {
          setSubmitError('Product image is required.');
          return false;
        }

        await api.put(`/products/${id}`, { ...submission.body, imageUrl });
        setSubmitSuccess('Product updated successfully.');
        await loadProducts();
        return true;
      } catch (error) {
        const message =
          error?.response?.data?.message || error?.message || 'Unable to update product. Check the fields and try again.';
        setSubmitError(message);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [loadProducts]
  );

  const productCount = useMemo(() => products.length, [products]);

  const handleEditClick = useCallback(
    (product) => {
      setSubmitError(null);
      setSubmitSuccess(null);
      setEditingProduct(product);
    },
    []
  );

  const handleEditClose = useCallback(() => {
    setEditingProduct(null);
  }, []);

  return (
    <Stack spacing={4}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          background: 'linear-gradient(135deg, rgba(14,116,144,0.08) 0%, rgba(30,64,175,0.12) 100%)',
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Stack direction="row" spacing={2} alignItems="center" flex={1}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              <Inventory2RoundedIcon />
            </Avatar>
            <Box>
              <Typography variant="h4">Admin Console</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage the Hemar catalog, add upcoming launches, and review inventory in real time.
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip color="primary" label={`${productCount} products`} />
            <Tooltip title="Refresh product list">
              <span>
                <IconButton onClick={loadProducts} disabled={isLoading}>
                  <RefreshRoundedIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Stack>
      </Paper>

      {submitSuccess && <Alert severity="success">{submitSuccess}</Alert>}
      {submitError && <Alert severity="error">{submitError}</Alert>}

      <AdminProductForm onSubmit={handleCreate} isSubmitting={isSubmitting} />

      <Stack spacing={2} component={Paper} elevation={1} sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Catalog overview</Typography>
          {isLoading && <Typography variant="caption">Refreshing…</Typography>}
        </Stack>
        {fetchError ? (
          <Alert severity="error">{fetchError}</Alert>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell>Updated</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography fontWeight={600}>{product.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {product.description
                            ? `${product.description.slice(0, 96)}${
                                product.description.length > 96 ? '…' : ''
                              }`
                            : 'No description provided'}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>{formatCurrency(Number(product.price ?? 0))}</TableCell>
                    <TableCell align="right">{product.stock}</TableCell>
                    <TableCell>
                      {new Date(product.updatedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit product">
                        <span>
                          <IconButton
                            onClick={() => handleEditClick(product)}
                            size="small"
                            aria-label="Edit product"
                          >
                            <EditRoundedIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {!products.length && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Stack alignItems="center" spacing={1} sx={{ py: 4 }}>
                        <Typography variant="subtitle1">No products yet</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Use the form above to add your first catalog item.
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Typography variant="caption" color="text.secondary">
          All operations are logged in the activity feed for audit purposes.
        </Typography>
      </Stack>
      <AdminProductEditDialog
        open={Boolean(editingProduct)}
        product={editingProduct}
        onClose={handleEditClose}
        isSubmitting={isSubmitting}
        onSubmit={(payload) => (editingProduct ? handleUpdate(editingProduct.id, payload) : Promise.resolve(false))}
      />
    </Stack>
  );
};

export default AdminProductsPage;
