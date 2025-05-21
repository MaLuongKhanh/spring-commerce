import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
    Container,
    Box,
    Paper,
    Typography,
    Divider,
    Alert,
    CircularProgress,
    Chip,
    Button
} from '@mui/material';
import { getAllOrders } from '../services/order.service';
import { OrderDto } from '../types/order';
import { useNavigate } from 'react-router-dom';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'PENDING':
            return 'warning';
        case 'CONFIRMED':
            return 'info';
        case 'SHIPPING':
            return 'primary';
        case 'DELIVERED':
            return 'success';
        case 'CANCELLED':
            return 'error';
        default:
            return 'default';
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'PENDING':
            return 'Chờ xác nhận';
        case 'CONFIRMED':
            return 'Đã xác nhận';
        case 'SHIPPING':
            return 'Đang giao hàng';
        case 'DELIVERED':
            return 'Đã giao hàng';
        case 'CANCELLED':
            return 'Đã hủy';
        default:
            return status;
    }
};

const Orders: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);
    const [orders, setOrders] = useState<OrderDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const ordersData = await getAllOrders();
                setOrders(ordersData);
            } catch (err) {
                setError('Không thể tải danh sách đơn hàng');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

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
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (orders.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <ShoppingBagIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        Bạn chưa có đơn hàng nào
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/products')}
                        sx={{ mt: 2 }}
                    >
                        Mua sắm ngay
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h5" gutterBottom>
                Đơn hàng của tôi
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {orders.map((order) => (
                    <Paper key={order.id} sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box>
                                <Typography variant="subtitle1" gutterBottom>
                                    Đơn hàng #{order.id}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {new Date(order.orderDate!).toLocaleString('vi-VN')}
                                </Typography>
                            </Box>
                            <Chip
                                label={getStatusText(order.status || '')}
                                color={getStatusColor(order.status || '') as any}
                                size="small"
                            />
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {order.orderItems.map((item) => (
                                <Box
                                    key={item.id}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={item.imageUrl ? `http://localhost:8080${item.imageUrl}` : 'https://via.placeholder.com/50'}
                                        alt={item.productName}
                                        sx={{
                                            width: 50,
                                            height: 50,
                                            objectFit: 'cover',
                                            borderRadius: 1
                                        }}
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
                            ))}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1">
                                Tổng cộng: {order.totalAmount.toLocaleString('vi-VN')}₫
                            </Typography>
                            <Button
                                variant="outlined"
                                onClick={() => navigate(`/order-success/${order.id}`)}
                            >
                                Xem chi tiết
                            </Button>
                        </Box>
                    </Paper>
                ))}
            </Box>
        </Container>
    );
};

export default Orders; 