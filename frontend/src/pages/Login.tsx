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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

// Tạo theme mới với font chữ hiện đại
const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#1a237e',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  palette: {
    primary: {
      main: '#1a237e',
    },
  },
});

const BackgroundImage = styled(Box)(({ theme }) => ({
  backgroundImage: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: '#666',
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-shrink': {
    transform: 'translate(14px, -9px) scale(0.75)',
    backgroundColor: 'white',
    padding: '0 4px',
  },
}));

const StyledLabel = styled(Typography)(({ theme }) => ({
  color: '#666',
  fontSize: '0.875rem',
  marginBottom: '8px',
  fontWeight: 500,
}));

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.login(email, password);
      dispatch(setUser(response.user));
      navigate(from, { replace: true });
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Box sx={{ display: { xs: 'none', sm: 'block' }, width: { sm: '33%', md: '50%' } }}>
          <BackgroundImage>
            <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white', px: 4 }}>
              <ShoppingBagIcon sx={{ fontSize: 80, mb: 2 }} />
              <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
                Chào mừng trở lại
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Đăng nhập để tiếp tục mua sắm
              </Typography>
            </Box>
          </BackgroundImage>
        </Box>
        <Box sx={{ width: { xs: '100%', sm: '67%', md: '50%' } }}>
          <Paper elevation={6} square sx={{ height: '100%' }}>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
                Đăng nhập
              </Typography>
              {error && (
                <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: '8px' }}>
                  {error}
                </Alert>
              )}
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                <Box sx={{ mb: 2 }}>
                  <StyledLabel>Email</StyledLabel>
                  <StyledTextField
                    required
                    fullWidth
                    id="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email của bạn"
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <StyledLabel>Mật khẩu</StyledLabel>
                  <StyledTextField
                    required
                    fullWidth
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu của bạn"
                  />
                </Box>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 4,
                    mb: 2,
                    py: 1.5,
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  Đăng nhập
                </Button>
                <Divider sx={{ my: 3 }}>HOẶC</Divider>
                <Stack direction="row" spacing={2} justifyContent="center" mb={3}>
                  <Button
                    variant="outlined"
                    startIcon={<FacebookIcon sx={{ color: '#1877f3' }} />}
                    sx={{
                      textTransform: 'none',
                      bgcolor: '#fff',
                      borderColor: '#eee',
                      color: '#333',
                      minWidth: 120,
                      borderRadius: '8px',
                      '&:hover': {
                        borderColor: '#1877f3',
                        backgroundColor: 'rgba(24, 119, 243, 0.04)',
                      },
                    }}
                  >
                    Facebook
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<GoogleIcon sx={{ color: '#ea4335' }} />}
                    sx={{
                      textTransform: 'none',
                      bgcolor: '#fff',
                      borderColor: '#eee',
                      color: '#333',
                      minWidth: 120,
                      borderRadius: '8px',
                      '&:hover': {
                        borderColor: '#ea4335',
                        backgroundColor: 'rgba(234, 67, 53, 0.04)',
                      },
                    }}
                  >
                    Google
                  </Button>
                </Stack>
                <Button
                  fullWidth
                  variant="text"
                  onClick={() => navigate('/register')}
                  sx={{
                    color: '#1a237e',
                    '&:hover': {
                      backgroundColor: 'rgba(26, 35, 126, 0.04)',
                    },
                  }}
                >
                  Chưa có tài khoản? Đăng ký ngay
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Login;