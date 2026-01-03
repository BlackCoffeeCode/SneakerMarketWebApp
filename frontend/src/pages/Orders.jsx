import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle, AlertCircle, ShoppingBag, Truck, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Button from "../components/ui/Button";

const TrackingTimeline = ({ status }) => {
  const steps = [
    { label: "Order Confirmed", icon: Package },
    { label: "Shipped", icon: Truck },
    { label: "Out for Delivery", icon: MapPin },
    { label: "Delivered", icon: CheckCircle }
  ];

  // Determine current step index based on status string (mock logic)
  let currentStep = 0;
  const lowerStatus = status?.toLowerCase() || "";

  if (lowerStatus.includes("delivered")) currentStep = 3;
  else if (lowerStatus.includes("out")) currentStep = 2;
  else if (lowerStatus.includes("shipped")) currentStep = 1;
  else currentStep = 0; // Confirmed/Processing

  return (
    <div className="py-6 w-full">
      <div className="relative flex items-center justify-between w-full max-w-2xl mx-auto">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 dark:bg-gray-700 -translate-y-1/2 -z-0"></div>
        <div
          className="absolute top-1/2 left-0 h-1 bg-primary-500 transition-all duration-500 -translate-y-1/2 -z-0"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, index) => {
          const isActive = index <= currentStep;
          const isCompleted = index < currentStep;
          const Icon = step.icon;

          return (
            <div key={index} className="flex flex-col items-center relative z-10 group">
              <div
                className={`
                                    w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300
                                    ${isActive
                    ? 'bg-primary-600 border-white dark:border-gray-800 text-white shadow-lg scale-110'
                    : 'bg-gray-200 dark:bg-gray-700 border-white dark:border-gray-800 text-gray-500 dark:text-gray-400'}
                                `}
              >
                <Icon size={16} />
              </div>
              <span
                className={`
                                    absolute top-12 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors duration-300
                                    ${isActive ? 'text-primary-700 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}
                                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/my");
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'shipped': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'processing': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-800';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
          <Package className="text-primary-600" />
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="bg-gray-100 dark:bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="text-gray-400" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No orders yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Start shopping to populate your order history.
            </p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Order ID: <span className="font-mono text-gray-700 dark:text-gray-300">#{order._id.slice(-6).toUpperCase()}</span>
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide flex items-center gap-2 ${getStatusColor(order.status)}`}>
                      {order.status === 'Delivered' ? <CheckCircle size={14} /> : <Clock size={14} />}
                      {order.status || 'Processing'}
                    </div>
                  </div>

                  {/* Order Tracking Visualization */}
                  <div className="mb-8 px-2 sm:px-6">
                    <TrackingTimeline status={order.status} />
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-between items-center">
                    <div className="flex -space-x-3 overflow-hidden">
                      {/* Accessing orderItems if available, otherwise simplified */}
                      {order.orderItems?.slice(0, 3).map((item, i) => (
                        <div key={i} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center overflow-hidden">
                          {/* Placeholder or image if mapped */}
                          <ShoppingBag size={16} className="text-gray-400" />
                        </div>
                      ))}
                      {order.orderItems?.length > 3 && (
                        <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs text-gray-500 font-medium">
                          +{order.orderItems.length - 3}
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Total Amount:</span>
                      <span className="text-lg font-bold text-primary-600">₹{order.totalPrice}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
