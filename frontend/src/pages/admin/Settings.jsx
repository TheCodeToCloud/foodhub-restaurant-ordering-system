import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiSave, FiLock, FiInfo, FiClock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  
  // Dummy states for the UI
  const [storeName, setStoreName] = useState('FoodHub');
  const [contactEmail, setContactEmail] = useState('hello@foodhub.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [isOpen, setIsOpen] = useState(true);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSaveInfo = (e) => {
    e.preventDefault();
    // Simulate API call
    toast.success('Restaurant information updated successfully!');
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
    // Simulate API call
    toast.success('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
  };

  const toggleStoreStatus = () => {
    setIsOpen(!isOpen);
    toast.info(`Store is now ${!isOpen ? 'Open' : 'Closed'} for new orders.`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Platform Settings</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: General Info & Status */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Store Info Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <FiInfo size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Restaurant Information</h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleSaveInfo} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                  <input 
                    type="text" 
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                    <input 
                      type="email" 
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm">
                    <FiSave /> Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <FiLock size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Security</h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="pt-2 flex justify-end">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm">
                    <FiLock /> Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>

        {/* Right Column: Status & Mini-profile */}
        <div className="space-y-8">
          
          {/* Operational Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <FiClock size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Store Status</h3>
            </div>
            <div className="p-6 flex flex-col items-center justify-center space-y-4">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${isOpen ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'}`}>
                <span className={`text-2xl font-bold ${isOpen ? 'text-green-600' : 'text-red-600'}`}>
                  {isOpen ? 'OPEN' : 'CLOSED'}
                </span>
              </div>
              <p className="text-center text-gray-500 text-sm">
                Customers {isOpen ? 'can' : 'cannot'} currently place new orders.
              </p>
              <button 
                onClick={toggleStoreStatus}
                className={`w-full py-2.5 rounded-xl font-medium transition-colors shadow-sm ${
                  isOpen 
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
                    : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                }`}
              >
                {isOpen ? 'Pause Orders' : 'Resume Orders'}
              </button>
            </div>
          </div>

          {/* Admin Profile Mini */}
          <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-md p-6 text-white text-center">
            <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-3xl font-bold mb-4 border-2 border-white/30">
              {user?.fullname?.charAt(0) || 'A'}
            </div>
            <h3 className="text-xl font-bold mb-1">{user?.fullname || 'Administrator'}</h3>
            <p className="text-white/80 text-sm mb-4">{user?.email}</p>
            <div className="bg-white/10 rounded-lg p-3 text-sm border border-white/20">
              Role: <span className="font-semibold uppercase tracking-wider">Super Admin</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
