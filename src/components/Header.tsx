import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import {
  Chat as ChatIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 'bold' }}
        >
          学園祭案内チャットボット
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            color="inherit"
            startIcon={<ChatIcon />}
            onClick={() => navigate('/')}
            sx={{
              backgroundColor: location.pathname === '/' ? 'rgba(255,255,255,0.1)' : 'transparent',
            }}
          >
            チャット
          </Button>
          
          <Button
            color="inherit"
            startIcon={<AdminIcon />}
            onClick={() => navigate('/admin')}
            sx={{
              backgroundColor: location.pathname === '/admin' ? 'rgba(255,255,255,0.1)' : 'transparent',
            }}
          >
            管理画面
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
