import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import authService from '../services/auth.service';
import { setUser } from '../store/slices/authSlice';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  InputLabel,
  FormControl,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
  backgroundImage: 'url(https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3)',
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

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.register(
        formData.firstname,
        formData.lastname,
        formData.email,
        formData.password
      );
      dispatch(setUser(response.user));
      navigate('/');
    } catch (err) {
      setError('Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Box sx={{ display: { xs: 'none', sm: 'block' }, width: { sm: '33%', md: '50%' } }}>
          <BackgroundImage>
            <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white', px: 4 }}>
              <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
                Chào mừng bạn đến với Spring Commerce
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Đăng ký ngay để trải nghiệm mua sắm tuyệt vời
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
                Đăng ký tài khoản
              </Typography>
              {error && (
                <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: '8px' }}>
                  {error}
                </Alert>
              )}
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Box sx={{ width: '100%' }}>
                    <StyledLabel>Tên</StyledLabel>
                    <StyledTextField
                      required
                      fullWidth
                      id="firstname"
                      name="firstname"
                      autoComplete="given-name"
                      value={formData.firstname}
                      onChange={handleChange}
                      placeholder="Nhập tên của bạn"
                    />
                  </Box>
                  <Box sx={{ width: '100%' }}>
                    <StyledLabel>Họ</StyledLabel>
                    <StyledTextField
                      required
                      fullWidth
                      id="lastname"
                      name="lastname"
                      autoComplete="family-name"
                      value={formData.lastname}
                      onChange={handleChange}
                      placeholder="Nhập họ của bạn"
                    />
                  </Box>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <StyledLabel>Email</StyledLabel>
                  <StyledTextField
                    required
                    fullWidth
                    id="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
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
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
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
                  Đăng ký
                </Button>
                <Button
                  fullWidth
                  variant="text"
                  onClick={() => navigate('/login')}
                  sx={{
                    mt: 1,
                    color: '#1a237e',
                    '&:hover': {
                      backgroundColor: 'rgba(26, 35, 126, 0.04)',
                    },
                  }}
                >
                  Đã có tài khoản? Đăng nhập ngay
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Register; 