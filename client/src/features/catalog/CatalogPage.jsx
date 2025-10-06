import { useEffect, useState } from 'react';
import {
  Alert,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { api } from '../../lib/api.js';
import { useCart } from '../cart/CartContext.jsx';
import { ProductCard } from './components/ProductCard.jsx';

const quickFilters = [
  { label: 'Flagship power', value: 'pro' },
  { label: 'Photography', value: 'camera' },
  { label: 'Foldables', value: 'fold' },
  { label: 'All-day battery', value: 'battery' },
];

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    setIsLoading(true);
    api
      .get('/products', { params: search ? { search } : {} })
      .then((response) => {
        setProducts(response.data.products);
        setError(null);
      })
      .catch(() => setError('Failed to load products'))
      .finally(() => setIsLoading(false));
  }, [search]);

  return (
    <Stack spacing={5}>
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(120deg, rgba(37,99,235,0.12) 0%, rgba(14,116,144,0.18) 100%)',
          p: { xs: 4, md: 6 },
        }}
      >
        <Stack spacing={3} direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Stack spacing={1} flex={1}>
            <Chip label="Curated for you" color="primary" variant="filled" sx={{ width: 'fit-content' }} />
            <Typography variant="h3" sx={{ maxWidth: 500 }}>
              Elevate your everyday with our handpicked lineup of modern smartphones.
            </Typography>
            <Typography variant="subtitle1" sx={{ maxWidth: 520 }}>
              Explore refined designs, pro-grade cameras, and intelligent performance with devices crafted for trendsetters.
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {quickFilters.map((filter) => (
                <Chip
                  key={filter.value}
                  label={filter.label}
                  variant={search.toLowerCase() === filter.value ? 'filled' : 'outlined'}
                  color="secondary"
                  onClick={() => setSearch(filter.value)}
                  sx={{ borderRadius: 999 }}
                />
              ))}
            </Stack>
          </Stack>
          <Stack spacing={2} sx={{ width: { xs: '100%', md: 340 } }}>
            <TextField
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search for devices, cameras, battery life..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: search ? (
                  <IconButton onClick={() => setSearch('')} aria-label="Clear search">
                    <ReplayRoundedIcon />
                  </IconButton>
                ) : (
                  <InputAdornment position="end">
                    <TuneRoundedIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Showing {products.length} curated picks
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={3}>
        {(isLoading ? Array.from({ length: 6 }) : products).map((product, index) => (
          <Grid item key={product?.id || index} xs={12} sm={6} lg={4}>
            {isLoading ? (
              <Skeleton variant="rounded" height={420} animation="wave" />
            ) : (
              <ProductCard product={product} onAddToCart={addToCart} />
            )}
          </Grid>
        ))}
      </Grid>

      {!products.length && !isLoading && !error && (
        <Stack alignItems="center" spacing={2} sx={{ py: 6 }}>
          <Typography variant="h5">No devices matched your search.</Typography>
          <Typography variant="body2" color="text.secondary">
            Adjust your keywords or explore our highlighted collections.
          </Typography>
          <Button variant="contained" onClick={() => setSearch('')} startIcon={<ReplayRoundedIcon />}>
            Reset search
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default CatalogPage;
