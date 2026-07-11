import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../../api/axios';
import { FiClock, FiXCircle } from 'react-icons/fi';

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Preparing: 'bg-blue-100 text-blue-700',
    Ready: 'bg-green-100 text-green-700',
    Delivered: 'bg-gray-100 text-gray-700',
    Cancelled: 'bg-red-100 text-red-700'
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders');
      setOrders(res.data);
    } catch (error) {
      toast.error('Failed to load your orders.');
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await API.put(`/orders/${orderId}`, { status: 'Cancelled' });
        toast.success('Order cancelled successfully.');
        // Update state locally
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: 'Cancelled' } : order
        ));
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to cancel order.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-500">View your active and past orders</p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const dateObj = new Date(order.order_date);
            const isPending = order.status === 'Pending';
            
            return (
              <div key={order.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start md:items-center">
                {/* Food Image */}
                <div className="w-24 h-24 rounded-2xl bg-gray-100 overflow-hidden shrink-0">
                  {order.food_image ? (
                    <img src={order.food_image?.startsWith('http') ? order.food_image : `http://localhost:5000/${order.food_image}`} alt={order.food_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                  )}
                </div>
                
                {/* Order Details */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{order.food_name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-500">#{order.id}</span>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1.5"><FiClock className="text-gray-400"/> {dateObj.toLocaleString()}</span>
                    <span><strong className="text-gray-900">Qty:</strong> {order.quantity}</span>
                    <span><strong className="text-gray-900">Price:</strong> ${Number(order.unit_price).toFixed(2)}</span>
                  </div>
                  
                  <div className="text-lg font-extrabold text-orange-600">
                    Total: ${Number(order.total_price).toFixed(2)}
                  </div>
                </div>

                {/* Cancel Action */}
                <div className="w-full md:w-auto shrink-0 md:pl-6 md:border-l border-gray-100 flex flex-col justify-center">
                  {isPending ? (
                    <button 
                      onClick={() => cancelOrder(order.id)}
                      className="w-full py-2.5 px-6 rounded-xl bg-red-50 text-red-600 hover:bg-red-500 hover:text-white font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <FiXCircle /> Cancel Order
                    </button>
                  ) : (
                    <div className="py-2.5 px-6 rounded-xl bg-gray-50 text-gray-400 font-medium text-center text-sm border border-gray-100">
                      Cannot modify
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <FiClock className="mx-auto text-4xl text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h3>
          <p className="text-gray-500">You haven't placed any orders. Go to the menu to order your first meal!</p>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
