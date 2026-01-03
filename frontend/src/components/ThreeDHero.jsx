import React, { Component, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";

/* -------------------- Error Boundary -------------------- */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400">
                    <p>3D Model Unavailable</p>
                </div>
            );
        }
        return this.props.children;
    }
}

/* -------------------- Model Loader -------------------- */
const Model = ({ url, scale = 1 }) => {
    const { scene } = useGLTF(url);
    scene.scale.set(scale, scale, scale);
    return <primitive object={scene} />;
};

/* -------------------- Placeholder -------------------- */
const PlaceholderModel = () => (
    <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#fb923c" />
    </mesh>
);

/* -------------------- Reusable 3D Hero Viewer -------------------- */
const ThreeDHero = ({
    modelUrl,
    className = "h-[450px]",
    autoRotate = true,
    enableZoom = false,
    cameraPosition = [0, 0, 4],
    modelScale = 1,
    showLabel = true,
}) => {
    return (
        <div
            className={`w-full ${className} bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden relative`}
        >
            <ErrorBoundary>
                <Canvas
                    shadows
                    dpr={[1, 2]}
                    camera={{ fov: 45, position: cameraPosition }}
                >
                    <Suspense fallback={null}>
                        <Stage
                            environment="city"
                            intensity={0.5}
                            contactShadow={{
                                resolution: 1024,
                                scale: 10,
                                blur: 2,
                                opacity: 0.4,
                            }}
                        >
                            {modelUrl ? (
                                <Model url={modelUrl} scale={modelScale} />
                            ) : (
                                <PlaceholderModel />
                            )}
                        </Stage>
                    </Suspense>

                    <OrbitControls
                        autoRotate={autoRotate}
                        enableZoom={enableZoom}
                        enablePan={false}
                    />
                </Canvas>
            </ErrorBoundary>

            {showLabel && (
                <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded text-xs font-medium text-gray-500 dark:text-gray-400 select-none pointer-events-none">
                    Interactive 3D
                </div>
            )}
        </div>
    );
};

export default ThreeDHero;
