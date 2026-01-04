import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { XR, createXRStore } from '@react-three/xr';
import { X, Smartphone } from 'lucide-react';
import ARScene from './ARScene';
import ARControls from './ARControls';
import FootGuideOverlay from './components/FootGuideOverlay';
import { addToCart } from '../services/cartService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const store = createXRStore();

const ARModal = ({ isOpen, onClose, product }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // AR State
    const [isPlaced, setIsPlaced] = useState(false);
    const [currentSize, setCurrentSize] = useState(9); // Default size 9

    // Scale Logic
    const sizeScaleMap = {
        7: 0.94,
        8: 0.97,
        9: 1.0,
        10: 1.03,
        11: 1.06,
        12: 1.09,
        13: 1.12
    };

    const currentScale = sizeScaleMap[currentSize] || 1.0;

    // Reset state when opening/closing
    useEffect(() => {
        if (!isOpen) {
            setIsPlaced(false);
            setCurrentSize(9);
        } else {
            // Attempt to start AR automatically or show Start Screen?
            // User requirement: "Show 'Start AR Session' button"
        }
    }, [isOpen]);

    const overlayRef = React.useRef();

    const handleStartAR = () => {
        if (overlayRef.current) {
            // Make overlay visible for the session
            overlayRef.current.style.display = 'block';

            store.enterAR(undefined, {
                domOverlay: { root: overlayRef.current },
                optionalFeatures: ['dom-overlay', 'hit-test']
            }).catch(err => {
                console.error("Failed to start AR", err);
                alert("Could not start AR session. Please ensure you are on Android Chrome.");
                overlayRef.current.style.display = 'none'; // Hide again if failed
            });
        }
    };

    const handlePlace = () => {
        setIsPlaced(true);
    };

    const handleReset = () => {
        setIsPlaced(false);
    };

    const handleAddToCart = async () => {
        if (!user) {
            // In AR, redirecting is jarrings. We should probably save state or just alert?
            // "Add to Cart from AR view"
            // If we navigate, we lose AR.
            // Better: Close AR and redirect.
            onClose();
            navigate('/login');
            return;
        }

        try {
            await addToCart({
                sneakerId: product._id,
                quantity: 1,
                size: currentSize
            });
            alert("Added to cart!");
        } catch (error) {
            alert("Failed to add to cart");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black">
            {/* Canvas Layer */}
            <div className="absolute inset-0 z-0">
                <Canvas>
                    <React.Suspense fallback={null}>
                        <XR store={store}>
                            <ARScene
                                isPlaced={isPlaced}
                                scale={currentScale}
                                modelUrl={product.model3D}
                            />
                        </XR>
                    </React.Suspense>
                </Canvas>
            </div>

            {/* DOM Overlay Layer - Controls */}
            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6">

                {/* Header / Close Button */}
                <div className="flex justify-end pointer-events-auto">
                    <button
                        onClick={onClose}
                        className="bg-white/10 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/20 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Bottom Controls */}
                <div className="pointer-events-auto flex flex-col items-center gap-4">
                    <div className="bg-black/40 backdrop-blur-md px-6 py-4 rounded-2xl flex flex-col items-center text-center max-w-sm">
                        <div className="flex items-center gap-2 text-white mb-2">
                            <Smartphone size={20} className="text-primary-400" />
                            <h3 className="font-bold text-lg">AR Viewer</h3>
                        </div>
                        <p className="text-gray-300 text-sm mb-4">
                            Drag to rotate. On mobile, tap below to view in your room.
                        </p>

                        <button
                            onClick={handleStartAR}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-8 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-105"
                        >
                            <span>Start AR Session</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Actual Overlay Container for AR Session */}
            {/* Hidden by default, shown by handleStartAR logic and/or browser */}
            <div ref={overlayRef} style={{ display: 'none' }} className="ar-overlay-container">
                {!isPlaced && <FootGuideOverlay onPlace={handlePlace} />}

                <ARControls
                    onExit={() => {
                        // End session
                        const session = store.session;
                        if (session) session.end();
                        onClose();
                    }}
                    onReset={handleReset}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={() => alert('Wishlist toggled')}
                    isPlaced={isPlaced}
                    currentSize={currentSize}
                    onSizeChange={setCurrentSize}
                    sneakerPrice={product.price}
                />
            </div>
        </div>
    );
};

export default ARModal;
