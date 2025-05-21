import React, { useState } from 'react';
import { AppBar, Toolbar, Box, Button, IconButton, InputBase, Typography, Badge, Container, Avatar, Menu, MenuItem, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LanguageIcon from '@mui/icons-material/Language';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { clearUser } from '../../store/slices/authSlice';
import { clearCart } from '../../store/slices/cartSlice';
import SearchDialog from '../SearchDialog';
import {
    ShoppingCart as CartIcon,
    Person as PersonIcon,
    AccountCircle,
    ShoppingBag,
    Logout
} from '@mui/icons-material';

const menuLinks = [
  'Tải ứng dụng',
  'Kết nối',
];

const searchTags = [
  'Máy Quạt Cầm Tay',
  'Set Đồ Quần Ống Rộng',
  'Đẹp Nữ Màu Đen',
  'Váy Chế Vai',
  'Gấu Bông To Giá Rẻ 1k',
  'Ốp iPhone Xinh Cute',
];

const Header: React.FC = () => {
  const { items } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(clearUser());
    dispatch(clearCart());
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    navigate('/login');
    handleClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  const handleOrders = () => {
    navigate('/orders');
    handleClose();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/products?name=%${encodeURIComponent(searchText.trim())}%`);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Top bar */}
      <Box
        sx={{
          background: 'linear-gradient(120deg, #1976d2 80%, #42a5f5 100%)',
          color: 'white',
          fontSize: 13,
          px: 2,
          py: 0.5,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          {menuLinks.map((text, idx) => (
            <React.Fragment key={text}>
              {idx > 0 && <span>|</span>}
              <span>{text}</span>
            </React.Fragment>
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <IconButton size="small" sx={{ color: 'white' }}><NotificationsIcon fontSize="small" /></IconButton>
          <span>Thông Báo</span>
          <span>|</span>
          <IconButton size="small" sx={{ color: 'white' }}><HelpOutlineIcon fontSize="small" /></IconButton>
          <span>Hỗ Trợ</span>
          <span>|</span>
          <IconButton size="small" sx={{ color: 'white' }}><LanguageIcon fontSize="small" /></IconButton>
          <span>Tiếng Việt</span>
          <span>|</span>
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={handleMenu}
                sx={{
                  p: 0,
                  '&:hover': { backgroundColor: 'transparent' }
                }}
              >
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: 'primary.main',
                    cursor: 'pointer',
                  }}
                >
                  {user?.firstname?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Box>
          ) : (
            <>
              <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Đăng Ký</Link>
              <span>|</span>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Đăng Nhập</Link>
            </>
          )}
        </Box>
      </Box>
      {/* Main bar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'linear-gradient(120deg, #1976d2 80%, #42a5f5 100%)',
          color: 'white',
          boxShadow: 'none',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 64, display: 'flex', alignItems: 'center' }}>
            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
              <Box sx={{
                width: 40, height: 40, bgcolor: 'white', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1
              }}>
                <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 'bold' }}>S</Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Spring Commerce</Typography>
            </Link>
            {/* Search */}
            <Box component="form" onSubmit={handleSearch} sx={{ flex: 1, mx: 4 }}>
              <Box sx={{ display: 'flex', bgcolor: 'white', borderRadius: 1, overflow: 'hidden' }}>
                <InputBase
                  placeholder="Spring Commerce - Mua sắm thả ga!"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  sx={{ flex: 1, px: 2, py: 1 }}
                />
                <Button type="submit" sx={{ bgcolor: '#1976d2', color: 'white', borderRadius: 0, px: 3, minWidth: 0, '&:hover': { bgcolor: '#1565c0' } }}>
                  <SearchIcon />
                </Button>
                <Button 
                  onClick={() => setSearchDialogOpen(true)}
                  sx={{ bgcolor: '#1976d2', color: 'white', borderRadius: 0, px: 3, minWidth: 0, '&:hover': { bgcolor: '#1565c0' } }}
                >
                  <FilterListIcon />
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 0.5, flexWrap: 'wrap' }}>
                {searchTags.map(tag => (
                  <Typography 
                    key={tag} 
                    variant="caption" 
                    sx={{ color: 'white', cursor: 'pointer' }}
                    onClick={() => navigate(`/products?name=${encodeURIComponent(tag)}`)}
                  >
                    {tag}
                  </Typography>
                ))}
              </Box>
            </Box>
            {/* Cart */}
            <Link to="/cart" style={{ color: 'white', position: 'relative' }}>
              <IconButton sx={{ color: 'white' }}>
                <Badge badgeContent={items.length} color="error">
                  <CartIcon fontSize="large" />
                </Badge>
              </IconButton>
            </Link>
          </Toolbar>
        </Container>
      </AppBar>

      <SearchDialog open={searchDialogOpen} onClose={() => setSearchDialogOpen(false)} />

      {user && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
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
          <MenuItem onClick={handleProfile}>
            <AccountCircle sx={{ mr: 1 }} /> Tài khoản của tôi
          </MenuItem>
          <MenuItem onClick={handleOrders}>
            <ShoppingBag sx={{ mr: 1 }} /> Đơn mua
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <Logout sx={{ mr: 1 }} /> Đăng xuất
          </MenuItem>
        </Menu>
      )}
    </Box>
  );
};

export default Header; 