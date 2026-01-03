import React from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import { Link } from 'react-router-dom';
import ThreeDHero from './ThreeDHero';

const Hero = () => {
    return (
        <section className="relative overflow-hidden bg-white dark:bg-gray-900 min-h-[600px] flex items-center">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-primary-100/50 dark:bg-primary-900/20 rounded-full blur-3xl opacity-60" />
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-secondary-100/50 dark:bg-secondary-900/20 rounded-full blur-3xl opacity-60" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* Left: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center md:text-left"
                    >
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="inline-block px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-bold uppercase tracking-wider mb-6"
                        >
                            New Collection 2026
                        </motion.span>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-tight mb-6">
                            Step into the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                                Future of Style
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
                            Discover the most exclusive sneaker drops. Premium comfort meets urban aesthetic in every pair.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Link to="/products">
                                <Button className="w-full sm:w-auto shadow-primary-500/25">
                                    Explore Collection
                                </Button>
                            </Link>
                            <Link to="/products?category=sale">
                                <button className="px-8 py-3 rounded-xl font-bold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                                    <span>Sale is live</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                </button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right: Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative hidden md:block h-[500px]"
                    >
                        {/* 3D Scene */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary-200 to-secondary-200 dark:from-gray-800 dark:to-gray-700 rounded-full animate-[pulse_4s_ease-in-out_infinite] opacity-20 blur-3xl scale-90" />

                        <ThreeDHero
                            modelUrl="/shoe.glb"
                            className="h-full bg-transparent"
                            modelScale={1}
                            cameraPosition={[0, 0, 3]}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
