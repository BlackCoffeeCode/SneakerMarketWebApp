import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, PlusCircle, LogOut, Menu, X, User, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../../components/Footer';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { label: 'My Account', path: '/account', icon: User },
        { label: 'Dashboard', path: '/seller', icon: LayoutDashboard },
        { label: 'Products', path: '/seller/products', icon: Package },
        { label: 'Add Product', path: '/seller/products/add', icon: PlusCircle },
        { label: 'Orders', path: '/seller/orders', icon: ShoppingBag },
        { label: 'Cart', path: '/cart', icon: ShoppingBag },
    ];

    const handleLogout = () => {
        // Clear tokens/auth state if implemented here
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        navigate("/login");
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
            <div className="p-6 flex items-center justify-center border-b border-gray-100 dark:border-gray-800">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
                    BRAND<span className="text-primary-600">.SELLER</span>
                </h1>
            </div>

            <nav className="flex-1 py-6 px-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path) || (item.path !== '/seller' && location.pathname.startsWith(item.path));

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                                ${active
                                    ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400 font-bold'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}
                            `}
                        >
                            <Icon size={20} className={`mr-3 ${active ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'}`} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                        <User size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">Seller Account</p>
                        <p className="text-xs text-gray-400">admin@test.com</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                >
                    <LogOut size={18} className="mr-2" />
                    Sign Out
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex font-sans overflow-x-hidden">
            {/* Desktop Sidebar (Fixed) */}
            <aside className="hidden lg:block w-64 fixed inset-y-0 left-0 z-30">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="lg:hidden fixed inset-0 bg-black z-40"
                    />
                )}
            </AnimatePresence>

            {/* Mobile Sidebar (Slide-over) */}
            <aside
                className={`lg:hidden fixed inset-y-0 left-0 w-72 z-50 bg-white dark:bg-gray-900 transition-transform duration-300 ease-in-out transform shadow-2xl
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="absolute right-2 top-2 p-2">
                    <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <X size={24} />
                    </button>
                </div>
                <SidebarContent />
            </aside>

            {/* Main Content Area */}
            {/* 
                Desktop: ml-64 (always pushed by fixed sidebar)
                Mobile: transition-all. If open, push right by 72 (sidebar width).
            */}
            <main
                className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out
                    lg:ml-64
                    ${isMobileMenuOpen ? 'translate-x-72' : 'translate-x-0'}
                `}
            >
                {/* Mobile Header - only visible on mobile */}
                <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between sticky top-[64px] z-20">
                    <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">
                        BRAND<span className="text-primary-600">.SELLER</span>
                    </h1>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 dark:text-gray-300">
                        <Menu size={24} />
                    </button>
                </div>

                <div className="p-4 sm:p-6 lg:p-8 flex-1">
                    {children}
                </div>

                {/* Footer is now inside key layout container to shift with content */}
                <Footer />
            </main>
        </div>
    );
};

export default AdminLayout;
