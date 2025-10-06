import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
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
    <Stack spacing={3}>
      <Typography variant="h4">Your Cart</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <Paper>
        <List>
          {cart.map(({ product, quantity }) => (
            <ListItem key={product.id} secondaryAction={
              <Button color="secondary" onClick={() => removeFromCart(product.id)}>
                Remove
              </Button>
            }>
              <ListItemText
                primary={`${product.name} x ${quantity}`}
                secondary={`$${Number(product.price).toFixed(2)} each`}
              />
            </ListItem>
          ))}
        </List>
        {!cart.length && <Typography sx={{ p: 2 }}>Your cart is empty.</Typography>}
        <Divider />
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
        </Box>
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h6">Shipping details</Typography>
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
          <Button variant="contained" disabled={!cart.length} onClick={handleCheckout}>
            Checkout
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default CartPage;
