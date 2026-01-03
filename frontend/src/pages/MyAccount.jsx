import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Package, RefreshCw, Star, Shield, LogOut,
    ChevronRight, MapPin, Phone, Mail, Camera, CreditCard,
    CheckCircle, Truck, Clock, AlertCircle, Heart, Trash2, ExternalLink
} from "lucide-react";
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Button from "../components/ui/Button"; // Assuming this exists based on context

// --- sub-components ---

const TrackingTimeline = ({ status }) => {
    const steps = [
        { label: "Order Confirmed", icon: Package },
        { label: "Shipped", icon: Truck },
        { label: "Out for Delivery", icon: MapPin },
        { label: "Delivered", icon: CheckCircle }
    ];

    let currentStep = 0;
    const lowerStatus = status?.toLowerCase() || "";

    if (lowerStatus.includes("delivered")) currentStep = 3;
    else if (lowerStatus.includes("out")) currentStep = 2;
    else if (lowerStatus.includes("shipped")) currentStep = 1;
    else currentStep = 0;

    return (
        <div className="py-6 w-full">
            <div className="relative flex items-center justify-between w-full max-w-2xl mx-auto">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 dark:bg-gray-700 -translate-y-1/2 -z-0"></div>
                <div
                    className="absolute top-1/2 left-0 h-1 bg-primary-500 transition-all duration-500 -translate-y-1/2 -z-0"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((step, index) => {
                    const isActive = index <= currentStep;
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
                    absolute top-12 text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-colors duration-300
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

// --- Sections ---

const ProfileSection = ({ user }) => (
    <div className="space-y-6">
        <div className="flex items-center gap-6 pb-6 border-b border-gray-100 dark:border-gray-700">
            <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl font-bold">
                {user?.name?.charAt(0) || "U"}
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
                <p className="text-gray-500 dark:text-gray-400">Member since {new Date().getFullYear()}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
                <div className="flex items-center gap-3 mt-2 text-gray-900 dark:text-white">
                    <Mail size={18} className="text-gray-400" />
                    <span>{user?.email}</span>
                </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</label>
                <div className="flex items-center gap-3 mt-2 text-gray-900 dark:text-white">
                    <Phone size={18} className="text-gray-400" />
                    <span>+1 (555) 123-4567</span>
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500">MOCK</span>
                </div>
            </div>
        </div>
    </div>
);

const OrdersSection = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Try to fetch real orders
                const { data } = await api.get("/orders/my");
                if (data && data.length > 0) {
                    setOrders(data);
                } else {
                    // Fallback to mock if empty to demonstrate UI
                    throw new Error("No orders found, using mock");
                }
            } catch (error) {
                // Mock Data for demonstration
                setOrders([
                    {
                        _id: "ORD-7382-MOCK",
                        createdAt: new Date().toISOString(),
                        totalPrice: 15499,
                        status: "Shipped",
                        items: 2
                    },
                    {
                        _id: "ORD-9921-MOCK",
                        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
                        totalPrice: 8999,
                        status: "Delivered",
                        items: 1
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading orders...</div>;

    return (
        <div className="space-y-6">
            {orders.map((order, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-gray-900 dark:text-white">Order #{order._id.slice(-8).toUpperCase()}</span>
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">Total: ₹{order.totalPrice}</p>
                        </div>
                        <div className={`
                            px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 self-start sm:self-center
                            ${order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}
                        `}>
                            {order.status === 'Delivered' ? <CheckCircle size={14} /> : <Truck size={14} />}
                            {order.status}
                        </div>
                    </div>

                    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-800/50">
                        <TrackingTimeline status={order.status} />
                    </div>

                    <div className="p-4 flex justify-end">
                        <Button variant="outline" size="sm">View Details</Button>
                    </div>
                </div>
            ))}
        </div>
    );
};

const ReturnsSection = () => (
    <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
            <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                <RefreshCw size={20} />
                Return Policy
            </h3>
            <p className="text-blue-600 dark:text-blue-200 text-sm leading-relaxed">
                We offer a hassle-free 7-day return policy for all unworn items in their original packaging.
                Refunds are processed within 5-7 business days after we receive your return.
            </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Active Returns</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">You don't have any return requests in progress.</p>
            <Button>Request a New Return</Button>
        </div>
    </div>
);

const ReviewsSection = () => (
    <div className="space-y-4">
        {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Nike Air Max 90</h4>
                        <div className="flex items-center gap-1 my-1">
                            {[...Array(5)].map((_, starI) => (
                                <Star key={starI} size={14} className={starI < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                            ))}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                            "Great sneakers! Very comfortable and the fit is perfect. Would definitely recommend."
                        </p>
                        <p className="text-xs text-gray-400 mt-2">Posted on Dec 12, 2024</p>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const WishlistSection = () => {
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlist(savedWishlist);
    }, []);

    const removeFromWishlist = (id) => {
        const newWishlist = wishlist.filter(item => item._id !== id);
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
        setWishlist(newWishlist);
    };

    if (wishlist.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h3>
                <p className="text-gray-500 mb-6">Save items you love to revisit them later.</p>
                <Link to="/products">
                    <Button>Explore Products</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map(item => (
                <div key={item._id} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 p-4 flex items-center justify-center">
                        <img
                            src={item.image || 'https://via.placeholder.com/300'}
                            alt={item.name}
                            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                            onClick={() => removeFromWishlist(item._id)}
                            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Remove from wishlist"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                    <div className="p-4">
                        <h4 className="font-bold text-gray-900 dark:text-white truncate mb-1">{item.name}</h4>
                        <p className="text-gray-500 text-sm mb-3">{item.brand || 'Sneaker'}</p>
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900 dark:text-white">₹{item.price}</span>
                            <Link to={`/product/${item._id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                                View <ExternalLink size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const SecuritySection = () => (
    <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield size={20} className="text-primary-600" />
                Password & Security
            </h3>

            <div className="grid gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none" disabled />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                    <input type="password" placeholder="New password" className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none" disabled />
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                    <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
                        <AlertCircle size={16} />
                        Strong Password Required
                    </h4>
                    <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1 list-disc pl-4">
                        <li>At least 8 characters long</li>
                        <li>Include at least one uppercase letter (A-Z)</li>
                        <li>Include at least one lowercase letter (a-z)</li>
                        <li>Include at least one number (0-9)</li>
                        <li>Include at least one special character (!@#$%^&*)</li>
                    </ul>
                </div>

                <Button className="w-full sm:w-auto" disabled>Update Password (Demo)</Button>
            </div>
        </div>
    </div>
);

// --- Main Page Component ---

const MyAccount = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "wishlist", label: "Wishlist", icon: Heart },
        { id: "orders", label: "My Orders", icon: Package },
        { id: "returns", label: "Returns", icon: RefreshCw },
        { id: "reviews", label: "Reviews", icon: Star },
        { id: "security", label: "Security", icon: Shield },
    ];

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            logout();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Account</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-24">
                            {/* Mobile Horizontal Scroll / Desktop Vertical Stack */}
                            <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`
                                    flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-b-4 lg:border-b-0 lg:border-l-4 whitespace-nowrap flex-shrink-0
                                    ${isActive
                                                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-400'
                                                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'}
                                `}
                                        >
                                            <Icon size={18} />
                                            {tab.label}
                                            {isActive && <ChevronRight size={16} className="ml-auto hidden lg:block" />}
                                        </button>
                                    );
                                })}

                                <div className="hidden lg:block border-t border-gray-100 dark:border-gray-700 my-2"></div>

                                <button
                                    onClick={handleLogout}
                                    className="hidden lg:flex items-center gap-3 px-6 py-4 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors w-full text-left"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </nav>
                        </div>

                        {/* Mobile Logout Button (Separate from scrollable nav) */}
                        <div className="lg:hidden mt-4">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-xl font-medium"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'profile' && <ProfileSection user={user} />}
                                {activeTab === 'wishlist' && <WishlistSection />}
                                {activeTab === 'orders' && <OrdersSection />}
                                {activeTab === 'returns' && <ReturnsSection />}
                                {activeTab === 'reviews' && <ReviewsSection />}
                                {activeTab === 'security' && <SecuritySection />}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MyAccount;
