import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, 
  FiList, 
  FiGrid, 
  FiShoppingBag, 
  FiUsers, 
  FiSettings, 
  FiLogOut,
  FiMenu,
  FiUser
} from 'react-icons/fi';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLayout = () => {
  const { user, logout, BACKEND_URL } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const getAvatarSrc = () => {
    if (!user?.profile_image) return null;
    return user.profile_image.match(/^(http|data:image)/)
      ? user.profile_image
      : `${BACKEND_URL}/${user.profile_image}`;
  };
  const avatarSrc = getAvatarSrc();
  const initials = (user?.fullname || user?.email || 'A').charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { path: '/admin/foods', icon: <FiList />, label: 'Food Items' },
    { path: '/admin/categories', icon: <FiGrid />, label: 'Categories' },
    { path: '/admin/orders', icon: <FiShoppingBag />, label: 'Orders' },
    { path: '/admin/customers', icon: <FiUsers />, label: 'Customers' },
    { path: '/admin/settings', icon: <FiSettings />, label: 'Settings' },
    { path: '/admin/profile', icon: <FiUser />, label: 'My Profile' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-gray-100 flex flex-col shadow-sm transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        {/* Branding */}
        <div className={`h-16 flex items-center border-b border-gray-100 ${isSidebarOpen ? 'justify-between px-4' : 'justify-center'}`}>
          {isSidebarOpen && (
            <Link to="/" className="flex items-center gap-2 overflow-hidden">
              <div className="bg-gradient-to-tr from-orange-500 to-amber-500 text-white p-1.5 rounded shadow-sm shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                </svg>
              </div>
              <span className="font-bold text-gray-800 tracking-tight whitespace-nowrap">FoodHub Admin</span>
            </Link>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-orange-600 transition-colors focus:outline-none shrink-0"
            title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <FiMenu size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 py-3 rounded-xl transition-all ${isSidebarOpen ? 'px-4' : 'justify-center'} ${
                  isActive 
                    ? 'bg-orange-50 text-orange-600 font-semibold' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <span className="text-lg shrink-0">{item.icon}</span>
                {isSidebarOpen && <span className="whitespace-nowrap overflow-hidden">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className={`p-4 border-t border-gray-100 flex flex-col gap-2 ${isSidebarOpen ? '' : 'items-center px-2'}`}>
          <div className={`flex items-center rounded-xl bg-gray-50 border border-gray-100 ${isSidebarOpen ? 'gap-3 px-4 py-3' : 'justify-center p-2'}`} title={!isSidebarOpen ? user?.email : undefined}>
            {avatarSrc ? (
              <img src={avatarSrc} alt="avatar" onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullname || 'A')}&background=fed7aa&color=c2410c&bold=true`; }} className="w-8 h-8 rounded-full object-cover border-2 border-orange-300 shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-bold shrink-0">
                {initials}
              </div>
            )}
            {isSidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullname || 'Admin'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            )}
          </div>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium ${isSidebarOpen ? 'px-4 py-2' : 'p-2'}`}
            title="Logout"
          >
            <FiLogOut className="shrink-0" size={isSidebarOpen ? 16 : 20} /> 
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-8 shrink-0 shadow-sm z-10">
          <h1 className="text-xl font-bold text-gray-800 capitalize">
            {location.pathname.split('/').pop().replace('-', ' ')}
          </h1>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>

      <ToastContainer position="top-right" />
    </div>
  );
};

export default AdminLayout;
