import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Plus, Minus } from "lucide-react";
import api from "../services/api";
import { updateCartItem, removeFromCart } from "../services/cartService";
import Button from "../components/ui/Button";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/cart");
        setCart(res.data);
      } catch (err) {
        console.error("Cart load error:", err);
        setError("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleCheckout = () => {
    if (cart && cart.items.length > 0) {
      navigate("/checkout");
    }
  };

  const handleQuantityChange = async (itemId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) return; // Minimum 1, use delete to remove

    try {
      const updatedCart = await updateCartItem(itemId, newQty);
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!window.confirm("Remove this item from cart?")) return;
    try {
      const updatedCart = await removeFromCart(itemId);
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900 text-red-500">
      {error}
    </div>
  );

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
          <ShoppingBag className="text-primary-600" />
          Your Cart
        </h1>

        {isEmpty ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="bg-gray-100 dark:bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="text-gray-400" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Looks like you haven't added any sneakers to your cart yet.
            </p>
            <Link to="/products">
              <Button>
                Start Shopping <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-8">
              <div className="space-y-4">
                <AnimatePresence>
                  {cart.items
                    .filter(item => item && item.sneaker) // Filter out invalid items
                    .map((item, index) => {
                      const sneaker = item.sneaker;
                      return (
                        <motion.div
                          key={item._id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex flex-col sm:flex-row items-center gap-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 group transition-all hover:shadow-md"
                        >
                          {/* Image */}
                          <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden relative">
                            <Link to={`/product/${sneaker._id}`}>
                              {sneaker?.images?.length > 0 ? (
                                <img
                                  src={sneaker.images[0]}
                                  alt={sneaker.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  No Image
                                </div>
                              )}
                            </Link>
                          </div>

                          {/* Details */}
                          <div className="flex-1 w-full text-center sm:text-left">
                            <Link to={`/product/${sneaker._id}`} className="hover:text-primary-600 transition-colors">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                {sneaker?.name || "Sneaker"}
                              </h3>
                            </Link>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 capitalize">
                              {sneaker?.brand} • Size {item.size}
                            </p>

                            <div className="flex items-center justify-between sm:justify-start gap-4">
                              <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 rounded-lg p-1">
                                <button
                                  onClick={() => handleQuantityChange(item._id, item.quantity, -1)}
                                  className="p-1 rounded-md hover:bg-white dark:hover:bg-gray-800 shadow-sm transition-all disabled:opacity-50"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus size={16} className="text-gray-600 dark:text-gray-400" />
                                </button>
                                <span className="text-sm px-2 font-bold text-gray-900 dark:text-white w-4 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(item._id, item.quantity, 1)}
                                  className="p-1 rounded-md hover:bg-white dark:hover:bg-gray-800 shadow-sm transition-all"
                                >
                                  <Plus size={16} className="text-gray-600 dark:text-gray-400" />
                                </button>
                              </div>

                              {/* Mobile Price & Remove */}
                              <div className="flex sm:hidden items-center gap-3">
                                <p className="text-lg font-bold text-primary-600">
                                  ₹{(sneaker?.price || 0) * item.quantity}
                                </p>
                                <button
                                  className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                                  title="Remove item"
                                  onClick={() => handleRemoveItem(item._id)}
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Desktop Price & Remove */}
                          <div className="hidden sm:flex flex-col items-end gap-4">
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              ₹{(sneaker?.price || 0) * item.quantity}
                            </p>
                            <button
                              className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Remove item"
                              onClick={() => handleRemoveItem(item._id)}
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                </AnimatePresence>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>
                      ₹{cart.items.reduce((acc, item) => item?.sneaker ? acc + (item.sneaker.price || 0) * item.quantity : acc, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>
                      ₹{cart.items.reduce((acc, item) => item?.sneaker ? acc + (item.sneaker.price || 0) * item.quantity : acc, 0)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full py-4 text-base"
                >
                  Proceed to Checkout
                </Button>

                <div className="mt-6 text-center">
                  <Link to="/products" className="text-sm text-gray-500 hover:text-primary-600 hover:underline inline-flex items-center">
                    <ArrowLeft size={14} className="mr-1" /> Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
