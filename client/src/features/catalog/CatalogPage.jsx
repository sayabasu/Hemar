import { useEffect, useState } from 'react';
import {
  Alert,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { api } from '../../lib/api.js';
import { useCart } from '../cart/CartContext.jsx';

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    api
      .get('/products', { params: search ? { search } : {} })
      .then((response) => setProducts(response.data.products))
      .catch(() => setError('Failed to load products'));
  }, [search]);

  return (
    <Stack spacing={3}>
      <TextField
        label="Search for phones"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia component="img" image={product.imageUrl} height="200" alt={product.name} />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {product.brand}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  ${Number(product.price).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between' }}>
                <Typography variant="caption">Stock: {product.stock}</Typography>
                <IconButton
                  color="primary"
                  onClick={() => addToCart(product)}
                  aria-label={`Add ${product.name} to cart`}
                >
                  <AddShoppingCartIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {!products.length && !error && (
        <Stack alignItems="center" spacing={2}>
          <Typography>No phones found.</Typography>
          <Button onClick={() => setSearch('')}>Reset</Button>
        </Stack>
      )}
    </Stack>
  );
};

export default CatalogPage;
