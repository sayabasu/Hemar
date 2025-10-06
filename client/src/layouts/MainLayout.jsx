import { useCallback, useMemo, useState } from 'react';
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
import { alpha, styled } from '@mui/material/styles';
import { useAuth } from '../features/auth/AuthContext.jsx';
import { useCart } from '../features/cart/CartContext.jsx';

const Root = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #e0f2fe 0%, #e4ecff 42%, #f8fafc 100%)',
  color: theme.palette.text.primary,
  display: 'flex',
  flexDirection: 'column',
}));

const HeaderBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(120deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 58, 138, 0.88) 45%, rgba(14, 116, 144, 0.85) 100%)',
  color: theme.palette.common.white,
  backdropFilter: 'blur(18px)',
  borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.12)}`,
  boxShadow: '0 24px 48px rgba(15, 23, 42, 0.35)',
  borderRadius: 0,
}));

const HeaderToolbar = styled(Toolbar)(() => ({
  minHeight: 88,
}));

const Brand = styled(Typography)(() => ({
  fontWeight: 800,
  fontSize: 'clamp(1.75rem, 2vw + 1rem, 2.4rem)',
  letterSpacing: '-0.08em',
  backgroundImage: 'linear-gradient(120deg, #fb923c 0%, #facc15 25%, #38bdf8 65%, #6366f1 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  filter: 'drop-shadow(0 6px 18px rgba(15, 23, 42, 0.35))',
  lineHeight: 1,
  cursor: 'pointer',
}));

const NavContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  padding: theme.spacing(2.5, 3),
}));

const BrandLink = styled(Stack)(() => ({
  textDecoration: 'none',
}));

const Tagline = styled(Typography)(() => ({
  fontSize: '0.65rem',
  letterSpacing: '0.48em',
  color: 'rgba(255, 255, 255, 0.72)',
  fontWeight: 600,
}));

const NavButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  color: alpha(theme.palette.common.white, 0.88),
  borderRadius: 999,
  paddingInline: theme.spacing(2.5),
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    color: theme.palette.common.white,
    backgroundColor: alpha(theme.palette.common.white, 0.12),
  },
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: 999,
  paddingInline: theme.spacing(2.8),
  background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 48%, #c084fc 100%)',
  boxShadow: '0 20px 35px rgba(99, 102, 241, 0.35)',
  color: theme.palette.common.white,
  '&:hover': {
    background: 'linear-gradient(135deg, #0ea5e9 0%, #4f46e5 48%, #a855f7 100%)',
    boxShadow: '0 18px 32px rgba(79, 70, 229, 0.45)',
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: 999,
  paddingInline: theme.spacing(2.8),
  borderColor: alpha(theme.palette.common.white, 0.5),
  color: theme.palette.common.white,
  '&:hover': {
    borderColor: theme.palette.common.white,
    backgroundColor: alpha(theme.palette.common.white, 0.12),
  },
}));

const CartButton = styled(NavButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.common.white, 0.1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.18),
  },
}));

const MenuToggle = styled(IconButton)(({ theme }) => ({
  color: theme.palette.common.white,
  backgroundColor: alpha(theme.palette.common.white, 0.08),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.16),
  },
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: '80vw',
    maxWidth: 320,
    background: 'linear-gradient(160deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 64, 175, 0.9) 70%, rgba(56, 189, 248, 0.85) 100%)',
    color: theme.palette.common.white,
    borderLeft: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
    backdropFilter: 'blur(18px)',
    padding: theme.spacing(0, 3, 3),
  },
}));

const DrawerContent = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(4),
}));

const DrawerDescription = styled(Typography)(() => ({
  color: 'rgba(226, 232, 240, 0.72)',
}));

const DrawerDivider = styled(Divider)(({ theme }) => ({
  borderColor: alpha(theme.palette.common.white, 0.16),
  marginBlock: theme.spacing(2),
}));

const DrawerListItem = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  color: theme.palette.common.white,
  marginBottom: theme.spacing(0.5),
  '& .MuiListItemText-primary': {
    fontWeight: 500,
  },
  '& .MuiListItemText-secondary': {
    color: 'rgba(226, 232, 240, 0.68)',
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.12),
  },
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

  const navLinks = useMemo(() => {
    const links = [
      { label: 'Catalog', to: '/' },
      { label: 'My Orders', to: '/orders', requiresAuth: true },
    ];
    if (user?.role === 'ADMIN') {
      links.push({ label: 'Admin Console', to: '/admin/products', requiresRole: 'ADMIN' });
    }
    return links;
  }, [user?.role]);

  const canAccessLink = useCallback(
    (link) => {
      if (link.requiresRole) {
        return user?.role === link.requiresRole;
      }
      if (link.requiresAuth) {
        return Boolean(user);
      }
      return true;
    },
    [user]
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
      <HeaderBar position="sticky">
        <HeaderToolbar disableGutters>
          <NavContainer>
            <BrandLink direction="row" alignItems="center" spacing={1.5} component={Link} to="/">
              <Brand variant="h6">Hemar</Brand>
              <Tagline variant="overline">MOBILE</Tagline>
            </BrandLink>
            {isDesktop ? (
              <Stack direction="row" spacing={2} alignItems="center">
                {navLinks.filter(canAccessLink).map((item) => (
                  <NavButton key={item.to} component={Link} to={item.to} variant="text">
                    {item.label}
                  </NavButton>
                ))}
                <CartButton
                  component={Link}
                  to="/cart"
                  startIcon={
                    <Badge color="primary" badgeContent={cart.length} overlap="circular" max={99}>
                      <ShoppingBagOutlinedIcon />
                    </Badge>
                  }
                >
                  Cart
                </CartButton>
                {user ? (
                  <NavButton onClick={handleLogout} startIcon={<LogoutRoundedIcon />}>
                    Logout
                  </NavButton>
                ) : (
                  <Stack direction="row" spacing={1}>
                    <NavButton component={Link} to="/login" startIcon={<LoginRoundedIcon />}>
                      Login
                    </NavButton>
                    <PrimaryButton component={Link} to="/register" startIcon={<PersonAddAltRoundedIcon />}>
                      Join us
                    </PrimaryButton>
                  </Stack>
                )}
              </Stack>
            ) : (
              <MenuToggle onClick={handleToggleDrawer}>
                <MenuRoundedIcon />
              </MenuToggle>
            )}
          </NavContainer>
        </HeaderToolbar>
      </HeaderBar>
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

      <StyledDrawer anchor="right" open={mobileOpen} onClose={handleToggleDrawer}>
        <DrawerContent>
          <Stack spacing={1} mb={2}>
            <BrandLink component={Link} to="/" onClick={handleToggleDrawer}>
              <Brand variant="h6">Hemar</Brand>
            </BrandLink>
            <DrawerDescription variant="body2">
              Effortless shopping, curated phones.
            </DrawerDescription>
          </Stack>
          <DrawerDivider />
          <List>
            <DrawerListItem component={Link} to="/cart" onClick={handleToggleDrawer}>
              <ListItemText
                primary="Cart"
                secondary={cart.length ? `${cart.length} item${cart.length > 1 ? 's' : ''}` : 'Your bag is waiting'}
              />
            </DrawerListItem>
            {navLinks.filter(canAccessLink).map((item) => (
              <DrawerListItem key={item.to} component={Link} to={item.to} onClick={handleToggleDrawer}>
                <ListItemText primary={item.label} />
              </DrawerListItem>
            ))}
          </List>
          <DrawerDivider />
          {user ? (
            <SecondaryButton
              fullWidth
              variant="outlined"
              onClick={() => {
                handleLogout();
                handleToggleDrawer();
              }}
              startIcon={<LogoutRoundedIcon />}
            >
              Logout
            </SecondaryButton>
          ) : (
            <Stack spacing={1.5}>
              <PrimaryButton
                fullWidth
                component={Link}
                to="/login"
                onClick={handleToggleDrawer}
                startIcon={<LoginRoundedIcon />}
              >
                Login
              </PrimaryButton>
              <SecondaryButton
                fullWidth
                variant="outlined"
                component={Link}
                to="/register"
                onClick={handleToggleDrawer}
                startIcon={<PersonAddAltRoundedIcon />}
              >
                Create account
              </SecondaryButton>
            </Stack>
          )}
        </DrawerContent>
      </StyledDrawer>
    </Root>
  );
};
