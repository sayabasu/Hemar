import { useMemo, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Stack,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Badge,
  Container,
  useMediaQuery,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useAuth } from '../features/auth/AuthContext.jsx';
import { useCart } from '../features/cart/CartContext.jsx';

const Root = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #eef2ff 0%, #f4f6fb 40%, #ffffff 100%)',
  color: theme.palette.text.primary,
  display: 'flex',
  flexDirection: 'column',
}));

const Brand = styled(Typography)(() => ({
  fontWeight: 700,
  fontSize: '1.35rem',
  letterSpacing: '-0.05em',
  backgroundImage: 'linear-gradient(90deg, #f97316 0%, #38bdf8 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  cursor: 'pointer',
}));

const NavContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
}));

const MainContent = styled(Container)(({ theme }) => ({
  flex: 1,
  width: '100%',
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(8),
}));

const Footer = styled('footer')(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  backgroundColor: '#0f172a',
  color: theme.palette.common.white,
}));

export const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery((muiTheme) => muiTheme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = useMemo(
    () => [
      { label: 'Catalog', to: '/' },
      { label: 'My Orders', to: '/orders', protected: true },
    ],
    []
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleToggleDrawer = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Root>
      <AppBar position="sticky">
        <Toolbar disableGutters>
          <NavContainer>
            <Stack direction="row" alignItems="center" spacing={1.5} component={Link} to="/" sx={{ textDecoration: 'none' }}>
              <Brand variant="h6">Hemar</Brand>
              <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.85)', letterSpacing: '0.28em' }}>
                MOBILE
              </Typography>
            </Stack>
            {isDesktop ? (
              <Stack direction="row" spacing={2} alignItems="center">
                {navLinks
                  .filter((item) => !item.protected || user)
                  .map((item) => (
                    <Button key={item.to} component={Link} to={item.to} color="inherit" variant="text">
                      {item.label}
                    </Button>
                  ))}
                <Button
                  component={Link}
                  to="/cart"
                  color="inherit"
                  startIcon={
                    <Badge color="secondary" badgeContent={cart.length} overlap="circular" max={99}>
                      <ShoppingBagOutlinedIcon />
                    </Badge>
                  }
                >
                  Cart
                </Button>
                {user ? (
                  <Button color="inherit" onClick={handleLogout} startIcon={<LogoutRoundedIcon />}>
                    Logout
                  </Button>
                ) : (
                  <Stack direction="row" spacing={1}>
                    <Button component={Link} to="/login" color="inherit" startIcon={<LoginRoundedIcon />}> 
                      Login
                    </Button>
                    <Button component={Link} to="/register" color="secondary" variant="contained" startIcon={<PersonAddAltRoundedIcon />}>
                      Join us
                    </Button>
                  </Stack>
                )}
              </Stack>
            ) : (
              <IconButton color="inherit" onClick={handleToggleDrawer}>
                <MenuRoundedIcon />
              </IconButton>
            )}
          </NavContainer>
        </Toolbar>
      </AppBar>
      <MainContent component="main">{children}</MainContent>
      <Footer>
        <Container>
          <Stack spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }} direction={{ xs: 'column', md: 'row' }} justifyContent="space-between">
            <Stack spacing={1}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Designed for mobile tastemakers.
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.72)' }}>
                © {new Date().getFullYear()} Hemar Labs. Experience innovation with every device.
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Button component={Link} to="/" variant="outlined" color="inherit">
                Explore devices
              </Button>
              <Button component={Link} to="/cart" variant="contained" color="secondary">
                View cart
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Footer>

      <Drawer anchor="right" open={mobileOpen} onClose={handleToggleDrawer} PaperProps={{ sx: { width: '80vw', maxWidth: 320 } }}>
        <Box sx={{ px: 3, py: 4 }}>
          <Stack spacing={1} mb={2}>
            <Brand variant="h6" component={Link} to="/" onClick={handleToggleDrawer} sx={{ textDecoration: 'none' }}>
              Hemar
            </Brand>
            <Typography variant="body2" color="text.secondary">
              Effortless shopping, curated phones.
            </Typography>
          </Stack>
          <Divider />
          <List>
            <ListItemButton component={Link} to="/cart" onClick={handleToggleDrawer}>
              <ListItemText
                primary="Cart"
                secondary={cart.length ? `${cart.length} item${cart.length > 1 ? 's' : ''}` : 'Your bag is waiting'}
              />
            </ListItemButton>
            {navLinks
              .filter((item) => !item.protected || user)
              .map((item) => (
                <ListItemButton key={item.to} component={Link} to={item.to} onClick={handleToggleDrawer}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ))}
          </List>
          <Divider sx={{ my: 2 }} />
          {user ? (
            <Button fullWidth variant="contained" color="primary" onClick={() => { handleLogout(); handleToggleDrawer(); }} startIcon={<LogoutRoundedIcon />}>
              Logout
            </Button>
          ) : (
            <Stack spacing={1.5}>
              <Button fullWidth variant="contained" color="primary" component={Link} to="/login" onClick={handleToggleDrawer} startIcon={<LoginRoundedIcon />}>
                Login
              </Button>
              <Button fullWidth variant="outlined" color="secondary" component={Link} to="/register" onClick={handleToggleDrawer} startIcon={<PersonAddAltRoundedIcon />}>
                Create account
              </Button>
            </Stack>
          )}
        </Box>
      </Drawer>
    </Root>
  );
};
