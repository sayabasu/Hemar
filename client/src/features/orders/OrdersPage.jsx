import { useEffect, useState } from 'react';
import { Alert, Button, Chip, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
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
    <Stack spacing={5}>
      <Stack spacing={1}>
        <Typography variant="h3">Your order history</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Track every purchase and its journey from preparation to delivery in one elegant view.
        </Typography>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      {orders.length ? (
        <Grid container spacing={3}>
          {orders.map((order) => {
            const statusColor =
              order.status === 'DELIVERED' || order.status === 'COMPLETED'
                ? 'success'
                : order.status === 'SHIPPED'
                  ? 'info'
                  : 'warning';

            return (
              <Grid item xs={12} md={6} key={order.id}>
                <Paper sx={{ p: { xs: 3, md: 4 }, height: '100%' }}>
                  <Stack spacing={2.5} height="100%">
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Order ID
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          #{order.id}
                        </Typography>
                      </Stack>
                      <Chip label={order.status} color={statusColor} variant="filled" />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Placed on {new Date(order.createdAt).toLocaleString()}
                    </Typography>
                    <Divider />
                    <Stack spacing={1.5} flexGrow={1}>
                      {order.orderItems.map((item) => (
                        <Stack direction="row" justifyContent="space-between" key={item.product.id}>
                          <Stack spacing={0.5}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {item.product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.product.brand}
                            </Typography>
                          </Stack>
                          <Stack spacing={0.5} alignItems="flex-end">
                            <Typography variant="subtitle2" color="text.secondary">
                              Qty {item.quantity}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              ${(Number(item.product.price) * item.quantity).toFixed(2)}
                            </Typography>
                          </Stack>
                        </Stack>
                      ))}
                    </Stack>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1" color="text.secondary">
                        Order total
                      </Typography>
                      <Typography variant="h5" color="primary">
                        ${Number(order.total).toFixed(2)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        !error && (
          <Paper sx={{ p: { xs: 4, md: 6 }, textAlign: 'center' }}>
            <Stack spacing={2} alignItems="center">
              <Typography variant="h5">No orders just yet</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
                Once you place an order, you’ll see its status, device details, and totals right here.
              </Typography>
              <Button variant="contained" color="primary" component={RouterLink} to="/">
                Start exploring
              </Button>
            </Stack>
          </Paper>
        )
      )}
    </Stack>
  );
};

export default OrdersPage;
