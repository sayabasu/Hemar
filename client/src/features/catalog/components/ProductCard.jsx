import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
  Chip,
  Button,
  Box,
} from '@mui/material';
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded';
import { styled } from '@mui/material/styles';

const MediaWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
  '& img': {
    transition: 'transform 400ms ease',
  },
  '&:hover img': {
    transform: 'scale(1.05)',
  },
}));

const StockChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: theme.palette.common.white,
  color: theme.palette.text.primary,
  fontWeight: 600,
}));

export const ProductCard = ({ product, onAddToCart }) => {
  const stockTone = product.stock > 15 ? 'success' : product.stock > 5 ? 'warning' : 'error';

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <MediaWrapper>
        <CardMedia component="img" image={product.imageUrl} height="260" alt={product.name} loading="lazy" />
        <StockChip label={`${product.stock} in stock`} color={stockTone} size="small" />
      </MediaWrapper>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={2} height="100%">
          <Stack spacing={1}>
            <Chip label={product.brand} color="primary" variant="outlined" size="small" sx={{ alignSelf: 'flex-start' }} />
            <Typography variant="h6">{product.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {product.description}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mt="auto">
            <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
              ${Number(product.price).toFixed(2)}
            </Typography>
            <Button variant="contained" color="primary" endIcon={<AddShoppingCartRoundedIcon />} onClick={() => onAddToCart(product)}>
              Add to bag
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    imageUrl: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    stock: PropTypes.number.isRequired,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};
