import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import {
  alpha,
  AppBar,
  Avatar,
  Box,
  Container,
  Divider,
  IconButton,
  InputBase,
  ListItemIcon,
  Menu,
  MenuItem,
  Snackbar,
  Toolbar,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import TaskBoard from './tasks/TaskBoard';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState('');
  const [showStorageWarning, setShowStorageWarning] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  useEffect(() => {
    if (!AuthService.isStorageAvailable()) {
      setShowStorageWarning(true);
      return;
    }
    
    if (!AuthService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    const loadUserData = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        if (user) {
          setUserName(user.name);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        navigate('/login');
      }
    };
    
    loadUserData();
  }, [navigate]);

  const handleLogout = () => {
    handleClose();
    AuthService.logout();
    navigate('/login');
  };

  return (
    <div>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
          borderRadius: { xs: '0 0 16px 16px', sm: '0 0 24px 24px' },
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            background: 'linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
            zIndex: 0,
          }
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ gap: 2, py: 1 }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: { xs: 0, sm: 1 },
                fontSize: '1.5rem',
                fontWeight: 700,
                background: 'linear-gradient(to right, #ffffff, #e2e8f0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Task-Lyst
            </Typography>

            <Box 
              sx={{ 
                position: 'relative',
                borderRadius: '12px',
                backgroundColor: alpha('#fff', 0.15),
                '&:hover': {
                  backgroundColor: alpha('#fff', 0.25),
                },
                width: { xs: '100%', sm: 'auto' },
                flexGrow: { sm: 1 },
                ml: { sm: 3 },
                mr: { sm: 3 },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Box sx={{ 
                padding: '0 16px',
                height: '40px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}>
                <SearchIcon 
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)',
                    mr: 1,
                  }} 
                />
                <InputBase
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    color: '#fff',
                    width: '100%',
                    '& .MuiInputBase-input': {
                      padding: '8px 0',
                      width: '100%',
                      color: 'inherit',
                      '&::placeholder': {
                        color: 'rgba(255,255,255,0.7)',
                        opacity: 1,
                      },
                    },
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <IconButton 
                color="inherit" 
                sx={{ 
                  backgroundColor: alpha('#fff', 0.1),
                  '&:hover': {
                    backgroundColor: alpha('#fff', 0.2),
                  },
                }}
              >
                <NotificationsIcon />
              </IconButton>
              <IconButton 
                color="inherit"
                onClick={handleProfileClick}
                aria-controls={open ? 'profile-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                sx={{ 
                  backgroundColor: alpha('#fff', 0.1),
                  '&:hover': {
                    backgroundColor: alpha('#fff', 0.2),
                  },
                }}
              >
                <AccountCircleIcon />
              </IconButton>
              
              <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'profile-button',
                }}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    minWidth: 200,
                    borderRadius: '12px',
                    mt: 1.5,
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 18,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {userName || 'User'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                    Logged in
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
                  <Avatar sx={{ width: 24, height: 24, mr: 2, backgroundColor: '#2563eb' }}>
                    <AccountCircleIcon fontSize="small" />
                  </Avatar>
                  My Profile
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" sx={{ color: '#e11d48' }} />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'flex-start',
          borderLeft: '4px solid #3b82f6',
          pl: 3,
          py: 1,
          mb: 4
        }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '1.75rem', sm: '2.125rem' },
              color: '#1e293b',
              mb: 1,
              display: 'block',
              width: '100%',
              textAlign: 'left',
              letterSpacing: '-0.5px'
            }}
          >
            Welcome{userName ? `, ${userName}!` : ' to Task-Lyst!'} 
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} | Let's organize your tasks for today
          </Typography>
        </Box>
        
        <TaskBoard />
      </Container>
      
      <Snackbar
        open={showStorageWarning}
        autoHideDuration={6000}
        onClose={() => setShowStorageWarning(false)}
        message="Warning: Local storage is not available. Your session data may not be saved."
      />
    </div>
  );
};

export default Dashboard;