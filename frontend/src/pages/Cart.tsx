import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setCartItems, setLoading, setError, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Card, CardContent, IconButton, TextField, Divider, CircularProgress, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { getShoppingCart, removeItemFromCart, clearShoppingCart } from '../services/cart.service';

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        dispatch(setLoading(true));
        const cart = await getShoppingCart(user.id);
        dispatch(setCartItems(cart.items));
      } catch (err) {
        dispatch(setError('Không thể tải giỏ hàng. Vui lòng thử lại sau.'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCart();
  }, [dispatch, user, navigate]);

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1 || !user) return;
    dispatch(updateQuantity({ productId, quantity: newQuantity }));
  };

  const handleRemoveItem = async (itemId: number) => {
    if (!user) return;
    
    try {
      dispatch(setLoading(true));
      await removeItemFromCart(user.id, itemId);
      const cart = await getShoppingCart(user.id);
      dispatch(setCartItems(cart.items));
    } catch (err) {
      dispatch(setError('Không thể xóa sản phẩm. Vui lòng thử lại sau.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleClearCart = async () => {
    if (!user) return;
    
    try {
      dispatch(setLoading(true));
      await clearShoppingCart(user.id);
      dispatch(clearCart());
    } catch (err) {
      dispatch(setError('Không thể xóa giỏ hàng. Vui lòng thử lại sau.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Vui lòng đăng nhập để xem giỏ hàng
        </Alert>
        <Button variant="contained" component={Link} to="/login">
          Đăng nhập
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Thử lại
        </Button>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Giỏ hàng trống
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/"
            size="large"
          >
            Tiếp tục mua sắm
          </Button>
        </Box>
      </Container>
    );
  }

  const totalAmount = items.reduce((total, item) => total + item.productPrice * item.quantity, 0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Giỏ hàng
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
        {/* Danh sách sản phẩm */}
        <Box sx={{ flex: 2 }}>
              {items.map((item) => (
            console.log(item),
            <Card key={item.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box
                    component="img"
                    src={item.imageUrl ? `http://localhost:8080${item.imageUrl}` : "https://via.placeholder.com/150"}
                    alt={item.productName}
                    sx={{
                      width: 120,
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 1,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {item.productName}
                    </Typography>
                    <Typography color="error.main" variant="h6" gutterBottom>
                      {item.productPrice.toLocaleString('vi-VN')}₫
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          >
                          <RemoveIcon />
                        </IconButton>
                        <TextField
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 1)}
                          type="number"
                          size="small"
                          inputProps={{ min: 1, style: { textAlign: 'center' } }}
                          sx={{ width: 60, mx: 1 }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
              ))}
        </Box>

        {/* Tổng thanh toán */}
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
              Tổng thanh toán
              </Typography>
              <Box sx={{ my: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Tạm tính</Typography>
                  <Typography>{totalAmount.toLocaleString('vi-VN')}₫</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Phí vận chuyển</Typography>
                  <Typography color="success.main">Miễn phí</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Tổng cộng</Typography>
                  <Typography variant="h6" color="error.main">
                    {totalAmount.toLocaleString('vi-VN')}₫
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={() => navigate('/checkout')}
                >
                  Thanh toán
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  size="large"
                  sx={{ mt: 2 }}
                  onClick={handleClearCart}
                >
                  Xóa giỏ hàng
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default Cart; 