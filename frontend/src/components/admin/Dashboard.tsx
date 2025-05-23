import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { PeopleAlt, ShoppingCart, AttachMoney, Inventory } from '@mui/icons-material';
import adminService, { DashboardStats } from '../../services/admin.service';
import { LineChart, PieChart } from '@mui/x-charts';

interface RevenueData {
  name: string;
  revenue: number;
}

interface OrderStatusData {
  name: string;
  value: number;
}

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <Paper
    elevation={3}
    sx={{
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      bgcolor: 'background.paper',
      borderRadius: 2,
      minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' },
      flex: '1 1 auto',
    }}
  >
    <Box sx={{ color: 'primary.main', mb: 1 }}>{icon}</Box>
    <Typography variant="h5" component="div" sx={{ mb: 0.5 }}>
      {value.toLocaleString()}
    </Typography>
    <Typography variant="body2" color="text.secondary" align="center">
      {title}
    </Typography>
  </Paper>
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
  });

  // Dữ liệu mẫu cho biểu đồ
  const revenueData: RevenueData[] = [
    { name: 'T1', revenue: 4000 },
    { name: 'T2', revenue: 3000 },
    { name: 'T3', revenue: 2000 },
    { name: 'T4', revenue: 2780 },
    { name: 'T5', revenue: 1890 },
    { name: 'T6', revenue: 2390 },
  ];

  const orderStatusData: OrderStatusData[] = [
    { name: 'Chờ xác nhận', value: 400 },
    { name: 'Đã xác nhận', value: 300 },
    { name: 'Đang giao hàng', value: 300 },
    { name: 'Đã giao hàng', value: 200 },
    { name: 'Đã hủy', value: 100 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF0000'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getDashboardStats();
        setStats(response.data);
        console.log('Dashboard stats:', response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Tổng quan
      </Typography>
      
      {/* Thống kê số liệu */}
      <Box sx={{ 
        display: 'flex', 
        gap: 3, 
        flexWrap: 'wrap', 
        mb: 4,
        '& > *': {
          flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' }
        }
      }}>
        <StatCard
          title="Tổng người dùng"
          value={stats.totalUsers}
          icon={<PeopleAlt sx={{ fontSize: 32 }} />}
        />
        <StatCard
          title="Tổng đơn hàng"
          value={stats.totalOrders}
          icon={<ShoppingCart sx={{ fontSize: 32 }} />}
        />
        <StatCard
          title="Doanh thu"
          value={stats.totalRevenue}
          icon={<AttachMoney sx={{ fontSize: 32 }} />}
        />
        <StatCard
          title="Tổng sản phẩm"
          value={stats.totalProducts}
          icon={<Inventory sx={{ fontSize: 32 }} />}
        />
      </Box>

      {/* Biểu đồ */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Biểu đồ doanh thu */}
        <Box sx={{ width: { xs: '100%', md: 'calc(66.66% - 12px)' } }}>
          <Paper elevation={3} sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Doanh thu theo tháng</Typography>
            <LineChart
              series={[
                {
                  data: revenueData.map(item => item.revenue),
                  label: 'Doanh thu',
                },
              ]}
              xAxis={[{ scaleType: 'point', data: revenueData.map(item => item.name) }]}
              height={300}
            />
          </Paper>
        </Box>

        {/* Biểu đồ trạng thái đơn hàng */}
        <Box sx={{ width: { xs: '100%', md: 'calc(33.33% - 12px)' } }}>
          <Paper elevation={3} sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Trạng thái đơn hàng</Typography>
            <PieChart
              series={[
                {
                  data: orderStatusData.map((item, index) => ({
                    id: index,
                    value: item.value,
                    label: item.name,
                  })),
                },
              ]}
              height={300}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard; 