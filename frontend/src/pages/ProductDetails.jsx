import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Star, Heart, Truck, ShieldCheck, Share2, CheckCircle, ChevronDown, User, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { addToCart } from '../services/cartService';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import ARModal from '../ar/ARModal';
import { toast } from 'react-toastify';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [sneaker, setSneaker] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    // Wishlist Logic
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // Review Logic
    const [isWritingReview, setIsWritingReview] = useState(false);

    // UI State for Trust Features
    const [showAuthDetails, setShowAuthDetails] = useState(false);

    // AR State
    const [showAR, setShowAR] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch current product and all products in parallel
                const [productRes, allProductsRes] = await Promise.all([
                    api.get(`/sneakers/${id}`),
                    api.get('/sneakers')
                ]);

                const currentProduct = productRes.data;

                // MOCK: Inject 3D model URL if missing, for testing AR feature
                if (!currentProduct.model3D) {
                    currentProduct.model3D = '/models/shoe.glb';
                }

                setSneaker(currentProduct);
                setSelectedSize(9);

                // Filter for suggestions
                const allProducts = allProductsRes.data;
                const suggestions = allProducts
                    .filter(p => p._id !== currentProduct._id) // Exclude current
                    .filter(p =>
                        p.brand === currentProduct.brand || // Same Brand
                        p.category?.some(c => currentProduct.category?.includes(c)) // Or Same Category
                    )
                    .sort(() => 0.5 - Math.random()) // Shuffle
                    .slice(0, 4); // Take 4

                setRelatedProducts(suggestions);
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Check if item is already in wishlist
    useEffect(() => {
        const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        if (savedWishlist.some(item => item._id === id)) {
            setIsWishlisted(true);
        } else {
            setIsWishlisted(false);
        }
    }, [id]);

    const toggleWishlist = () => {
        if (!sneaker) return;

        const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

        if (isWishlisted) {
            // Remove
            const newWishlist = savedWishlist.filter(item => item._id !== sneaker._id);
            localStorage.setItem('wishlist', JSON.stringify(newWishlist));
            setIsWishlisted(false);
        } else {
            // Add
            const newItem = {
                _id: sneaker._id,
                name: sneaker.name,
                price: sneaker.price,
                image: sneaker.images?.[0],
                brand: sneaker.brand
            };
            localStorage.setItem('wishlist', JSON.stringify([...savedWishlist, newItem]));
            setIsWishlisted(true);

            // Show Toast
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            toast.info("Please login to add items to cart");
            navigate('/login');
            return;
        }

        if (!selectedSize) {
            toast.warn("Please select a size");
            return;
        }

        setIsAdding(true);
        try {
            await addToCart({
                sneakerId: sneaker._id,
                quantity: 1,
                size: selectedSize,
            });
            toast.success("Added to cart successfully!");
        } catch (error) {
            console.error("Add to cart failed", error);
            toast.error("Failed to add to cart");
        } finally {
            setIsAdding(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!sneaker) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
                <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
                <Button onClick={() => navigate('/')}>Go Back Home</Button>
            </div>
        );
    }

    const sizes = [7, 8, 9, 10, 11, 12, 13];

    // Mock Data for UI features
    const mockReviews = [
        { id: 1, user: "Alex K.", rating: 5, date: "2 days ago", comment: "Absolute fire! The quality is unmatched and delivery was super fast." },
        { id: 2, user: "Sarah M.", rating: 4, date: "1 week ago", comment: "Fits true to size. Verification tag gives peace of mind." },
        { id: 3, user: "Jordan P.", rating: 5, date: "2 weeks ago", comment: "Been looking for these everywhere. Best price on the market." }
    ];

    const otherSellers = [
        { name: "KicksCrew", price: sneaker.price * 1.1 },
        { name: "StockX", price: sneaker.price * 1.15 },
        { name: "Goat", price: sneaker.price * 1.12 }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-20 relative">
            {/* Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className="fixed top-24 left-1/2 z-50 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-full shadow-xl flex items-center gap-3"
                    >
                        <Heart size={18} className="text-red-500 fill-current" />
                        <span className="font-medium text-sm">Item added to your wishlist</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Collection
                </button>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-20">
                    {/* Left: Image Gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full lg:w-1/2 space-y-8"
                    >
                        <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 p-8 group">
                            {/* Gradient Background blob */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-primary-100/50 to-secondary-100/50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <img
                                src={sneaker.images?.[0] || 'https://via.placeholder.com/800x1000?text=Sneaker'}
                                alt={sneaker.name}
                                className="relative z-10 w-full h-full object-contain drop-shadow-2xl transform transition-transform duration-500 hover:scale-110 cursor-zoom-in"
                            />

                            <button
                                onClick={toggleWishlist}
                                className={`absolute top-6 right-6 z-20 p-3 backdrop-blur-sm rounded-full shadow-lg transition-all transform hover:scale-110 ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-white/80 dark:bg-gray-800/80 text-gray-400 hover:text-red-500'}`}
                            >
                                <Heart size={20} className={isWishlisted ? "fill-current" : ""} />
                            </button>

                            {/* Verified Authentic Overlay Badge */}
                            <div className="absolute bottom-6 left-6 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur list-none py-2 px-4 rounded-full shadow-lg flex items-center gap-2 border border-green-100 dark:border-green-900">
                                <CheckCircle className="text-green-500 h-5 w-5" fill="currentColor" color="white" />
                                <span className="font-bold text-sm text-gray-900 dark:text-white">Verified Authentic</span>
                            </div>
                        </div>

                        {/* MOVED: 10-Point Authenticity Check - Premium Static Card */}
                        <div className="bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-full">
                                    <ShieldCheck className="text-green-600 dark:text-green-400" size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">10-Point Authenticity Check</h3>
                            </div>

                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                {[
                                    "Original Box Condition", "Material Quality & Texture",
                                    "Stitching Precision", "Logo Placement & Font",
                                    "Tag & Label Verification", "Insole & Stitching",
                                    "Sole Pattern & Color", "UV Light Inspection",
                                    "Smell Test (Adhesives)", "Accessories & Laces"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-base text-gray-700 dark:text-gray-300">
                                        <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                        </div>

                        {/* Sustainability Impact Section */}
                        {sneaker.sustainability && (
                            <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-6 mt-6">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                                        <div className="text-emerald-600 dark:text-emerald-400">🌍</div>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Eco-Impact Score</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/20">
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1">Carbon Footprint</p>
                                        <p className="text-2xl font-black text-gray-900 dark:text-white">{sneaker.sustainability.carbonFootprint || 'N/A'}</p>
                                        <p className="text-xs text-gray-500">kg CO2e</p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/20">
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1">Recycled Content</p>
                                        <p className="text-2xl font-black text-gray-900 dark:text-white">{sneaker.sustainability.recycledMaterial || 0}%</p>
                                        <p className="text-xs text-gray-500">Materials Used</p>
                                    </div>
                                    {sneaker.sustainability.repairable && (
                                        <div className="col-span-2 bg-emerald-100/50 dark:bg-emerald-900/20 p-3 rounded-lg flex items-center justify-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                            Certified Repairable Design
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Right: Product Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full lg:w-1/2 flex flex-col h-full"
                    >
                        {/* Brand & Rating */}
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-primary-600 font-bold uppercase tracking-widest text-sm bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full">
                                {sneaker.brand || 'Sneaker Brand'}
                            </span>
                            <div className="flex items-center text-gray-900 dark:text-white font-medium">
                                <Star className="text-yellow-400 mr-2 hover:fill-yellow-400 transition-all cursor-pointer" size={20} />
                                4.9 <span className="text-gray-400 font-normal ml-1">({mockReviews.length + 125} reviews)</span>
                            </div>
                        </div>

                        {/* ID Badge */}
                        <div className="mb-2">
                            <span className="inline-block px-2 Py-1 rounded text-[10px] font-mono font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 uppercase tracking-widest border border-gray-200 dark:border-gray-700">
                                ID: {sneaker.sku || 'N/A'}
                            </span>
                        </div>

                        {/* Title & Price */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-4">
                            {sneaker.name}
                        </h1>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            ₹{sneaker.price}
                        </p>

                        {/* REPLACED: Stock Status Tag */}
                        <div className="mb-8 flex items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                In Stock
                            </span>
                            <span className="text-sm text-gray-500">Ready to ship</span>
                        </div>

                        {/* Description */}
                        <div className="prose prose-gray dark:prose-invert mb-8">
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base sm:text-lg">
                                Experience premium comfort and iconic style with the {sneaker.name}.
                                Designed for those who dare to stand out, featuring advanced cushioning
                                and durable materials for all-day wear.
                            </p>
                        </div>

                        {/* Size Selector */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-bold text-gray-900 dark:text-white">Select Size (US)</span>
                                <a
                                    href="/images/size_guide.webp"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white underline transition-colors"
                                >
                                    Size Guide
                                </a>
                            </div>
                            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-7 gap-3">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`
                                            h-12 rounded-xl text-sm font-bold transition-all duration-200
                                            ${selectedSize === size
                                                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg scale-105'
                                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white'}
                                        `}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mb-8">
                            <div className="flex-1">
                                <Button
                                    onClick={handleAddToCart}
                                    disabled={isAdding}
                                    className="w-full text-lg h-14 flex items-center justify-center gap-3"
                                >
                                    {isAdding ? "Adding..." : "Add to Cart"}
                                    {!isAdding && <ShoppingBag size={20} />}
                                </Button>
                            </div>
                            <button className="h-14 w-14 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400">
                                <Share2 size={24} />
                            </button>
                        </div>

                        {/* AR Button (Only if model available) */}
                        {sneaker.model3D && (
                            <div className="mb-8">
                                <Button
                                    variant="outline"
                                    className="w-full h-14 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10 flex items-center justify-center gap-2 group"
                                    onClick={() => setShowAR(true)}
                                >
                                    <span className="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 p-1 rounded font-black text-xs">AR</span>
                                    <span>Try On in AR</span>
                                </Button>
                            </div>
                        )}

                        {/* 4. New Price Comparison Section & Returns */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-primary-600 rounded-full"></span>
                                    Available from other sellers
                                </h3>

                                {/* Graph View */}
                                <div className="space-y-3 mb-6">
                                    {/* Our Price Bar */}
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="font-bold text-gray-900 dark:text-white">Us</span>
                                            <span className="font-bold text-primary-600">₹{sneaker.price}</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "40%" }}
                                                className="h-full bg-primary-600 rounded-full"
                                            />
                                        </div>
                                    </div>

                                    {/* Competitor Bars */}
                                    {otherSellers.map((seller, idx) => {
                                        const percent = Math.min((seller.price / sneaker.price) * 40 + 10, 100);
                                        return (
                                            <div key={idx}>
                                                <div className="flex justify-between text-xs mb-1 opacity-70">
                                                    <span>{seller.name}</span>
                                                    <span>₹{Math.round(seller.price)}</span>
                                                </div>
                                                <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${percent}%` }}
                                                        className="h-full bg-gray-400 dark:bg-gray-600 rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* List View */}
                                <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    {otherSellers.map((seller, idx) => (
                                        <div key={idx} className="flex justify-between items-center group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500">
                                                    {seller.name.charAt(0)}
                                                </div>
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{seller.name}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">₹{Math.round(seller.price)}</span>
                                                <a href="#" className="text-xs text-primary-600 hover:underline flex items-center">
                                                    View <ArrowLeft className="rotate-180 ml-1 w-3 h-3" />
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Returns Policy (Kept) */}
                            <div className="flex items-center gap-4 p-4 border border-gray-100 dark:border-gray-800 rounded-xl">
                                <RefreshCw className="text-primary-600" size={24} />
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Easy 7-Day Returns</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Changed your mind? Return for a full refund after verification.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* 3. You May Also Like Section */}
                {
                    relatedProducts.length > 0 && (
                        <div className="mb-20">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">You May Also Like</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {relatedProducts.map((product) => (
                                    <div
                                        key={product._id}
                                        onClick={() => navigate(`/product/${product._id}`)}
                                        className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all"
                                    >
                                        <div className="aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
                                            <img
                                                src={product.images?.[0]}
                                                alt={product.name}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <p className="text-xs text-gray-500 font-medium mb-1">{product.brand}</p>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate mb-2">{product.name}</h3>
                                            <p className="text-gray-900 dark:text-white font-bold">₹{product.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }

                {/* 1. Product Reviews Section */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-16">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Customer Reviews</h2>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="text-yellow-400 w-6 h-6 fill-current" />
                                    ))}
                                </div>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">4.9</span>
                                <span className="text-gray-500 dark:text-gray-400">({mockReviews.length + 125} reviews)</span>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="border-gray-300 dark:border-gray-600"
                            onClick={() => setIsWritingReview(!isWritingReview)}
                        >
                            {isWritingReview ? "Cancel Review" : "Write a Review"}
                        </Button>
                    </div>

                    {/* Write Review Form */}
                    <AnimatePresence>
                        {isWritingReview && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden mb-8"
                            >
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        alert("Review submitted successfully! (Demo)");
                                        setIsWritingReview(false);
                                    }}
                                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4"
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating</label>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button key={star} type="button" className="text-yellow-400 hover:scale-110 transition-transform">
                                                    <Star size={24} className={star <= 5 ? "fill-current" : ""} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Review</label>
                                        <textarea
                                            rows="4"
                                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="Share your thoughts about this product..."
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit">Submit Review</Button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockReviews.map((review) => (
                            <div key={review.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold">
                                            {review.user.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white">{review.user}</h4>
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={12} className={i < review.rating ? "fill-current" : "text-gray-300 dark:text-gray-600"} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400">{review.date}</span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">"{review.comment}"</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 text-center">
                        <button className="text-primary-600 font-semibold hover:underline">Read All Reviews</button>
                    </div>
                </div>
            </div>

            {/* AR Modal */}
            <ARModal
                isOpen={showAR}
                onClose={() => setShowAR(false)}
                product={sneaker}
            />
        </div>
    );
};

export default ProductDetails;
