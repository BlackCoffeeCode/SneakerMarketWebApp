import { addToCart } from "../services/cartService";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const SneakerCard = ({ sneaker, image }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user) {
      toast.info("Please login to add items to cart");
      navigate('/login');
      return;
    }

    try {
      await addToCart({
        sneakerId: sneaker._id,
        quantity: 1,
        size: 9,
      });

      toast.success("Added to cart");
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-primary-100 dark:hover:border-primary-900 transition-all duration-300 relative"
    >
      <Link to={`/product/${sneaker._id}`} className="block relative overflow-hidden aspect-[4/5]">
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 animate-pulse" />
        <img
          src={image}
          alt={sneaker.name}
          loading="lazy"
          className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-110 relative z-10"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

        {/* Quick Action Button - Visible on Hover */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-30">
          <button className="w-full bg-white/95 text-gray-900 font-medium py-3 rounded-xl shadow-lg hover:shadow-xl hover:bg-white transition-all active:scale-95 text-sm uppercase tracking-wide">
            View Details
          </button>
        </div>
      </Link>

      <div className="p-5">
        <p className="text-xs font-medium text-primary-600 uppercase tracking-widest mb-1">
          {sneaker.brand || 'Sneaker'}
        </p>
        <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight mb-4 truncate">
          {sneaker.name}
        </h3>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-extrabold text-gray-900 dark:text-white">
            ₹{sneaker.price}
          </span>
          <span className="flex items-center text-sm text-gray-500">
            <span className="text-yellow-400 mr-1">★</span> {sneaker.rating || '4.5'}
          </span>
        </div>

        {/* Add to Cart Button (Restored Logic) */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-bold hover:bg-primary-700 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default SneakerCard;
