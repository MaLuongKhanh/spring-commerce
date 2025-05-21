import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    Paper,
    Divider,
    Alert,
    CircularProgress
} from '@mui/material';
import { RootState } from '../store';
import { createOrder } from '../services/order.service';
import { OrderDto, OrderItemDto } from '../types/order';

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const { items } = useSelector((state: RootState) => state.cart);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        shippingAddress: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const orderItems: OrderItemDto[] = items.map(item => ({
                productId: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                price: item.productPrice,
                imageUrl: item.imageUrl
            }));

            const orderData: OrderDto = {
                ...formData,
                orderItems,
                totalAmount: items.reduce((total, item) => total + item.productPrice * item.quantity, 0)
            };

            const order = await createOrder(orderData);
            navigate(`/order-success/${order.id}`);
        } catch (err) {
            setError('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="warning">
                    Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.
                </Alert>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/')}
                    sx={{ mt: 2 }}
                >
                    Tiếp tục mua sắm
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                Thanh toán
            </Typography>

            <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
                <Box sx={{ flex: 2 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Thông tin giao hàng
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Họ và tên"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleInputChange}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    label="Email"
                                    name="customerEmail"
                                    type="email"
                                    value={formData.customerEmail}
                                    onChange={handleInputChange}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    label="Số điện thoại"
                                    name="customerPhone"
                                    value={formData.customerPhone}
                                    onChange={handleInputChange}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    label="Địa chỉ giao hàng"
                                    name="shippingAddress"
                                    multiline
                                    rows={3}
                                    value={formData.shippingAddress}
                                    onChange={handleInputChange}
                                />
                            </Box>
                        </form>
                    </Paper>
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Đơn hàng của bạn
                        </Typography>
                        {items.map((item) => (
                            <Box key={item.id} sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography>
                                        {item.productName} x {item.quantity}
                                    </Typography>
                                    <Typography>
                                        {(item.productPrice * item.quantity).toLocaleString('vi-VN')}₫
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">Tổng cộng</Typography>
                            <Typography variant="h6" color="error.main">
                                {items
                                    .reduce((total, item) => total + item.productPrice * item.quantity, 0)
                                    .toLocaleString('vi-VN')}₫
                            </Typography>
                        </Box>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Đặt hàng'}
                        </Button>
                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}
                    </Paper>
                </Box>
            </Box>
        </Container>
    );
};

export default Checkout; 