import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiUser, FiPhone, FiMapPin, FiCamera, FiSave } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';

const Profile = () => {
  const { user, updateUser, BACKEND_URL } = useAuth();
  const [fullname, setFullname] = useState(user?.fullname || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const getImageSrc = () => {
    if (preview) return preview;
    if (user?.profile_image) {
      return user.profile_image.match(/^(http|data:image)/)
        ? user.profile_image
        : `${BACKEND_URL}/${user.profile_image}`;
    }
    return null;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('fullname', fullname);
      formData.append('phone', phone);
      formData.append('address', address);
      if (imageFile) formData.append('profile_image', imageFile);

      const res = await API.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(res.data.user);
      toast.success('Profile updated successfully!');
      setImageFile(null);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const initials = (user?.fullname || user?.email || 'U').charAt(0).toUpperCase();
  const imageSrc = getImageSrc();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-500 mt-1">Manage your personal information</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Profile Picture Section */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-8 flex flex-col items-center">
            <div className="relative group">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Profile"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullname || 'U')}&background=fed7aa&color=c2410c&bold=true`; }}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-white/30 border-4 border-white flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {initials}
                </div>
              )}
              {/* Camera overlay */}
              <label
                htmlFor="profile_image"
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
              >
                <FiCamera className="text-white" size={24} />
              </label>
              <input
                id="profile_image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <h2 className="text-white font-bold text-xl mt-3">{user?.fullname || 'User'}</h2>
            <p className="text-white/80 text-sm">{user?.email}</p>
            <span className="mt-2 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full capitalize">
              {user?.role}
            </span>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-orange-400 transition-colors">
                <FiUser className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={fullname}
                  onChange={e => setFullname(e.target.value)}
                  className="flex-1 outline-none text-gray-800 bg-transparent"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
              <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-orange-400 transition-colors">
                <FiPhone className="text-gray-400 shrink-0" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="flex-1 outline-none text-gray-800 bg-transparent"
                  placeholder="Your phone number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
              <div className="flex items-start gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-orange-400 transition-colors">
                <FiMapPin className="text-gray-400 shrink-0 mt-0.5" />
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  rows={2}
                  className="flex-1 outline-none text-gray-800 bg-transparent resize-none"
                  placeholder="Your delivery address"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email (read-only)</label>
              <div className="flex items-center gap-3 border border-gray-100 bg-gray-50 rounded-xl px-4 py-3">
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="flex-1 outline-none text-gray-400 bg-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 rounded-xl shadow-md shadow-orange-200 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FiSave size={18} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
