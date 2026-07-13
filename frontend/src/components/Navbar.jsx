import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser, FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, BACKEND_URL } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getAvatarSrc = () => {
    if (!user?.profile_image) return null;
    return user.profile_image.match(/^(http|data:image)/)
      ? user.profile_image
      : `${BACKEND_URL}/${user.profile_image}`;
  };
  const avatarSrc = getAvatarSrc();
  const initials = (user?.fullname || user?.email || 'U').charAt(0).toUpperCase();

  const NavLinks = () => (
    <>
      <Link to="/" className="text-gray-600 duration-[1s] hover:text-orange-500 font-medium transition-colors small-font">Home</Link>
      <Link to="/#about" className="text-gray-600 duration-[1s] hover:text-orange-500 font-medium transition-colors small-font">About</Link>
      <Link to="/#contact" className="text-gray-600 duration-[1s] hover:text-orange-500 font-medium transition-colors small-font">Contact</Link>

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
            {/* Avatar + Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                {avatarSrc ? (
                  <img src={avatarSrc} alt="avatar" onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullname || 'U')}&background=fed7aa&color=c2410c&bold=true`; }} className="w-8 h-8 rounded-full object-cover border-2 border-orange-400" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-orange-100 border-2 border-orange-400 flex items-center justify-center text-orange-600 font-bold text-sm">
                    {initials}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 hidden md:block">{user.fullname || user.email.split('@')[0]}</span>
                <FiChevronDown size={14} className="text-gray-500" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    <FiUser size={14} /> My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <FiLogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-3 ml-2">
          <Link to="/login" className="text-gray-600 duration-[1s] hover:text-orange-500 font-medium transition-colors small-font">Login</Link>
          <Link
            to="/register"
            className="bg-orange-500 hover:bg-orange-500  text-white font-medium small-font duration-[1s] px-5 py-2 rounded-full shadow-sm shadow-orange-500/30 transition-all hover:-translate-y-0.5"
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
          <div className="bg-gradient-to-br from-orange-500 to-purple-600 text-white p-2 rounded-3xl shadow-lg/10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
            </svg>
          </div>
          <span className="text-2xl small-font font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-purple-500">
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
