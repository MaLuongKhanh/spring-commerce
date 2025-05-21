import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Chip,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../services/category.service';
import { filterProducts } from '../services/product.service';
import { Category } from '../types';

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

const SearchDialog: React.FC<SearchDialogProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchParams, setSearchParams] = useState({
    name: '',
    categoryId: '',
    brand: '',
    color: '',
    minPrice: 0,
    maxPrice: 10000000
  });

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleSearch = async () => {
    try {
      console.log('Searching with params:', searchParams);
      const result = await filterProducts({
        ...searchParams,
        page: 0,
        size: 10
      });
      console.log('Search result:', result);
      
      // Chuyển hướng đến trang products với kết quả tìm kiếm
      navigate(`/products?${new URLSearchParams({
        name: searchParams.name,
        categoryId: searchParams.categoryId,
        brand: searchParams.brand,
        color: searchParams.color,
        minPrice: searchParams.minPrice.toString(),
        maxPrice: searchParams.maxPrice.toString()
      }).toString()}`);
      
      onClose();
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Tìm kiếm sản phẩm</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Tên sản phẩm"
            value={searchParams.name}
            onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={searchParams.categoryId}
              label="Danh mục"
              onChange={(e) => setSearchParams({ ...searchParams, categoryId: e.target.value })}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Thương hiệu"
            value={searchParams.brand}
            onChange={(e) => setSearchParams({ ...searchParams, brand: e.target.value })}
            fullWidth
          />

          <TextField
            label="Màu sắc"
            value={searchParams.color}
            onChange={(e) => setSearchParams({ ...searchParams, color: e.target.value })}
            fullWidth
          />

          <Box>
            <Typography gutterBottom>Khoảng giá</Typography>
            <Slider
              value={[searchParams.minPrice, searchParams.maxPrice]}
              onChange={(_, newValue) => {
                const [min, max] = newValue as number[];
                setSearchParams({ ...searchParams, minPrice: min, maxPrice: max });
              }}
              valueLabelDisplay="auto"
              min={0}
              max={10000000}
              step={100000}
              valueLabelFormat={(value) => `${value.toLocaleString('vi-VN')}₫`}
            />
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Chip label={`${searchParams.minPrice.toLocaleString('vi-VN')}₫`} size="small" />
              <Chip label={`${searchParams.maxPrice.toLocaleString('vi-VN')}₫`} size="small" />
            </Stack>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSearch} variant="contained">Tìm kiếm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SearchDialog; 