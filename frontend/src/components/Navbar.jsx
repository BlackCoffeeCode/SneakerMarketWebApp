import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, logout, switchRole, becomeAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
            Brand<span className="text-gray-900 dark:text-white">Name</span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex space-x-8 items-center">
            {/* Conditional Home/Dashboard Link */}
            <Link
              to={user?.activeRole === 'admin' ? "/seller" : "/"}
              className="text-gray-700 dark:text-gray-200 hover:text-primary-600 font-medium transition-colors"
            >
              {user?.activeRole === 'admin' ? "Seller Dashboard" : "Home"}
            </Link>

            <Link to="/products" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 font-medium transition-colors">Shop</Link>

            {/* USER MODE LINKS */}
            {user && user.activeRole === "user" && (
              <>
                <Link to="/cart" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 font-medium transition-colors">Cart</Link>
                <Link to="/account" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 font-medium transition-colors">My Account</Link>
              </>
            )}

            {/* ADMIN MODE LINKS */}
            {user && user.activeRole === "admin" && (
              <>
                {/* Replaced Dashboard with My Account as requested */}
                <Link to="/account" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 font-medium transition-colors">My Account</Link>
              </>
            )}

            {!user ? (
              <>
                <Link to="/login" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 font-medium transition-colors">Login</Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-700 transition-all shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                {/* 🔁 ROLE SWITCH DROPDOWN */}
                <select
                  value={user.activeRole}
                  onChange={(e) => {
                    if (e.target.value === 'become_seller') {
                      becomeAdmin();
                    } else {
                      switchRole(e.target.value);
                    }
                  }}
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2"
                >
                  <option value="user">User</option>
                  {user.role === "admin" ? (
                    <option value="admin">Seller</option>
                  ) : (
                    <option value="become_seller">Become a Seller</option>
                  )}
                </select>

                <button
                  onClick={logout}
                  className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-200 hover:text-primary-600 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 absolute w-full left-0 top-16 shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
            >
              Shop
            </Link>

            {user && user.activeRole === "user" && (
              <>
                <Link
                  to="/cart"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                >
                  Cart
                </Link>
                <Link
                  to="/account"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                >
                  My Account
                </Link>
              </>
            )}

            {user && user.activeRole === "admin" && (
              <>
                <Link
                  to="/seller"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                >
                  Seller Dashboard
                </Link>
                <Link
                  to="/seller/products"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                >
                  Manage Products
                </Link>
                <Link
                  to="/seller/orders"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                >
                  Manage Orders
                </Link>
              </>
            )}

            {!user ? (
              <div className="pt-4 flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center w-full px-4 py-2 border border-blue-200 text-primary-600 rounded-xl font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center w-full bg-primary-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-700"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3">
                <div className="flex items-center justify-between px-3">
                  <span className="text-sm font-medium text-gray-500">Active Role:</span>
                  <select
                    value={user.activeRole}
                    onChange={(e) => switchRole(e.target.value)}
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded-lg p-1"
                  >
                    <option value="user">User</option>
                    {user.role === "admin" && <option value="admin">Seller</option>}
                  </select>
                </div>

                {user.role === "user" && (
                  <button
                    onClick={becomeAdmin}
                    className="text-left px-3 text-sm font-medium text-primary-600"
                  >
                    Become Seller
                  </button>
                )}

                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="text-left px-3 text-sm font-medium text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
