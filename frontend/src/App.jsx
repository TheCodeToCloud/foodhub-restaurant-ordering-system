import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/customer/Menu';
import MyOrders from './pages/customer/MyOrders';
import Profile from './pages/shared/Profile';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Categories from './pages/admin/Categories';
import Foods from './pages/admin/Foods';
import Orders from './pages/admin/Orders';
import Customers from './pages/admin/Customers';
import Settings from './pages/admin/Settings';
import { AuthProvider } from './context/AuthContext';

// Simple placeholder for unimplemented admin pages
const Placeholder = ({ title }) => (
  <div className="flex items-center justify-center h-full">
    <h2 className="text-2xl font-bold text-gray-400">{title} Page Coming Soon</h2>
  </div>
);

// Define routing structure using react-router-dom v7 data routers
const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'customer/menu',
        element: <Menu />
      },
      {
        path: 'customer/orders',
        element: <MyOrders />
      },
      {
        path: 'profile',
        element: <Profile />
      }
    ]
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "foods",
        element: <Foods />
      },
      {
        path: "categories",
        element: <Categories />
      },
      {
        path: "orders",
        element: <Orders />
      },
      {
        path: "customers",
        element: <Customers />
      },
      {
        path: "settings",
        element: <Settings />
      },
      {
        path: "profile",
        element: <Profile />
      }
    ]
  }
]);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
