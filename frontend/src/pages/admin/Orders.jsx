import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../../api/axios';
import { FiSearch } from 'react-icons/fi';

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Preparing: 'bg-blue-100 text-blue-700',
    Ready: 'bg-green-100 text-green-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700'
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders');
      setOrders(res.data);
    } catch (error) {
      toast.error('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}`, { status: newStatus });
      toast.success(`Order #${orderId} marked as ${newStatus}`);
      // Update local state to avoid refetching everything instantly
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update order status');
    }
  };

  // Filter orders based on search term (ID, Customer Name, or Food)
  const filteredOrders = orders.filter(order => {
    const search = searchTerm.toLowerCase();
    return (
      order.id.toString().includes(search) ||
      (order.customer_name && order.customer_name.toLowerCase().includes(search)) ||
      (order.food_name && order.food_name.toLowerCase().includes(search))
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
        <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
        
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <FiSearch />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm text-sm"
            placeholder="Search by Order ID, Customer, Food..."
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-sm text-gray-500">
                <th className="px-6 py-4 font-medium w-24">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer Details</th>
                <th className="px-6 py-4 font-medium">Food Item</th>
                <th className="px-6 py-4 font-medium">Qty</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Order Date</th>
                <th className="px-6 py-4 font-medium">Current Status</th>
                <th className="px-6 py-4 font-medium text-right">Update Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const dateObj = new Date(order.order_date);
                  const formattedDate = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-gray-900 font-bold">#{order.id}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-800">{order.customer_name}</p>
                        <p className="text-xs text-gray-500">{order.customer_email}</p>
                        <p className="text-xs text-gray-500">{order.customer_phone}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{order.food_name}</td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{order.quantity}</td>
                      <td className="px-6 py-4 text-gray-900 font-bold">Rs. {Number(order.total_price).toFixed(2)}</td>
                      <td className="px-6 py-4 text-gray-500 text-xs">{formattedDate}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2 outline-none cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Ready">Ready</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'No orders match your search criteria.' : 'No orders found.'}
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

export default Orders;
