import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Paper,
    Button,
    Divider,
    CircularProgress,
    Alert
} from '@mui/material';
import { getOrder } from '../services/order.service';
import { OrderDto } from '../types/order';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { clearShoppingCart } from '../services/cart.service';

const OrderSuccess: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<OrderDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                if (orderId) {
                    console.log('Fetching order with ID:', orderId);
                    const orderData = await getOrder(parseInt(orderId));
                    console.log('Order data received:', orderData);
                    setOrder(orderData);

                    // Xóa giỏ hàng sau khi đặt hàng thành công
                    const userId = localStorage.getItem('userId');
                    if (userId) {
                        await clearShoppingCart(parseInt(userId));
                        console.log('Shopping cart cleared successfully');
                    }
                } else {
                    console.error('No orderId found in params');
                    setError('Không tìm thấy ID đơn hàng');
                }
            } catch (err) {
                console.error('Error fetching order:', err);
                setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !order) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error || 'Không tìm thấy thông tin đơn hàng'}
                </Alert>
                <Button variant="contained" onClick={() => navigate('/')}>
                    Về trang chủ
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                <Typography variant="h4" gutterBottom>
                    Đặt hàng thành công!
                </Typography>
                <Typography color="text.secondary">
                    Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
                </Typography>
            </Box>

            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Thông tin đơn hàng #{order.id}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Tên khách hàng
                        </Typography>
                        <Typography gutterBottom>{order.customerName}</Typography>

                        <Typography variant="subtitle2" color="text.secondary">
                            Email
                        </Typography>
                        <Typography gutterBottom>{order.customerEmail}</Typography>

                        <Typography variant="subtitle2" color="text.secondary">
                            Số điện thoại
                        </Typography>
                        <Typography gutterBottom>{order.customerPhone}</Typography>

                        <Typography variant="subtitle2" color="text.secondary">
                            Địa chỉ giao hàng
                        </Typography>
                        <Typography gutterBottom>{order.shippingAddress}</Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Ngày đặt hàng
                        </Typography>
                        <Typography gutterBottom>
                            {new Date(order.orderDate!).toLocaleString('vi-VN')}
                        </Typography>

                        <Typography variant="subtitle2" color="text.secondary">
                            Trạng thái đơn hàng
                        </Typography>
                        <Typography gutterBottom>{order.status}</Typography>

                        <Typography variant="subtitle2" color="text.secondary">
                            Phương thức thanh toán
                        </Typography>
                        <Typography gutterBottom>Thanh toán khi nhận hàng (COD)</Typography>
                    </Box>
                </Box>
            </Paper>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Chi tiết đơn hàng
                </Typography>
                {order.orderItems.map((item) => (
                    <Box key={item.id} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                                component="img"
                                src={item.imageUrl ? `http://localhost:8080${item.imageUrl}` : 'https://via.placeholder.com/50'}
                                alt={item.productName}
                                sx={{ width: 50, height: 50, objectFit: 'cover' }}
                            />
                            <Box sx={{ flex: 1 }}>
                                <Typography>{item.productName}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Số lượng: {item.quantity}
                                </Typography>
                            </Box>
                            <Typography>
                                {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                            </Typography>
                        </Box>
                    </Box>
                ))}
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">Tổng cộng</Typography>
                    <Typography variant="h6" color="error.main">
                        {order.totalAmount.toLocaleString('vi-VN')}₫
                    </Typography>
                </Box>
            </Paper>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/')}
                    sx={{ mr: 2 }}
                >
                    Tiếp tục mua sắm
                </Button>
            </Box>
        </Container>
    );
};

export default OrderSuccess; 