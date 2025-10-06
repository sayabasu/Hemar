import { AppBar, Toolbar, Typography, Box, Button, Stack } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext.jsx';
import { useCart } from '../features/cart/CartContext.jsx';

const NavButton = ({ to, children }) => (
  <Button component={Link} to={to} color="inherit">
    {children}
  </Button>
);

export const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cart } = useCart();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Hemar Mobile Store
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <NavButton to="/">Catalog</NavButton>
            <NavButton to="/cart">Cart ({cart.length})</NavButton>
            {user ? (
              <>
                <NavButton to="/orders">My Orders</NavButton>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavButton to="/login">Login</NavButton>
                <NavButton to="/register">Register</NavButton>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
      <Box component="main">{children}</Box>
    </Box>
  );
};
