import { Alert, Box, Button, Container, Paper, Snackbar, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showStorageWarning, setShowStorageWarning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!AuthService.isStorageAvailable()) {
      setShowStorageWarning(true);
    }
    
    if (AuthService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!AuthService.isStorageAvailable()) {
      setError('Local storage is not available. Registration requires browser storage.');
      return;
    }
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await AuthService.register(name, email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Registration failed. Email may already be in use.');
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
                boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
              }
            }}
          >
            Create Account
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
            Join Task-Lyst today and take control of your daily productivity
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4 },
            width: '100%',
            background: '#ffffff',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59, 130, 246, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)',
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
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f8faff',
                  '&.Mui-focused': {
                    '& fieldset': {
                      borderWidth: '2px',
                      borderColor: 'primary.main',
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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f8faff',
                  '&.Mui-focused': {
                    '& fieldset': {
                      borderWidth: '2px',
                      borderColor: 'primary.main',
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f8faff',
                  '&.Mui-focused': {
                    '& fieldset': {
                      borderWidth: '2px',
                      borderColor: 'primary.main',
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
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f8faff',
                  '&.Mui-focused': {
                    '& fieldset': {
                      borderWidth: '2px',
                      borderColor: 'primary.main',
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
                background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #1d4ed8 0%, #2563eb 100%)',
                }
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/login')}
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
              Already have an account? <span style={{ marginLeft: '4px', color: '#2563eb', fontWeight: 600 }}>Sign In</span>
            </Button>
          </Box>
        </Paper>
      </Box>
      <Snackbar
        open={showStorageWarning}
        autoHideDuration={6000}
        onClose={() => setShowStorageWarning(false)}
        message="Warning: Local storage is not available. Registration functionality requires browser storage."
      />
    </Container>
  );
};

export default Register; 