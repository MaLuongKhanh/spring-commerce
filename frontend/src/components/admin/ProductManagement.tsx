import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SelectChangeEvent,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { Product, Category } from '../../types';
import adminService from '../../services/admin.service';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  brand: string;
  color: string;
  categoryId: number;
  stock: number;
  images: File[];
}

const initialFormData: ProductFormData = {
  name: '',
  description: '',
  price: 0,
  brand: '',
  color: '',
  categoryId: 0,
  stock: 0,
  images: [],
};

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    console.log('ProductManagement component mounted');
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...');
      const response = await adminService.getAllProducts();
      console.log('Products response:', response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      const response = await adminService.getAllCategories();
      console.log('Categories response:', response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        brand: product.brand,
        color: product.color || '',
        categoryId: product.category?.id || 0,
        stock: product.stock,
        images: [],
      });
      setPreviewUrls(product.imageUrls?.map(url => url) || []);
    } else {
      setEditingProduct(null);
      setFormData(initialFormData);
      setPreviewUrls([]);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setFormData(initialFormData);
    setPreviewUrls([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        images: files,
      }));

      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images') {
          (value as File[]).forEach(file => {
            formDataToSend.append('images', file);
          });
        } else {
          formDataToSend.append(key, value.toString());
        }
      });

      if (editingProduct) {
        await adminService.updateProduct(editingProduct.id, formDataToSend);
      } else {
        await adminService.createProduct(formDataToSend);
      }
      handleCloseDialog();
      fetchProducts();
    } catch (error: any) {
      console.error('Error saving product:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      alert('Có lỗi xảy ra khi lưu sản phẩm. Vui lòng thử lại.');
    }
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await adminService.deleteProduct(productId);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Quản lý sản phẩm</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Thêm sản phẩm
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Thương hiệu</TableCell>
              <TableCell>Tồn kho</TableCell>
              <TableCell>Đã bán</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>
                  <img
                    src={`http://localhost:8080${product.imageUrls?.[0] || ''}`}
                    alt={product.name}
                    style={{ width: 50, height: 50, objectFit: 'cover' }}
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price.toLocaleString()}đ</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.sold}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(product)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                name="name"
                label="Tên sản phẩm"
                value={formData.name}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <TextField
                name="description"
                label="Mô tả"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                fullWidth
              />
              <TextField
                name="price"
                label="Giá"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <TextField
                name="brand"
                label="Thương hiệu"
                value={formData.brand}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <TextField
                name="color"
                label="Màu sắc"
                value={formData.color}
                onChange={handleInputChange}
                fullWidth
              />
              <FormControl fullWidth required>
                <InputLabel>Danh mục</InputLabel>
                <Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleSelectChange}
                  label="Danh mục"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                name="stock"
                label="Số lượng tồn kho"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <Box>
                <input
                  accept="image/*"
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button variant="outlined" component="span">
                    Chọn ảnh
                  </Button>
                </label>
                <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                  {previewUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url.startsWith('blob:') ? url : `http://localhost:8080${url}`}
                      alt={`Preview ${index + 1}`}
                      style={{ width: 100, height: 100, objectFit: 'cover' }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button type="submit" variant="contained">
              {editingProduct ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ProductManagement; 