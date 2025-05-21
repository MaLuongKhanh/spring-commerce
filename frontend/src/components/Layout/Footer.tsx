import React from 'react';
import { Box, Container, Typography, Link, Stack, Divider, Button } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';
import QrCode2Icon from '@mui/icons-material/QrCode2';

const Footer: React.FC = () => (
  <Box sx={{ bgcolor: '#f5f5f5', pt: 6, pb: 2, mt: 8, borderTop: '1px solid #eee' }}>
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: 3,
        }}
      >
        {/* Dịch vụ khách hàng */}
        <Box sx={{ minWidth: 180, flex: '1 1 180px' }}>
          <Typography fontWeight={700} mb={1} variant="subtitle1">DỊCH VỤ KHÁCH HÀNG</Typography>
          <Stack spacing={0.5}>
            <Link href="#" underline="hover" color="inherit">Trung Tâm Trợ Giúp</Link>
            <Link href="#" underline="hover" color="inherit">Blog Spring Commerce</Link>
            <Link href="#" underline="hover" color="inherit">Spring Mall</Link>
            <Link href="#" underline="hover" color="inherit">Hướng Dẫn Mua Hàng</Link>
            <Link href="#" underline="hover" color="inherit">Hướng Dẫn Bán Hàng</Link>
            <Link href="#" underline="hover" color="inherit">Ví SpringPay</Link>
            <Link href="#" underline="hover" color="inherit">Spring Xu</Link>
            <Link href="#" underline="hover" color="inherit">Đơn Hàng</Link>
            <Link href="#" underline="hover" color="inherit">Trả Hàng/Hoàn Tiền</Link>
            <Link href="#" underline="hover" color="inherit">Liên Hệ</Link>
            <Link href="#" underline="hover" color="inherit">Chính Sách Bảo Hành</Link>
          </Stack>
        </Box>
        {/* Spring Commerce Việt Nam */}
        <Box sx={{ minWidth: 180, flex: '1 1 180px' }}>
          <Typography fontWeight={700} mb={1} variant="subtitle1">SPRING COMMERCE VIỆT NAM</Typography>
          <Stack spacing={0.5}>
            <Link href="#" underline="hover" color="inherit">Về Spring Commerce</Link>
            <Link href="#" underline="hover" color="inherit">Tuyển Dụng</Link>
            <Link href="#" underline="hover" color="inherit">Điều Khoản</Link>
            <Link href="#" underline="hover" color="inherit">Chính Sách Bảo Mật</Link>
            <Link href="#" underline="hover" color="inherit">Spring Mall</Link>
            <Link href="#" underline="hover" color="inherit">Kênh Người Bán</Link>
            <Link href="#" underline="hover" color="inherit">Flash Sale</Link>
            <Link href="#" underline="hover" color="inherit">Tiếp Thị Liên Kết</Link>
            <Link href="#" underline="hover" color="inherit">Liên Hệ Truyền Thông</Link>
          </Stack>
        </Box>
        {/* Thanh toán & Vận chuyển */}
        <Box sx={{ minWidth: 180, flex: '1 1 180px' }}>
          <Typography fontWeight={700} mb={1} variant="subtitle1">THANH TOÁN</Typography>
          <Stack direction="row" spacing={1} mb={2}>
            <Box sx={{ width: 36, height: 24, bgcolor: '#fff', borderRadius: 1, border: '1px solid #eee' }} />
            <Box sx={{ width: 36, height: 24, bgcolor: '#fff', borderRadius: 1, border: '1px solid #eee' }} />
            <Box sx={{ width: 36, height: 24, bgcolor: '#fff', borderRadius: 1, border: '1px solid #eee' }} />
          </Stack>
          <Typography fontWeight={700} mb={1} variant="subtitle1">ĐƠN VỊ VẬN CHUYỂN</Typography>
          <Stack direction="row" spacing={1}>
            <Box sx={{ width: 36, height: 24, bgcolor: '#fff', borderRadius: 1, border: '1px solid #eee' }} />
            <Box sx={{ width: 36, height: 24, bgcolor: '#fff', borderRadius: 1, border: '1px solid #eee' }} />
            <Box sx={{ width: 36, height: 24, bgcolor: '#fff', borderRadius: 1, border: '1px solid #eee' }} />
          </Stack>
        </Box>
        {/* Theo dõi Spring Commerce */}
        <Box sx={{ minWidth: 180, flex: '1 1 180px' }}>
          <Typography fontWeight={700} mb={1} variant="subtitle1">THEO DÕI SPRING COMMERCE</Typography>
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <FacebookIcon fontSize="small" />
              <Link href="#" underline="hover" color="inherit">Facebook</Link>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <InstagramIcon fontSize="small" />
              <Link href="#" underline="hover" color="inherit">Instagram</Link>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <LinkedInIcon fontSize="small" />
              <Link href="#" underline="hover" color="inherit">LinkedIn</Link>
            </Stack>
          </Stack>
        </Box>
        {/* Tải ứng dụng */}
        <Box sx={{ minWidth: 180, flex: '1 1 180px' }}>
          <Typography fontWeight={700} mb={1} variant="subtitle1">TẢI ỨNG DỤNG SPRING COMMERCE</Typography>
          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            <QrCode2Icon sx={{ fontSize: 48 }} />
            <Stack spacing={0.5}>
              <Button startIcon={<AppleIcon />} size="small" variant="outlined">App Store</Button>
              <Button startIcon={<AndroidIcon />} size="small" variant="outlined">Google Play</Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
      <Divider sx={{ my: 3 }} />
      <Typography align="center" color="text.secondary" variant="body2" sx={{ mb: 1 }}>
        © {new Date().getFullYear()} Spring Commerce. Tất cả các quyền được bảo lưu.
      </Typography>
      <Typography align="center" color="text.secondary" variant="caption">
        Chính sách bảo mật | Quy chế hoạt động | Chính sách vận chuyển | Chính sách trả hàng và hoàn tiền
      </Typography>
    </Container>
  </Box>
);

export default Footer;