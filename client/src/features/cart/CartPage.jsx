import { useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import { api } from '../../lib/api.js';

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState({ shippingName: '', shippingPhone: '', shippingAddr: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const total = cart.reduce((sum, item) => sum + item.quantity * Number(item.product.price), 0);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }
    try {
      const payload = {
        ...shipping,
        items: cart.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
      };
      await api.post('/orders', payload);
      clearCart();
      setSuccess('Order placed successfully!');
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    }
  };

  return (
    <Stack spacing={5}>
      <Stack spacing={1}>
        <Typography variant="h3">Your curated bag</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Secure checkout with encrypted payment and next-day dispatch on select devices.
        </Typography>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} lg={7}>
          <Paper sx={{ p: { xs: 2.5, md: 3.5 }, height: '100%' }}>
            <Stack spacing={3}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">Items</Typography>
                <Chip label={`${cart.length} ${cart.length === 1 ? 'item' : 'items'}`} color="primary" variant="outlined" />
              </Stack>
              <List sx={{ width: '100%' }}>
                {cart.map(({ product, quantity }) => (
                  <ListItem
                    key={product.id}
                    alignItems="flex-start"
                    secondaryAction={
                      <Stack spacing={1} alignItems="flex-end">
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          ${(Number(product.price) * quantity).toFixed(2)}
                        </Typography>
                        <Button color="secondary" size="small" onClick={() => removeFromCart(product.id)}>
                          Remove
                        </Button>
                      </Stack>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar src={product.imageUrl} variant="rounded" alt={product.name} sx={{ width: 64, height: 64 }} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {product.name}
                          </Typography>
                          <Chip label={`x${quantity}`} size="small" color="primary" variant="filled" />
                        </Stack>
                      }
                      secondary={`$${Number(product.price).toFixed(2)} each · ${product.brand}`}
                    />
                  </ListItem>
                ))}
              </List>
              {!cart.length && (
                <Stack spacing={2} alignItems="center" sx={{ py: 6 }}>
                  <Typography variant="h6">Your bag feels light.</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Browse the catalog to discover the next device that fits your lifestyle.
                  </Typography>
                  <Button variant="contained" component={RouterLink} to="/">
                    Explore catalog
                  </Button>
                </Stack>
              )}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Stack spacing={3}>
            <Paper sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <Stack spacing={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(37,99,235,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <LocalShippingRoundedIcon color="primary" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Fast & secure shipping
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Complimentary express delivery on orders above $499.
                    </Typography>
                  </Box>
                </Stack>
                <Divider />
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">Subtotal</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      ${total.toFixed(2)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">Shipping</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {total >= 499 || !cart.length ? 'Free' : '$12.00'}
                    </Typography>
                  </Stack>
                  <Divider />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h5" color="primary">${(total + (total >= 499 || !cart.length ? 0 : 12)).toFixed(2)}</Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Paper>

            <Paper sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <Stack spacing={2.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LockOutlinedIcon color="primary" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Shipping details
                  </Typography>
                </Stack>
                <TextField
                  label="Full name"
                  value={shipping.shippingName}
                  onChange={(event) => setShipping((prev) => ({ ...prev, shippingName: event.target.value }))}
                />
                <TextField
                  label="Phone"
                  value={shipping.shippingPhone}
                  onChange={(event) => setShipping((prev) => ({ ...prev, shippingPhone: event.target.value }))}
                />
                <TextField
                  label="Address"
                  multiline
                  minRows={3}
                  value={shipping.shippingAddr}
                  onChange={(event) => setShipping((prev) => ({ ...prev, shippingAddr: event.target.value }))}
                />
                <Button
                  variant="contained"
                  size="large"
                  disabled={!cart.length}
                  onClick={handleCheckout}
                >
                  Complete secure checkout
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default CartPage;
