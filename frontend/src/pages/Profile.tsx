import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
    Container,
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Avatar,
    Divider,
    Alert,
    CircularProgress,
    Snackbar
} from '@mui/material';
import { getUserById, updateUser } from '../services/user.service';
import { User } from '../types';

const Profile: React.FC = () => {
    const { user: currentUser } = useSelector((state: RootState) => state.auth);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: ''
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (currentUser?.id) {
                    const userData = await getUserById(currentUser.id);
                    setUser(userData);
                    setFormData({
                        firstname: userData.firstname,
                        lastname: userData.lastname,
                        email: userData.email
                    });
                }
            } catch (err) {
                setError('Không thể tải thông tin người dùng');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [currentUser]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser?.id) return;

        try {
            setLoading(true);
            const updatedUser = await updateUser(currentUser.id, {
                firstname: formData.firstname,
                lastname: formData.lastname,
                email: formData.email
            });
            setUser(updatedUser);
            setEditMode(false);
            setSnackbar({
                open: true,
                message: 'Cập nhật thông tin thành công',
                severity: 'success'
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Không thể cập nhật thông tin',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !user) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">{error || 'Không tìm thấy thông tin người dùng'}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                {/* Left sidebar */}
                <Box sx={{ width: { xs: '100%', md: '300px' } }}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                mx: 'auto',
                                mb: 2,
                                bgcolor: 'primary.main',
                                fontSize: '2rem'
                            }}
                        >
                            {user.firstname.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="h6" gutterBottom>
                            {user.firstname} {user.lastname}
                        </Typography>
                        <Typography color="text.secondary" gutterBottom>
                            {user.email}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2" color="text.secondary">
                            Thành viên từ {new Date().toLocaleDateString('vi-VN')}
                        </Typography>
                    </Paper>
                </Box>

                {/* Main content */}
                <Box sx={{ flex: 1 }}>
                    <Paper sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6">Thông tin tài khoản</Typography>
                            {!editMode ? (
                                <Button
                                    variant="outlined"
                                    onClick={() => setEditMode(true)}
                                    disabled={loading}
                                >
                                    Chỉnh sửa
                                </Button>
                            ) : (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setEditMode(false);
                                            setFormData({
                                                firstname: user.firstname,
                                                lastname: user.lastname,
                                                email: user.email
                                            });
                                        }}
                                        disabled={loading}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                    >
                                        Lưu thay đổi
                                    </Button>
                                </Box>
                            )}
                        </Box>

                        <Box component="form" onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Họ"
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={handleInputChange}
                                    disabled={!editMode || loading}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Tên"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleInputChange}
                                    disabled={!editMode || loading}
                                    required
                                />
                            </Box>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                disabled={true}
                                sx={{ mb: 2 }}
                            />
                        </Box>
                    </Paper>
                </Box>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Profile; 