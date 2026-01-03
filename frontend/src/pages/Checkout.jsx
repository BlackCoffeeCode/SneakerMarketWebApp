import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Button from "../components/ui/Button";
import { CheckCircle, CreditCard, Truck } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await api.get("/cart");
        if (!data || data.items.length === 0) {
          navigate("/cart");
        }
        setCart(data);
      } catch (error) {
        console.error("Failed to load cart", error);
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [navigate]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      // In a real app, this would integrate with Stripe/Razorpay
      // For now, we simulate sending the order data
      await api.post("/orders", {
        orderItems: cart.items.map(item => ({
          sneaker: item.sneaker._id,
          quantity: item.quantity,
          price: item.sneaker.price
        })),
        shippingAddress,
        paymentMethod,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: cart.items.reduce((acc, item) => acc + item.sneaker.price * item.quantity, 0)
      });

      // Clear cart logic usually happens on backend or requires a separate call if not handled automatically
      // Assuming backend clears cart on order creation or we need to call clear cart.
      // For MVP: assume success and redirect
      navigate("/orders");
    } catch (error) {
      console.error("Order failed", error);
      alert("Failed to place order. Please try again.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  const subtotal = cart.items.reduce((acc, item) => acc + item.sneaker.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* LEFT: Forms */}
          <div className="lg:col-span-7">
            <form onSubmit={handlePlaceOrder} className="space-y-8">

              {/* Shipping Address */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                  <Truck className="text-primary-600" /> Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500"
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                      placeholder="123 Sneaker Street"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                      <input
                        required
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Postal Code</label>
                      <input
                        required
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500"
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                        placeholder="10001"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500"
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                      placeholder="United States"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                  <CreditCard className="text-primary-600" /> Payment Method
                </h2>
                <div className="space-y-3">
                  {['Credit Card', 'PayPal', 'Cash on Delivery'].map((method) => (
                    <label key={method} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === method ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                      <input
                        type="radio"
                        name="payment"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                      />
                      <span className="ml-3 font-medium text-gray-900 dark:text-white">{method}</span>
                    </label>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {cart.items.map(item => (
                  <div key={item._id} className="flex gap-4">
                    <img src={item.sneaker.images[0]} alt={item.sneaker.name} className="w-16 h-16 rounded-md object-cover bg-gray-100" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{item.sneaker.name}</h4>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">₹{item.sneaker.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-2">
                  <span>Total</span>
                  <span>₹{subtotal}</span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                className="w-full mt-8 py-4 text-lg shadow-lg shadow-primary-500/30"
              >
                Place Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
