import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import SneakerCard from "../components/SneakerCard";
import FilterDrawer from "../components/FilterDrawer";
import { Filter } from "lucide-react";

const Products = () => {
    const [allSneakers, setAllSneakers] = useState([]); // Store ALL items
    const [virtualSneakers, setVirtualSneakers] = useState([]); // Store FILTERED items
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    // Filter State
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({
        priceRange: { min: 0, max: 50000 },
        brands: [],
        sort: 'newest'
    });

    // Get category from URL (e.g., ?category=nike)
    const categoryFilter = searchParams.get("category");

    useEffect(() => {
        const fetchSneakers = async () => {
            setLoading(true);
            try {
                const { data } = await api.get("/sneakers");
                setAllSneakers(data);
                // Initial set will trigger the filtering effect below
            } catch (error) {
                console.error("Failed to load sneakers", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSneakers();
    }, []);

    // MAIN FILTERING LOGIC
    useEffect(() => {
        let result = [...allSneakers];

        // 1. URL Category Filter
        if (categoryFilter) {
            const filterTerm = categoryFilter.toLowerCase().replace(" ", "");
            result = result.filter(sneaker => {
                // Normalize logic same as before
                let termsToCheck = [filterTerm];
                if (filterTerm === 'newdrops') termsToCheck = ['new', 'launch'];
                if (filterTerm === 'limitededition') termsToCheck = ['limited'];

                const catData = sneaker.category || [];
                const categories = Array.isArray(catData) ? catData : [catData];
                const normalizedCategories = categories.map(c => c.toLowerCase());

                // Matches Category OR Brand OR Name
                return (
                    termsToCheck.some(term => normalizedCategories.includes(term)) ||
                    sneaker.brand?.toLowerCase().replace(/\s+/g, "") === filterTerm ||
                    `${sneaker.name} ${sneaker.description}`.toLowerCase().includes(filterTerm)
                );
            });
        }

        // 2. Price Range
        result = result.filter(s =>
            s.price >= activeFilters.priceRange.min &&
            s.price <= activeFilters.priceRange.max
        );

        // 3. Brands
        if (activeFilters.brands.length > 0) {
            result = result.filter(s => activeFilters.brands.includes(s.brand));
        }

        // 4. Sorting
        switch (activeFilters.sort) {
            case 'price_asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
            default:
                // Assuming _id or created_at works, for now randomized or default API order might be active.
                // If backend returns newest first, default is fine.
                // We'll reverse for "newest" if API is oldest first, but commonly default is good.
                // Let's implement active logic if timestamps exist, else assume default order.
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
        }

        setVirtualSneakers(result);
    }, [allSneakers, categoryFilter, activeFilters]);

    // Compute available brands dynamically from ALL sneakers (before filtering)
    const availableBrands = useMemo(() => {
        const brands = new Set(allSneakers.map(s => s.brand).filter(Boolean));
        return Array.from(brands).sort();
    }, [allSneakers]);

    const getTitle = () => {
        if (!categoryFilter) return "All Sneakers";
        return categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1) + " Collection";
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-8 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Browse</p>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{getTitle()}</h1>
                    </div>

                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <Filter size={18} />
                        Filters
                        {/* Dot indicator if active filters */}
                        {(activeFilters.brands.length > 0 || activeFilters.sort !== 'newest') && (
                            <span className="w-2 h-2 bg-primary-600 rounded-full" />
                        )}
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && virtualSneakers.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500 dark:text-gray-400">No sneakers match your filters.</p>
                        <p className="text-sm text-gray-400 mt-2">Try adjusting the price range or clearing filters.</p>
                        <button
                            onClick={() => setActiveFilters({
                                priceRange: { min: 0, max: 50000 },
                                brands: [],
                                sort: 'newest'
                            })}
                            className="mt-6 text-primary-600 hover:underline font-bold"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {virtualSneakers.map((s) => (
                        <SneakerCard
                            key={s._id}
                            sneaker={s}
                            image={s.images?.[0] || 'https://via.placeholder.com/400x500?text=Sneaker'}
                        />
                    ))}
                </div>
            </div>

            {/* Filter Drawer */}
            <FilterDrawer
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                activeFilters={activeFilters}
                setFilters={setActiveFilters}
                availableBrands={availableBrands}
                onApply={() => { }} // Optional hook
            />
        </div>
    );
};

export default Products;
