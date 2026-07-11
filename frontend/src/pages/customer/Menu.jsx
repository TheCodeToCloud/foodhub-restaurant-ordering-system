import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API, { BACKEND_URL } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { FiSearch, FiShoppingCart, FiX, FiInfo } from 'react-icons/fi';

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Checkout Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await API.get('/foods');
      // Filter out foods that are out of stock
      const availableFoods = res.data.filter(food => food.quantity > 0);
      setFoods(availableFoods);
    } catch (error) {
      toast.error('Failed to load the menu.');
    } finally {
      setLoading(false);
    }
  };

  // Live filter: matches name, category, or ingredients
  const filteredFoods = foods.filter(food => {
    const s = searchTerm.toLowerCase();
    return (
      (food.food_name && food.food_name.toLowerCase().includes(s)) ||
      (food.category_name && food.category_name.toLowerCase().includes(s)) ||
      (food.ingredients && food.ingredients.toLowerCase().includes(s))
    );
  });

  const openCheckout = (food) => {
    if (!user) {
      toast.info('Please log in to place an order.');
      return;
    }
    setSelectedFood(food);
    setQuantity(1);
    setIsModalOpen(true);
  };

  const closeCheckout = () => {
    setIsModalOpen(false);
    setSelectedFood(null);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (quantity < 1) {
      toast.error('Quantity must be at least 1.');
      return;
    }
    
    if (quantity > selectedFood.quantity) {
      toast.error(`Only ${selectedFood.quantity} portions available.`);
      return;
    }

    setIsSubmitting(true);
    const totalPrice = Number(selectedFood.price) * quantity;

    try {
      await API.post('/orders', {
        food_id: selectedFood.id,
        quantity: parseInt(quantity, 10),
        total_price: totalPrice
      });
      
      toast.success(`Successfully ordered ${quantity}x ${selectedFood.food_name}!`);
      closeCheckout();
      
      // Optionally, re-fetch foods to update the available quantity if your backend decrements it
      fetchFoods(); 
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to place order.');
    } finally {
      setIsSubmitting(false);
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
    <div className="container mx-auto py-8">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Our Menu</h1>
          <p className="text-gray-500">Discover fresh, delicious meals carefully crafted for you.</p>
        </div>
        
        <div className="relative w-full md:w-96 shadow-sm rounded-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <FiSearch size={20} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            placeholder="Search by name, category, or ingredients..."
          />
        </div>
      </div>

      {/* Grid of Food Cards */}
      {filteredFoods.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredFoods.map((food) => (
            <div key={food.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
              {/* Image */}
              <div className="relative h-48 w-full bg-gray-100 overflow-hidden group">
                {food.image ? (
                  <img 
                    src={food.image.startsWith('http') ? food.image : `${BACKEND_URL}/${food.image}`} 
                    alt={food.food_name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur text-orange-600 px-3 py-1 text-xs font-bold rounded-full shadow-sm">
                    {food.category_name}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900 truncate pr-4" title={food.food_name}>
                    {food.food_name}
                  </h3>
                  <span className="text-lg font-bold text-orange-600 shrink-0">
                    Rs. {Number(food.price).toFixed(2)}
                  </span>
                </div>
                
                {/* Description Tooltip / Text */}
                <p className="text-sm text-gray-500 mb-4 line-clamp-2" title={food.ingredients}>
                  {food.description || food.ingredients || 'A delicious treat.'}
                </p>
                
                <div className="mt-auto">
                  <button
                    onClick={() => openCheckout(food)}
                    className="w-full py-3 bg-gray-900 hover:bg-orange-500 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <FiShoppingCart /> Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">No menu items match your search.</p>
        </div>
      )}

      {/* Checkout Modal */}
      {isModalOpen && selectedFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="relative h-32 bg-orange-100">
              {selectedFood.image && (
                <img 
                  src={selectedFood.image.startsWith('http') ? selectedFood.image : `${BACKEND_URL}/${selectedFood.image}`} 
                  className="w-full h-full object-cover opacity-50" 
                  alt="bg"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
              <button onClick={closeCheckout} className="absolute top-4 right-4 text-white hover:text-orange-400 transition-colors">
                <FiX size={24} />
              </button>
              <div className="absolute bottom-4 left-6 text-white">
                <h3 className="text-xl font-bold truncate">{selectedFood.food_name}</h3>
                <p className="font-semibold text-orange-400">Rs. {Number(selectedFood.price).toFixed(2)}</p>
              </div>
            </div>
            
            <form onSubmit={handleOrderSubmit} className="p-6">
              <div className="mb-6 bg-blue-50 p-4 rounded-xl flex items-start gap-3 border border-blue-100">
                <FiInfo className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  You are about to place an order. You can cancel it later from your dashboard as long as the status remains 'Pending'.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center gap-4">
                  <button 
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 font-bold text-lg transition-colors"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold text-gray-900 w-8 text-center">{quantity}</span>
                  <button 
                    type="button"
                    onClick={() => setQuantity(Math.min(selectedFood.quantity, quantity + 1))}
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 font-bold text-lg transition-colors"
                  >
                    +
                  </button>
                </div>
                {quantity === selectedFood.quantity && (
                  <p className="text-xs text-orange-500 mt-2 font-medium">Maximum available quantity reached.</p>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-8 flex justify-between items-center">
                <span className="text-gray-500 font-medium">Total Price:</span>
                <span className="text-3xl font-bold text-gray-900">
                  Rs. {(Number(selectedFood.price) * quantity).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeCheckout}
                  className="w-full py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors font-bold disabled:opacity-70 shadow-lg shadow-orange-500/30"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
