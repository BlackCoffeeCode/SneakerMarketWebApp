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

            {/* DOM Overlay Layer - Start Screen */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 text-white">
                    <div className="text-center p-6 max-w-sm">
                        <Smartphone size={48} className="mx-auto mb-4 text-primary-500" />
                        <h2 className="text-2xl font-bold mb-2">Try On in AR</h2>
                        <p className="text-gray-400 mb-8">
                            See how these sneakers look on your feet. Requires an AR-capable Android device.
                        </p>
                        <button
                            onClick={handleStartAR}
                            className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold text-lg mb-4 hover:bg-primary-700 transition"
                        >
                            Start AR Session
                        </button>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white"
                        >
                            Cancel
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
