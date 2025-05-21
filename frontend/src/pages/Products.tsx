import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Container, Typography, Card, CardMedia, CardContent, Skeleton } from '@mui/material';
import { filterProducts } from '../services/product.service';
import { Product, ProductResponse } from '../types';
import { useNavigate } from 'react-router-dom';

const Products: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        const result = await filterProducts({
          name: searchParams.get('name') || undefined,
          categoryId: searchParams.get('categoryId') || undefined,
          brand: searchParams.get('brand') || undefined,
          color: searchParams.get('color') || undefined,
          minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
          maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
          page: 0,
          size: 10
        });

        setProducts(result.content);
        setTotalElements(result.totalElements);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h5" gutterBottom>
          Kết quả tìm kiếm ({totalElements} sản phẩm)
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2,
          '& > *': {
            width: { xs: 'calc(50% - 8px)', sm: 'calc(33.33% - 11px)', md: 'calc(25% - 12px)' }
          }
        }}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Box key={i}>
                  <Skeleton variant="rectangular" height={200} />
                  <Skeleton width="80%" />
                  <Skeleton width="60%" />
                </Box>
              ))
            : products.map((product) => (
                <Card 
                  key={product.id}
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 3,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s'
                    }
                  }}
                  onClick={() => handleProductClick(product.id)}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={product.imageUrls && product.imageUrls.length > 0 
                      ? `http://localhost:8080${product.imageUrls[0]}`
                      : 'https://via.placeholder.com/140'}
                    alt={product.name}
                    sx={{ objectFit: 'contain', p: 1 }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" fontWeight={700} noWrap>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="error.main" fontWeight={700}>
                      {product.price?.toLocaleString('vi-VN')}₫
                    </Typography>
                  </CardContent>
                </Card>
              ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Products; 