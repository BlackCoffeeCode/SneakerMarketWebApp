import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 mb-4 inline-block">
                            Brand<span className="text-gray-900 dark:text-white">Name</span>
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                            Elevating your sneaker game with exclusive drops and premium style. Join the movement.
                        </p>
                        <div className="flex space-x-4">
                            <SocialIcon icon={<Facebook size={20} />} href="/#" />
                            <SocialIcon icon={<Twitter size={20} />} href="/#" />
                            <SocialIcon icon={<Instagram size={20} />} href="/#" />
                            <SocialIcon icon={<Youtube size={20} />} href="/#" />
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6">Shop</h4>
                        <ul className="space-y-4">
                            <FooterLink to="/products">All Sneakers</FooterLink>
                            <FooterLink to="/products">New Arrivals</FooterLink>
                            <FooterLink to="/products?category=men">Men's Collection</FooterLink>
                            <FooterLink to="/products?category=women">Women's Collection</FooterLink>
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6">Customer Care</h4>
                        <ul className="space-y-4">
                            <FooterLink to="/account">My Account</FooterLink>
                            <FooterLink to="/orders">Track Order</FooterLink>
                            <FooterLink to="/help">Help Center</FooterLink>
                            <FooterLink to="/returns">Returns & Exchanges</FooterLink>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6">Stay in the Loop</h4>
                        <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
                            Subscribe for exclusive drops and early access.
                        </p>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            toast.success("Thanks for subscribing!");
                            e.target.reset();
                        }}
                            className="relative">
                            <input
                                required
                                type="email"
                                placeholder="Your email address"
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-4 pr-12 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            />
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                                <ArrowRight size={16} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <p>&copy; {new Date().getFullYear()} BrandName. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/privacy" className="hover:text-primary-600 transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-primary-600 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialIcon = ({ icon, href }) => (
    <a
        href={href}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary-600 hover:text-white transition-all duration-300"
    >
        {icon}
    </a>
);

const FooterLink = ({ to, children }) => (
    <li>
        <Link to={to} className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            {children}
        </Link>
    </li>
);

export default Footer;
