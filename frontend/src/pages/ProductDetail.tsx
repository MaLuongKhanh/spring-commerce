import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardMedia, CardContent, Button, Stack, TextField, Divider, Container, Skeleton, Snackbar, Alert } from '@mui/material';
import { getProduct, getProducts } from '../services/product.service';
import { getComments, addComment } from '../services/comment.service';
import { addItemToCart } from '../services/cart.service';
import { Product, Comment } from '../types';
import SwiperCore from 'swiper';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import type { Swiper as SwiperType } from 'swiper';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

SwiperCore.use([Autoplay]);

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('accessToken'));
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const { user } = useSelector((state: RootState) => state.auth);

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);
  const deliveryStr = deliveryDate.toLocaleDateString('vi-VN');

  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    if (id) {
      getProduct(parseInt(id))
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching product:', error);
          setLoading(false);
        });

      // Load comments
      getComments(parseInt(id))
        .then((response) => {
          if (response && Array.isArray(response)) {
            setComments(response);
          } else if (response && response.content) {
            setComments(response.content);
          } else {
            setComments([]);
          }
        })
        .catch((error) => {
          console.error('Error fetching comments:', error);
          setComments([]);
        });
    }
  }, [id]);

  const handleAddComment = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (!id || !commentText.trim()) return;
    setSubmitting(true);
    try {
      const newCmt = await addComment(Number(id), commentText.trim());
      setComments([newCmt, ...comments]);
      setCommentText('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (!product || !user) return;

    try {
      await addItemToCart(user.id, product.id, quantity);
      setSnackbar({
        open: true,
        message: 'Đã thêm sản phẩm vào giỏ hàng',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Không thể thêm sản phẩm vào giỏ hàng',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    if (product && value > product.stock) return;
    setQuantity(value);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="rectangular" height={400} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" height={40} />
            <Skeleton variant="text" height={30} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} />
          </Box>
        </Box>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" color="error">
          Không tìm thấy sản phẩm
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ flex: 1, minWidth: 0, maxWidth: { md: 400 } }}>
          <Swiper
            onSwiper={(swiper: SwiperType) => (swiperRef.current = swiper)}
            onSlideChange={(swiper: SwiperType) => setActiveImage(swiper.realIndex)}
            initialSlide={activeImage}
            autoplay={{ delay: 2500 }}
            loop
            style={{ borderRadius: 12 }}
          >
            {product.imageUrls && product.imageUrls.length > 0 ? (
              product.imageUrls.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 400,
                      background: '#fff'
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={`http://localhost:8080${img}`}
                      alt={`Ảnh ${idx + 1}`}
                      sx={{
                        borderRadius: 2,
                        maxHeight: 400,
                        maxWidth: '100%',
                        objectFit: 'contain',
                        margin: 'auto'
                      }}
                    />
                  </Box>
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 400,
                    background: '#fff'
                  }}
                >
                  <CardMedia
                    component="img"
                    image="https://via.placeholder.com/400"
                    alt="No image"
                    sx={{
                      borderRadius: 2,
                      maxHeight: 400,
                      maxWidth: '100%',
                      objectFit: 'contain',
                      margin: 'auto'
                    }}
                  />
                </Box>
              </SwiperSlide>
            )}
          </Swiper>
          <Stack direction="row" spacing={1} sx={{ mt: 2, overflowX: 'auto' }}>
            {product.imageUrls && product.imageUrls.map((img, idx) => (
              <CardMedia
                key={idx}
                component="img"
                image={`http://localhost:8080${img}`}
                alt={`Thumb ${idx + 1}`}
                sx={{
                  width: 60,
                  height: 60,
                  objectFit: 'cover',
                  borderRadius: 1,
                  border: activeImage === idx ? '2px solid #1976d2' : '1px solid #eee',
                  cursor: 'pointer',
                  transition: 'border 0.2s'
                }}
                onMouseEnter={() => {
                  setActiveImage(idx);
                  swiperRef.current?.slideToLoop(idx);
                }}
                onClick={() => {
                  setActiveImage(idx);
                  swiperRef.current?.slideToLoop(idx);
                }}
              />
            ))}
          </Stack>
        </Box>

        <Box sx={{ flex: 2, minWidth: 0 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            {product.name}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
            <Typography color="warning.main" fontWeight={700}>4.7</Typography>
            <Typography color="text.secondary">|</Typography>
            <Typography color="text.secondary">{comments.length} Đánh giá</Typography>
            <Typography color="text.secondary">|</Typography>
            <Typography color="text.secondary">Đã bán {product.sold || 0}</Typography>
          </Stack>
          <Box sx={{ bgcolor: '#fff0f0', borderRadius: 2, p: 2, mb: 2 }}>
            <Typography variant="h4" color="error.main" fontWeight={700}>
              {product.price?.toLocaleString('vi-VN')}₫
            </Typography>
          </Box>
          <Stack spacing={2} sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="flex-start" spacing={2}>
              <Box sx={{ width: 140, display: 'flex', alignItems: 'center', minWidth: 120 }}>
                <LocalShippingIcon color="primary" sx={{ mr: 1 }} />
                <Typography fontWeight={700}>Vận chuyển</Typography>
              </Box>
              <Box>
                <Typography>Nhận hàng vào {deliveryStr}</Typography>
                <Typography color="success.main" fontSize={14}>Miễn phí vận chuyển</Typography>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="flex-start" spacing={2}>
              <Box sx={{ width: 140, display: 'flex', alignItems: 'center', minWidth: 120 }}>
                <VerifiedUserIcon color="success" sx={{ mr: 1 }} />
                <Typography fontWeight={700}>An tâm cùng Spring Commerce</Typography>
              </Box>
              <Box>
                <Typography>Trả hàng miễn phí 15 ngày</Typography>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ width: 140, minWidth: 120 }}>
                <Typography fontWeight={700}>Kho</Typography>
              </Box>
              <Typography>{product.stock}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ width: 140, minWidth: 120 }}>
                <Typography fontWeight={700}>Thương hiệu</Typography>
              </Box>
              <Typography>{product.brand}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ width: 140, minWidth: 120 }}>
                <Typography fontWeight={700}>Màu sắc</Typography>
              </Box>
              <Typography>{product.color}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ width: 140, minWidth: 120 }}>
                <Typography fontWeight={700}>Số lượng</Typography>
              </Box>
              <Button variant="outlined" size="small" onClick={() => handleQuantityChange(quantity - 1)}>-</Button>
              <TextField
                value={quantity}
                onChange={e => handleQuantityChange(Number(e.target.value))}
                type="number"
                size="small"
                inputProps={{ min: 1, max: product.stock, style: { width: 50, textAlign: 'center' } }}
              />
              <Button variant="outlined" size="small" onClick={() => handleQuantityChange(quantity + 1)}>+</Button>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="error"
              size="large"
              sx={{ minWidth: 180 }}
              onClick={handleAddToCart}
            >
              Thêm vào giỏ hàng
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ minWidth: 180 }}
            >
              Mua ngay
            </Button>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ mt: 4, bgcolor: 'white', borderRadius: 2, p: 2, width: '100%' }}>
        <Typography variant="h6" fontWeight={700}>Đánh giá sản phẩm</Typography>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Viết đánh giá của bạn..."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            disabled={submitting}
          />
          <Button variant="contained" onClick={handleAddComment} disabled={submitting || !commentText.trim()}>Gửi</Button>
        </Stack>
        <Divider sx={{ my: 2 }} />
        {comments.length === 0 ? (
          <Typography>Chưa có đánh giá nào.</Typography>
        ) : (
          comments.map((cmt) => (
            <Box key={cmt.id} sx={{ borderBottom: '1px solid #eee', py: 1 }}>
              <Typography fontWeight={700}>{cmt.userFullname}</Typography>
              <Typography>{cmt.content}</Typography>
              <Typography variant="caption" color="text.secondary">{new Date(cmt.createdAt).toLocaleString('vi-VN')}</Typography>
            </Box>
          ))
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetail; 