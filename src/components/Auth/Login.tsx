import { Alert, Box, Button, Container, Paper, Snackbar, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showStorageWarning, setShowStorageWarning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if localStorage is available
    if (!AuthService.isStorageAvailable()) {
      setShowStorageWarning(true);
    }
    
    // If user is already authenticated, redirect to dashboard
    if (AuthService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!AuthService.isStorageAvailable()) {
      setError('Local storage is not available. Authentication requires browser storage.');
      return;
    }
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await AuthService.login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontWeight: 800,
              color: 'primary.dark',
              mb: 2,
              fontSize: { xs: '2rem', sm: '2.5rem' },
              textShadow: '0 2px 4px rgba(0,0,0,0.05)',
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '4px',
                borderRadius: '2px',
                backgroundColor: 'primary.main',
              }
            }}
          >
            Welcome Back!
          </Typography>
          <Typography 
            variant="body1" 
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '1rem', sm: '1.1rem' },
              maxWidth: '400px',
              margin: '0 auto',
              mt: 3,
              lineHeight: 1.8,
              fontWeight: 500
            }}
          >
            Manage your daily tasks efficiently and stay organized with Task-Lyst
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4 },
            width: '100%',
            background: '#ffffff',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.3)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #4FD1C5 0%, #63e6be 100%)',
            }
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f8fafc',
                  '&.Mui-focused': {
                    '& fieldset': {
                      borderWidth: '2px',
                    }
                  }
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f8fafc',
                  '&.Mui-focused': {
                    '& fieldset': {
                      borderWidth: '2px',
                    }
                  }
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500
                }
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 4,
                mb: 2,
                py: 1.8,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(90deg, #4FD1C5 0%, #63e6be 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #38a89d 0%, #4FD1C5 100%)',
                }
              }}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/register')}
              sx={{
                mt: 1,
                color: 'text.secondary',
                fontSize: '0.95rem',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: 'primary.main',
                },
              }}
            >
              Don't have an account? <span style={{ marginLeft: '4px', color: '#4FD1C5', fontWeight: 600 }}>Sign Up</span>
            </Button>
          </Box>
        </Paper>
      </Box>
      <Snackbar
        open={showStorageWarning}
        autoHideDuration={6000}
        onClose={() => setShowStorageWarning(false)}
        message="Warning: Local storage is not available. Login functionality requires browser storage."
      />
    </Container>
  );
};

export default Login; 