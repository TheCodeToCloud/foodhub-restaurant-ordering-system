import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavLinks = () => (
    <>
      <Link to="/" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">Home</Link>
      <Link to="/#about" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">About</Link>
      <Link to="/#contact" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">Contact</Link>
      
      {user ? (
        <>
          <Link 
            to={user.role === 'admin' ? '/admin/dashboard' : '/customer/menu'} 
            className="text-gray-600 hover:text-orange-500 font-medium transition-colors"
          >
            {user.role === 'admin' ? 'Dashboard' : 'Menu'}
          </Link>
          {user.role === 'customer' && (
            <Link 
              to="/customer/orders" 
              className="text-gray-600 hover:text-orange-500 font-medium transition-colors"
            >
              My Orders
            </Link>
          )}
          <div className="flex items-center gap-4 ml-4">
            <span className="flex items-center gap-1 text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              <FiUser /> {user.fullname || user.email.split('@')[0]}
            </span>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <FiLogOut size={18} />
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-3 ml-2">
          <Link to="/login" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">Login</Link>
          <Link 
            to="/register" 
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 py-2 rounded-full shadow-sm shadow-orange-500/30 transition-all hover:-translate-y-0.5"
          >
            Register
          </Link>
        </div>
      )}
    </>
  );

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-orange-500 to-amber-500 text-white p-2 rounded-lg shadow-md">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
            </svg>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">
            FoodHub
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks />
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-600 p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-6 flex flex-col gap-4 shadow-lg absolute w-full">
          <NavLinks />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
