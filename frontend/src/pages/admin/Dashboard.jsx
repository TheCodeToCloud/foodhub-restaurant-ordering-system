import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../../api/axios';
import { 
  FiShoppingBag, 
  FiUsers, 
  FiDollarSign, 
  FiGrid, 
  FiList, 
  FiCalendar,
  FiUser
} from 'react-icons/fi';

const StatCard = ({ title, value, icon, bgColor, textColor }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
    <div className={`p-4 rounded-xl ${bgColor} ${textColor}`}>
      {icon}
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Preparing: 'bg-blue-100 text-blue-700',
    Ready: 'bg-green-100 text-green-700',
    Delivered: 'bg-green-100 text-green-700', // could use different shade if needed
    Cancelled: 'bg-red-100 text-red-700'
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await API.get('/admin/dashboard-stats');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${Number(stats?.totalRevenue || 0).toLocaleString()}`}
          icon={<FiDollarSign size={24} />} 
          bgColor="bg-green-50" 
          textColor="text-green-600" 
        />
        <StatCard 
          title="Today's Orders" 
          value={stats?.todayOrders || 0}
          icon={<FiCalendar size={24} />} 
          bgColor="bg-blue-50" 
          textColor="text-blue-600" 
        />
        <StatCard 
          title="Total Orders" 
          value={stats?.totalOrders || 0}
          icon={<FiShoppingBag size={24} />} 
          bgColor="bg-orange-50" 
          textColor="text-orange-600" 
        />
        <StatCard 
          title="Total Customers" 
          value={stats?.totalCustomers || 0}
          icon={<FiUsers size={24} />} 
          bgColor="bg-purple-50" 
          textColor="text-purple-600" 
        />
        <StatCard 
          title="Food Items" 
          value={stats?.totalFoods || 0}
          icon={<FiList size={24} />} 
          bgColor="bg-rose-50" 
          textColor="text-rose-600" 
        />
        <StatCard 
          title="Categories" 
          value={stats?.totalCategories || 0}
          icon={<FiGrid size={24} />} 
          bgColor="bg-amber-50" 
          textColor="text-amber-600" 
        />
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders Table (Takes up 2 cols on lg) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-800">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-50 text-sm text-gray-500">
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Food</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {stats?.recentOrders?.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-gray-900 font-medium">#{order.id}</td>
                      <td className="px-6 py-4 text-gray-600">{order.customer_name}</td>
                      <td className="px-6 py-4 text-gray-600">{order.food_name}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">${Number(order.total_price).toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No recent orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Customers Sidebar Widget */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-800">Newest Customers</h3>
          </div>
          <div className="p-6 flex-1 flex flex-col gap-5">
            {stats?.recentCustomers?.length > 0 ? (
              stats.recentCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0">
                    {customer.profile_image ? (
                      <img src={customer.profile_image?.startsWith('http') ? customer.profile_image : `http://localhost:5000/${customer.profile_image}`} alt="avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      customer.fullname.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{customer.fullname}</h4>
                    <p className="text-xs text-gray-500 truncate">{customer.email}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No customers found.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
