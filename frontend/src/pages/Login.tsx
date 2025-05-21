import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import authService from '../services/auth.service';
import { setUser } from '../store/slices/authSlice';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Divider,
  Stack,
  Container,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

// Màu xanh dương chủ đạo
const BLUE = '#1976d2';

const LeftBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(120deg, ${BLUE} 80%, #42a5f5 100%)`,
  color: '#fff',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 0,
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const BgImage = styled('img')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  opacity: 0.18,
  zIndex: 1,
});

const ContentBox = styled(Box)({
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Lấy đường dẫn trước đó từ state (nếu có)
  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.login(email, password);
      dispatch(setUser(response.user));
      // Chuyển hướng về trang trước đó hoặc trang chủ
      navigate(from, { replace: true });
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Bên trái: Logo + Slogan + Background */}
      <LeftBox flex={{ xs: '0 0 0', md: '1 1 0%' }} display={{ xs: 'none', md: 'flex' }}>
        <BgImage src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" alt="bg" />
        <ContentBox>
          <ShoppingBagIcon sx={{ fontSize: 120, mb: 2 }} />
          <Typography variant="h3" fontWeight={700} sx={{ mb: 2, letterSpacing: 1 }}>
            Spring Commerce
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 400 }}>
            Nền tảng thương mại điện tử yêu thích ở Việt Nam
          </Typography>
        </ContentBox>
      </LeftBox>

      {/* Bên phải: Form đăng nhập */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
          <Typography component="h1" variant="h5" align="center" sx={{ mb: 3 }}>
            Đăng nhập
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              Đăng nhập
            </Button>
            <Divider sx={{ my: 2 }}>HOẶC</Divider>
            <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
              <Button
                variant="outlined"
                startIcon={<FacebookIcon sx={{ color: '#1877f3' }} />}
                sx={{ textTransform: 'none', bgcolor: '#fff', borderColor: '#eee', color: '#333', minWidth: 120 }}
              >
                Facebook
              </Button>
              <Button
                variant="outlined"
                startIcon={<GoogleIcon sx={{ color: '#ea4335' }} />}
                sx={{ textTransform: 'none', bgcolor: '#fff', borderColor: '#eee', color: '#333', minWidth: 120 }}
              >
                Google
              </Button>
            </Stack>
            <Typography align="center">
              Chưa có tài khoản?{' '}
              <Button
                variant="text"
                sx={{ color: BLUE, textTransform: 'none', fontWeight: 700, p: 0, minWidth: 0 }}
                onClick={() => navigate('/register')}
              >
                Đăng ký ngay
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;