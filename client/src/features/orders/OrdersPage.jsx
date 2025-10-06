import { useEffect, useState } from 'react';
import {
  Alert,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { api } from '../../lib/api.js';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get('/orders/mine')
      .then((response) => setOrders(response.data.orders))
      .catch(() => setError('Unable to load orders'));
  }, []);

  return (
    <Stack spacing={3}>
      <Typography variant="h4">My Orders</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>
                  <Chip label={order.status} color="primary" variant="outlined" />
                </TableCell>
                <TableCell>
                  {order.orderItems.map((item) => `${item.product.name} x${item.quantity}`).join(', ')}
                </TableCell>
                <TableCell>${Number(order.total).toFixed(2)}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!orders.length && !error && <Typography sx={{ p: 2 }}>You have no orders yet.</Typography>}
      </TableContainer>
    </Stack>
  );
};

export default OrdersPage;
