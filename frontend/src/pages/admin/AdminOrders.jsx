import { useEffect, useState } from "react";
import { Filter, Eye, CheckCircle, Truck, Clock, Package } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import api from "../../services/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (activeTab === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order =>
        order.status?.toLowerCase() === activeTab.toLowerCase() ||
        (activeTab === 'pending' && !order.status) // Handle empty status as pending
      ));
    }
  }, [activeTab, orders]);

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      fetchOrders(); // refresh
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const tabs = [
    { id: "all", label: "All Orders" },
    { id: "pending", label: "Pending" },
    { id: "shipped", label: "Shipped" },
    { id: "delivered", label: "Delivered" }
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'out for delivery': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Order Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Track and manage customer orders</p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-900 p-1 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm mb-6 inline-flex overflow-x-auto max-w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap
                            ${activeTab === tab.id
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}
                        `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order Detail</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No orders found.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-gray-500">#{order._id.slice(-6).toUpperCase()}</span>
                      <div className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                        {order.orderItems?.length} items
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {/* Assuming user name is populated or fallback */}
                      {order.user?.name || "Customer"}
                      <div className="text-xs text-gray-400">{order.user?.email || "email@example.com"}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                      <div className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                      ₹{order.totalPrice}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {order.status !== "Delivered" && (
                        <div className="flex justify-end gap-2">
                          {(!order.status || order.status === 'Processing') && (
                            <button
                              onClick={() => updateStatus(order._id, "Shipped")}
                              title="Mark as Shipped"
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-lg transition-colors"
                            >
                              <Truck size={18} />
                            </button>
                          )}
                          {order.status === 'Shipped' && (
                            <button
                              onClick={() => updateStatus(order._id, "Out for Delivery")}
                              title="Mark Out for Delivery"
                              className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/10 rounded-lg transition-colors"
                            >
                              <Package size={18} />
                            </button>
                          )}
                          {order.status === 'Out for Delivery' && (
                            <button
                              onClick={() => updateStatus(order._id, "Delivered")}
                              title="Mark Delivered"
                              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/10 rounded-lg transition-colors"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
