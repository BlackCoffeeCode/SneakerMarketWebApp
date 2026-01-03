import React from 'react';
import { Footprints } from 'lucide-react';

const FootGuideOverlay = ({ onPlace }) => {
    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10">
            {/* Ghost Foot SVG / Guide */}
            <div className="opacity-40 mb-20 animate-pulse">
                <svg width="200" height="350" viewBox="0 0 200 350" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 345C135 345 165 330 180 300C195 270 195 220 185 180C175 140 160 80 140 50C120 20 110 5 100 5C90 5 80 20 60 50C40 80 25 140 15 180C5 220 5 270 20 300C35 330 65 345 100 345Z"
                        stroke="white" strokeWidth="4" strokeDasharray="10 10" />
                </svg>
            </div>

            <div className="bg-black/50 text-white px-4 py-2 rounded-full mb-4 text-sm font-medium backdrop-blur-sm">
                Align your foot with the outline
            </div>

            <button
                onClick={onPlace}
                className="pointer-events-auto bg-primary-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl active:scale-95 transition-transform flex items-center gap-2"
            >
                <Footprints size={24} />
                Place Sneaker
            </button>
        </div>
    );
};

export default FootGuideOverlay;
