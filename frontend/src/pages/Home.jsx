import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Hero from "../components/Hero";
import SneakerCard from "../components/SneakerCard";

import { Search } from "lucide-react";

const Home = () => {
  const [sneakers, setSneakers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  // 🔴 If admin opens home, redirect to admin dashboard ONLY if activeRole is admin
  useEffect(() => {
    if (user?.activeRole === "admin") {
      navigate("/seller");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchSneakers = async () => {
      try {
        const { data } = await api.get("/sneakers");
        setSneakers(data);
      } catch (error) {
        console.error("Failed to load sneakers", error);
      }
    };

    fetchSneakers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?category=${searchQuery.trim()}`);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Hero />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* 🔍 Search Bar Section */}
        <div className="max-w-2xl mx-auto mb-16 relative z-20 -mt-24">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for sneakers, brands, or styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-8 py-5 rounded-full bg-white dark:bg-gray-800 border-none shadow-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 transition-all text-lg"
              />
              <button
                type="submit"
                className="absolute right-3 top-2 bottom-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full px-6 flex items-center justify-center transition-colors"
              >
                <Search size={22} />
              </button>
            </div>
          </form>
        </div>

        {/* 🔍 Quick Discover Section */}
        <section className="mb-20">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Find Your Style</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Curated collections for your lifestyle</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Walking', img: '/images/style/walking.png', desc: 'All-day comfort' },
              { label: 'Running', img: '/images/style/running.png', desc: 'Peak performance' },
              { label: 'College', img: '/images/style/college.png', desc: 'Campus essentials' },
              { label: 'Gym', img: '/images/style/gym.png', desc: 'Train hard' }
            ].map((style) => (
              <Link
                key={style.label}
                to={`/products?category=${style.label.toLowerCase()}`}
                className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800">
                  <img
                    src={style.img}
                    alt={style.label}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-opacity delay-100">{style.desc}</p>
                  <h3 className="text-2xl font-black text-white italic">{style.label}</h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 pt-10 justify-center">
            {[
              { label: '🔥 Trending', val: 'trending' },
              { label: '🏷️ New Year Sale', val: 'sale' },
              { label: '🚀 Just Launched', val: 'launch' }
            ].map((item) => (
              <Link
                key={item.val}
                to={`/products?category=${item.val}`}
                className="px-6 py-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-700 dark:text-white hover:border-primary-600 hover:text-primary-600 dark:hover:border-primary-500 dark:hover:text-primary-400 transition-all shadow-sm hover:shadow-md"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-primary-600 font-semibold tracking-wider uppercase text-sm">New Arrivals</span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">Latest Drops</h2>
          </div>
        </div>

        {sneakers.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sneakers.map((s) => (
            <SneakerCard
              key={s._id}
              sneaker={s}
              image={s.images?.[0] || 'https://via.placeholder.com/400x500?text=Sneaker'}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
