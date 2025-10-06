import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Link, Paper, Stack, TextField, Typography } from '@mui/material';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import { useAuth } from './AuthContext.jsx';

const RegisterPage = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to register');
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
          width: { xs: '100%', sm: 460 },
          p: { xs: 4, md: 5 },
          borderRadius: 4,
          background: 'linear-gradient(170deg, rgba(255,255,255,0.96), rgba(229,231,235,0.92))',
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.12)',
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EmojiEventsOutlinedIcon />}
              sx={{ alignSelf: 'flex-start' }}
              disabled
            >
              Member perks
            </Button>
            <Typography variant="h4">Create your Hemar ID</Typography>
            <Typography variant="body1" color="text.secondary">
              Personalize your shopping experience and keep tabs on your premium devices.
            </Typography>
          </Stack>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField name="name" label="Full name" value={form.name} onChange={handleChange} fullWidth />
          <TextField name="email" label="Email address" value={form.email} onChange={handleChange} fullWidth />
          <TextField
            name="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
          />
          <Button variant="contained" type="submit" size="large" endIcon={<PersonAddAlt1RoundedIcon />}>
            Create account
          </Button>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" underline="hover">
              Sign in
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
