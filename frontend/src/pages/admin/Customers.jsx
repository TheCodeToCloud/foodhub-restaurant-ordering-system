import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../../api/axios';
import { FiSearch, FiTrash2, FiExternalLink, FiUser } from 'react-icons/fi';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await API.get('/users');
      // Ensure we only display customers, though backend might already filter or we can filter it here
      const customerData = res.data.filter(u => u.role === 'customer');
      setCustomers(customerData);
    } catch (error) {
      toast.error('Failed to fetch customers.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this customer? This will also remove all their order history.')) {
      try {
        await API.delete(`/users/${id}`);
        toast.success('Customer deleted successfully');
        setCustomers(customers.filter(c => c.id !== id));
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to delete customer');
      }
    }
  };

  // Filter based on search term (Name, Email, or Phone)
  const filteredCustomers = customers.filter(customer => {
    const search = searchTerm.toLowerCase();
    return (
      (customer.fullname && customer.fullname.toLowerCase().includes(search)) ||
      (customer.email && customer.email.toLowerCase().includes(search)) ||
      (customer.phone && customer.phone.toLowerCase().includes(search))
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>
        
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <FiSearch />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm text-sm"
            placeholder="Search by Name, Email, Phone..."
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-sm text-gray-500">
                <th className="px-6 py-4 font-medium w-16">Profile</th>
                <th className="px-6 py-4 font-medium w-20">ID</th>
                <th className="px-6 py-4 font-medium">Customer Details</th>
                <th className="px-6 py-4 font-medium">Contact Info</th>
                <th className="px-6 py-4 font-medium">Address</th>
                <th className="px-6 py-4 font-medium text-right w-48">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0">
                        {customer.profile_image ? (
                          <img src={customer.profile_image?.startsWith('http') ? customer.profile_image : `http://localhost:5000/${customer.profile_image}`} alt="avatar" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <FiUser size={20} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">#{customer.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{customer.fullname}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-800">{customer.email}</p>
                      <p className="text-xs text-gray-500">{customer.phone || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                      {customer.address || 'No address provided'}
                    </td>
                    <td className="px-6 py-4 flex justify-end gap-3 h-full items-center pt-5">
                      <button 
                        onClick={() => toast.info('Transaction review routing placeholder.')}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                        title="Review Transactions"
                      >
                        <FiExternalLink size={18} /> <span className="text-xs font-semibold">Orders</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(customer.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                        title="Purge Record"
                      >
                        <FiTrash2 size={18} /> <span className="text-xs font-semibold">Purge</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'No customers match your search criteria.' : 'No customers found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
