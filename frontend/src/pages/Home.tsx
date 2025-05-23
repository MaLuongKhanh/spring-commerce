import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Card, CardMedia, CardContent, Button, Chip, Stack, Skeleton } from '@mui/material';
import { getCategories } from '../services/category.service';
import { getProducts } from '../services/product.service';
import { Category, Product, ProductResponse } from '../types';
import { useNavigate } from 'react-router-dom';
import bannerImage1 from '../assets/banner1.jpg'
import bannerImage2 from '../assets/banner2.jpg'
import bannerImage3 from '../assets/banner3.jpg'


// Danh mục gán cứng nếu thiếu
const staticCategories: (Category & { icon: string })[] = [
  { id: 1, name: 'Điện thoại & Phụ kiện', icon: '📱', description: '' },
  { id: 2, name: 'Đồng hồ', icon: '⌚', description: '' },
  { id: 3, name: 'Giày dép nam', icon: '👞', description: '' },
  { id: 4, name: 'Máy ảnh & Máy quay phim', icon: '📷', description: '' },
  { id: 5, name: 'Máy tính & Laptop', icon: '🖥️', description: '' },
  { id: 6, name: 'Mẹ & Bé', icon: '👶', description: '' },
  { id: 7, name: 'Ô tô & Xe máy', icon: '🚗', description: '' },
  { id: 8, name: 'Sức khỏe', icon: '💊', description: '' },
  { id: 9, name: 'Thể thao', icon: '🏀', description: '' },
  { id: 10, name: 'Thiết bị điện tử', icon: '💻', description: '' },
  { id: 11, name: 'Thiết bị gia dụng', icon: '🏠', description: '' },
  { id: 12, name: 'Thời trang nam', icon: '👔', description: '' },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<(Category & { icon?: string })[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hotDeals, setHotDeals] = useState<Product[]>([]);

  useEffect(() => {
    Promise.all([getCategories(), getProducts()]).then(([cats, prods]) => {
      console.log('Categories:', cats);
      console.log('Products:', prods);

      if (Array.isArray(cats) && cats.length > 0) {
        setCategories(cats.map((cat, idx) => ({ ...cat, icon: staticCategories[idx]?.icon || '🛒' })));
      } else {
        setCategories(staticCategories);
      }

      const productsList = Array.isArray((prods as ProductResponse)?.content) ? (prods as ProductResponse).content : [];
      setProducts(productsList);
      
      // Lấy ngẫu nhiên 6 sản phẩm cho hot deals
      const shuffled = [...productsList].sort(() => 0.5 - Math.random());
      setHotDeals(shuffled.slice(0, 6));
      
      setLoading(false);
    });
  }, []);

  // Flash sale: lấy 8 sản phẩm đầu 
  const flashSale = products.slice(0, 8);
  const suggest = products.slice(8, 32);
  console.log('Suggest:', suggest);

  // Thêm hàm xử lý click
  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Banner */}
      <Container maxWidth="lg" sx={{ pt: 5 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: { xs: '1 1 100%', md: '2 1 0%' }, minWidth: 0 }}>
            <Box sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
              <img
                src={bannerImage1}
                alt="banner"
                style={{ width: '100%', height: 270, objectFit: 'cover' }}
              />
            </Box>
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 0%' }, minWidth: 0 }}>
            <Stack spacing={2}>
              <img
                src={bannerImage2}
                alt="banner2"
                style={{ width: '100%', height: 125, objectFit: 'cover', borderRadius: 8 }}
              />
              <img
                src={bannerImage3}
                alt="banner3"
                style={{ width: '100%', height: 125, objectFit: 'cover', borderRadius: 8 }}
              />
            </Stack>
          </Box>
        </Box>
      </Container>

      {/* Danh mục */}
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 2, mb: 3 }}>
          <Typography variant="h6" fontWeight={700} mb={2}>Danh mục</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {loading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <Box key={i} sx={{ width: { xs: '25%', sm: '16.66%', md: '8.33%' }, textAlign: 'center' }}>
                    <Skeleton variant="circular" width={56} height={56} />
                    <Skeleton width={56} height={20} />
                  </Box>
                ))
              : categories.slice(0, 12).map((cat) => (
                  <Box 
                    key={cat.id} 
                    sx={{ 
                      width: { xs: '25%', sm: '16.66%', md: '15%' }, 
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        transition: 'transform 0.2s'
                      }
                    }}
                    onClick={() => navigate(`/products?categoryId=${cat.id}`)}
                  >
                    <Box sx={{ 
                      width: 56, 
                      height: 56, 
                      bgcolor: '#f3f3f3', 
                      borderRadius: '50%', 
                      mx: 'auto', 
                      mb: 1, 
                      fontSize: 32, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      {cat.icon || '🛒'}
                    </Box>
                    <Typography variant="body2" noWrap>{cat.name}</Typography>
                  </Box>
                ))}
          </Box>
        </Box>
      </Container>

      {/* Flash Sale */}
      <Container maxWidth="lg" sx={{ mb: 3 }}>
        <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 2, mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Chip label="FLASH SALE" color="error" sx={{ fontWeight: 700 }} />
          </Stack>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Box key={i} sx={{ width: { xs: '50%', sm: '25%', md: '16.66%' } }}>
                    <Skeleton variant="rectangular" width="100%" height={180} />
                    <Skeleton width="80%" />
                    <Skeleton width="60%" />
                  </Box>
                ))
              : flashSale.map((prod) => (
                  <Box key={prod.id} sx={{ width: { xs: '50%', sm: '25%', md: '16.66%' } }}>
                    <Card 
                      sx={{ 
                        borderRadius: 2, 
                        boxShadow: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: 3,
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s'
                        }
                      }}
                      onClick={() => handleProductClick(prod.id)}
                    >
                      <CardMedia
                        component="img"
                        height="120"
                        image={prod.imageUrls && prod.imageUrls.length > 0 
                            ? `http://localhost:8080${prod.imageUrls[0]}` // Thêm domain backend
                            : 'https://via.placeholder.com/120'}
                        alt={prod.name}
                        sx={{ objectFit: 'contain' }}
                      />
                      <CardContent sx={{ p: 1 }}>
                        <Typography variant="body2" fontWeight={700} noWrap>{prod.name}</Typography>
                        <Typography variant="body2" color="error.main" fontWeight={700}>
                          {prod.price?.toLocaleString('vi-VN') || 0}đ
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
          </Box>
        </Box>
      </Container>

      {/* Săn Deal Siêu Hot */}
      <Container maxWidth="lg" sx={{ mb: 3 }}>
        <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 2, mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Chip label="SĂN DEAL SIÊU HOT" color="warning" sx={{ fontWeight: 700 }} />
          </Stack>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Box key={i} sx={{ width: { xs: '50%', sm: '25%', md: '16.66%' } }}>
                    <Skeleton variant="rectangular" width="100%" height={180} />
                    <Skeleton width="80%" />
                    <Skeleton width="60%" />
                  </Box>
                ))
              : hotDeals.map((deal) => (
                  <Box key={deal.id} sx={{ width: { xs: '50%', sm: '25%', md: '16.66%' } }}>
                    <Card 
                      sx={{ 
                        borderRadius: 2, 
                        boxShadow: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: 3,
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s'
                        }
                      }}
                      onClick={() => handleProductClick(deal.id)}
                    >
                      <CardMedia
                        component="img"
                        height="120"
                        image={deal.imageUrls && deal.imageUrls.length > 0 
                            ? `http://localhost:8080${deal.imageUrls[0]}`
                            : 'https://via.placeholder.com/120'}
                        alt={deal.name}
                        sx={{ objectFit: 'contain' }}
                      />
                      <CardContent sx={{ p: 1 }}>
                        <Typography variant="body2" fontWeight={700} noWrap>{deal.name}</Typography>
                        <Typography variant="body2" color="error.main" fontWeight={700}>
                          {deal.price?.toLocaleString('vi-VN') || 0}đ
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
          </Box>
        </Box>
      </Container>

      {/* Gợi ý cho bạn */}
      <Container maxWidth="lg" sx={{ mb: 3 }}>
        <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 2 }}>
          <Typography variant="h6" fontWeight={700} mb={2}>Gợi ý cho bạn</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {loading
              ? Array.from({ length: 16 }).map((_, i) => (
                  <Box key={i} sx={{ width: { xs: '50%', sm: '33.33%', md: '25%', lg: '16.66%' } }}>
                    <Skeleton variant="rectangular" width="100%" height={180} />
                    <Skeleton width="80%" />
                    <Skeleton width="60%" />
                  </Box>
                ))
              : suggest.map((prod) => (
                  <Box key={prod.id} sx={{ width: { xs: '50%', sm: '33.33%', md: '25%', lg: '16.66%' } }}>
                    <Card 
                      sx={{ 
                        borderRadius: 2, 
                        boxShadow: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: 3,
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s'
                        }
                      }}
                      onClick={() => handleProductClick(prod.id)}
                    >
                      <CardMedia
                        component="img"
                        height="120"
                        image={prod.imageUrls && prod.imageUrls.length > 0 
                            ? `http://localhost:8080${prod.imageUrls[0]}`
                            : 'https://via.placeholder.com/120'}
                        alt={prod.name}
                        sx={{ objectFit: 'contain' }}
                      />
                      <CardContent sx={{ p: 1 }}>
                        <Typography variant="body2" fontWeight={700} noWrap>{prod.name}</Typography>
                        <Typography variant="body2" color="error.main" fontWeight={700}>
                          {prod.price?.toLocaleString('vi-VN') || 0}đ
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 