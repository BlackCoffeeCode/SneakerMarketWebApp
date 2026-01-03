import React, { useState, useEffect } from 'react';
import { X, Filter, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';

const FilterDrawer = ({
    isOpen,
    onClose,
    activeFilters,
    setFilters,
    availableBrands = [],
    onApply,
    onClear
}) => {
    // Local state for temporary changes before applying
    const [localFilters, setLocalFilters] = useState(activeFilters);

    // Sync local state when drawer opens or activeFilters change externally
    useEffect(() => {
        setLocalFilters(activeFilters);
    }, [isOpen, activeFilters]);

    const handleSortChange = (value) => {
        setLocalFilters(prev => ({ ...prev, sort: value }));
    };

    const handlePriceChange = (e, type) => {
        const value = parseInt(e.target.value) || 0;
        setLocalFilters(prev => ({
            ...prev,
            priceRange: {
                ...prev.priceRange,
                [type]: value
            }
        }));
    };

    const toggleBrand = (brand) => {
        setLocalFilters(prev => {
            const currentBrands = prev.brands || [];
            if (currentBrands.includes(brand)) {
                return { ...prev, brands: currentBrands.filter(b => b !== brand) };
            } else {
                return { ...prev, brands: [...currentBrands, brand] };
            }
        });
    };

    const handleApply = () => {
        setFilters(localFilters);
        onApply(localFilters); // Pass specific filters to verify usage if needed
        onClose();
    };

    const handleLocalClear = () => {
        const defaultFilters = {
            priceRange: { min: 0, max: 50000 },
            brands: [],
            sort: 'newest'
        };
        setLocalFilters(defaultFilters);
        // We don't close, just reset UI. User must click Apply.
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] bg-white dark:bg-gray-900 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Filter size={20} className="text-primary-600" />
                                Filters
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">

                            {/* Sort Section */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                                    Sort By
                                </h3>
                                <div className="space-y-2">
                                    {[
                                        { label: 'Newest Arrivals', value: 'newest' },
                                        { label: 'Price: Low to High', value: 'price_asc' },
                                        { label: 'Price: High to Low', value: 'price_desc' }
                                    ].map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleSortChange(option.value)}
                                            className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all ${localFilters.sort === option.value
                                                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 border border-primary-100 dark:border-primary-900'
                                                    : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            {option.label}
                                            {localFilters.sort === option.value && <Check size={16} />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <hr className="border-gray-100 dark:border-gray-800" />

                            {/* Price Range Section */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                                    Price Range
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <label className="text-xs text-gray-500 mb-1 block">Min Price</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                            <input
                                                type="number"
                                                value={localFilters.priceRange.min}
                                                onChange={(e) => handlePriceChange(e, 'min')}
                                                className="w-full pl-7 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="text-gray-400">-</div>
                                    <div className="flex-1">
                                        <label className="text-xs text-gray-500 mb-1 block">Max Price</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                            <input
                                                type="number"
                                                value={localFilters.priceRange.max}
                                                onChange={(e) => handlePriceChange(e, 'max')}
                                                className="w-full pl-7 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100 dark:border-gray-800" />

                            {/* Brands Section */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                                    Brands
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {availableBrands.map(brand => (
                                        <button
                                            key={brand}
                                            onClick={() => toggleBrand(brand)}
                                            className={`flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold transition-all border ${localFilters.brands.includes(brand)
                                                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white shadow-lg transform scale-105'
                                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                                }`}
                                        >
                                            {brand}
                                        </button>
                                    ))}
                                    {availableBrands.length === 0 && (
                                        <p className="text-sm text-gray-400 col-span-2">No brands available</p>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                            <div className="flex gap-4">
                                <button
                                    onClick={handleLocalClear}
                                    className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Clear All
                                </button>
                                <Button
                                    className="flex-1 py-3 text-base"
                                    onClick={handleApply}
                                >
                                    Apply Filters
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default FilterDrawer;
