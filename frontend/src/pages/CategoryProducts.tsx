import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Card, CardMedia, CardContent, Skeleton } from '@mui/material';
import { getProductsByCategory } from '../services/category.service';
import { getCategory } from '../services/category.service';
import { Product, Category } from '../types';

const CategoryProducts: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) return;
      
      setLoading(true);
      try {
        const [productsData, categoryData] = await Promise.all([
          getProductsByCategory(parseInt(categoryId), page - 1),
          getCategory(parseInt(categoryId))
        ]);
        
        setProducts(productsData.content);
        setTotalPages(productsData.totalPages);
        setCategory(categoryData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId, page]);

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2,
          '& > *': {
            width: { xs: 'calc(50% - 8px)', sm: 'calc(33.33% - 11px)', md: 'calc(25% - 12px)' }
          }
        }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Box key={i}>
              <Skeleton variant="rectangular" height={200} />
              <Skeleton width="80%" />
              <Skeleton width="60%" />
            </Box>
          ))}
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {category?.name || 'Danh mục sản phẩm'}
      </Typography>
      
      {products.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center" sx={{ py: 4 }}>
          Không có sản phẩm nào trong danh mục này
        </Typography>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2,
          '& > *': {
            width: { xs: 'calc(50% - 8px)', sm: 'calc(33.33% - 11px)', md: 'calc(25% - 12px)' }
          }
        }}>
          {products.map((product) => (
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
      )}
    </Container>
  );
};

export default CategoryProducts; 