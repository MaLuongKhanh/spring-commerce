import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { store } from './store';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import Header from './components/Layout/Header';
import { setUser } from './store/slices/authSlice';
import { getUserById } from './services/user.service';
import Products from './pages/Products';
import CategoryProducts from './pages/CategoryProducts';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import UserManagement from './components/admin/UserManagement';
import OrderManagement from './components/admin/OrderManagement';
import ProductManagement from './components/admin/ProductManagement';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      getUserById(Number(userId)).then(user => {
        dispatch(setUser(user));
      });
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Các trang không có header/footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute requireAdmin>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/users" element={<UserManagement />} />
                  <Route path="/orders" element={<OrderManagement />} />
                  <Route path="/products" element={<ProductManagement />} />
                </Routes>
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* Các trang có header/footer */}
        <Route
          path="/*"
          element={
            <>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/category/:categoryId" element={<CategoryProducts />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<Orders />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;