import { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { useAuth } from './AuthContext.jsx';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          width: { xs: '100%', sm: 440 },
          p: { xs: 4, md: 5 },
          borderRadius: 4,
          background: 'linear-gradient(160deg, rgba(255,255,255,0.95), rgba(226,232,240,0.9))',
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.12)',
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ShieldOutlinedIcon />}
              sx={{ alignSelf: 'flex-start' }}
              disabled
            >
              Secure access
            </Button>
            <Typography variant="h4">Welcome back</Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to manage your cart, track orders, and unlock exclusive previews.
            </Typography>
          </Stack>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Button variant="contained" type="submit" size="large" endIcon={<LoginRoundedIcon />}>
            Sign in
          </Button>
          <Typography variant="body2" color="text.secondary">
            Don&apos;t have an account?{' '}
            <Link component={RouterLink} to="/register" underline="hover">
              Join Hemar today
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default LoginPage;
