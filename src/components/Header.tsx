import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Chat as ChatIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
  Storage as RAGIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleAdminClick = () => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin');
    } else {
      navigate('/admin/login');
    }
  };

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
          {location.pathname.startsWith('/admin') ? (
            // 管理者向けナビゲーション
            <>
              <Chip 
                icon={<SecurityIcon />} 
                label="管理者モード" 
                color="warning" 
                size="small" 
              />
              <Button
                color="inherit"
                startIcon={<ChatIcon />}
                onClick={() => navigate('/')}
              >
                来場者画面
              </Button>
              <Button
                color="inherit"
                startIcon={<RAGIcon />}
                onClick={() => navigate('/admin/rag')}
                sx={{
                  backgroundColor: location.pathname === '/admin/rag' ? 'rgba(255,255,255,0.1)' : 'transparent',
                }}
              >
                RAG管理
              </Button>
            </>
          ) : (
            // 来場者向けナビゲーション
            <>
              <Button
                color="inherit"
                startIcon={<ChatIcon />}
                onClick={() => navigate('/')}
                sx={{
                  backgroundColor: location.pathname === '/' || location.pathname === '/chat' ? 'rgba(255,255,255,0.1)' : 'transparent',
                }}
              >
                チャット
              </Button>
              
              {isAuthenticated && isAdmin && (
                <Button
                  color="inherit"
                  startIcon={<AdminIcon />}
                  onClick={() => navigate('/admin')}
                >
                  管理画面
                </Button>
              )}
              
              {!isAuthenticated && (
                <Button
                  color="inherit"
                  startIcon={<AdminIcon />}
                  onClick={() => navigate('/admin/login')}
                  size="small"
                >
                  管理者
                </Button>
              )}
            </>
          )}

          {/* 管理者メニュー - 認証済みの場合のみ表示 */}
          {isAuthenticated && isAdmin && (
            <>
              <IconButton
                size="large"
                aria-label="管理者メニュー"
                aria-controls="admin-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <AccountIcon />
              </IconButton>
              <Menu
                id="admin-menu"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  ログアウト
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
