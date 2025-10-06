import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
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
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, width: 400 }}>
        <Stack spacing={2}>
          <Typography variant="h5">Create account</Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField name="name" label="Name" value={form.name} onChange={handleChange} fullWidth />
          <TextField name="email" label="Email" value={form.email} onChange={handleChange} fullWidth />
          <TextField
            name="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
          />
          <Button variant="contained" type="submit">
            Register
          </Button>
          <Typography variant="body2">
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
