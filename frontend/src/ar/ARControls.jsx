import React from 'react';
import { X, RotateCcw, ShoppingBag, Heart } from 'lucide-react';

const ARControls = ({
    onExit,
    onReset,
    onAddToCart,
    onToggleWishlist,
    isPlaced,
    currentSize,
    onSizeChange,
    sneakerPrice
}) => {
    const sizes = [7, 8, 9, 10, 11, 12, 13];

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between z-20 p-4 safe-area-inset-bottom">
            {/* Header: Exit & Price */}
            <div className="flex justify-between items-start pt-safe-area">
                <button
                    onClick={onExit}
                    className="pointer-events-auto p-3 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-white font-bold">
                    ₹{sneakerPrice}
                </div>
            </div>

            {/* Bottom Controls (Only visible if placed) */}
            {isPlaced && (
                <div className="pointer-events-auto space-y-4">
                    {/* Size Selector */}
                    <div className="bg-black/40 backdrop-blur-md rounded-2xl p-3 overflow-x-auto no-scrollbar">
                        <div className="flex gap-3 min-w-max px-2">
                            <span className="text-white text-xs font-bold uppercase self-center mr-2">Size (US)</span>
                            {sizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => onSizeChange(size)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${currentSize === size
                                            ? 'bg-white text-black scale-110 shadow-lg'
                                            : 'bg-white/10 text-white border border-white/20'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onReset}
                            className="bg-black/40 backdrop-blur-md text-white p-4 rounded-xl hover:bg-black/60 transition-colors"
                        >
                            <RotateCcw size={24} />
                        </button>

                        <button
                            onClick={onToggleWishlist}
                            className="bg-black/40 backdrop-blur-md text-white p-4 rounded-xl hover:bg-black/60 transition-colors"
                        >
                            <Heart size={24} />
                        </button>

                        <button
                            onClick={onAddToCart}
                            className="flex-1 bg-primary-600/90 backdrop-blur-md text-white p-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
                        >
                            Add to Cart <ShoppingBag size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ARControls;
