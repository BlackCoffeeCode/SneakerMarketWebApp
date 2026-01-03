import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Vector3 } from 'three';
import SneakerModel from './components/SneakerModel';

const ARScene = ({ isPlaced, scale, modelUrl }) => {
    const modelGroup = useRef();
    const { camera } = useThree();

    // Float logic: If not placed, update position to be in front of camera
    useFrame(() => {
        if (!isPlaced && modelGroup.current) {
            // Get camera direction
            const direction = new Vector3();
            camera.getWorldDirection(direction);

            // Set position 1.5 meters in front of camera
            const position = new Vector3();
            position.copy(camera.position).add(direction.multiplyScalar(1.5));

            // Keep y at ground level (roughly) relative to camera height? 
            // Simplified: Just match camera height - 1.5m? 
            // Or just place in front. 
            // In AR, (0,0,0) is usually start position. 
            // Better: 'Floating' ghost mode.
            // We'll just smooth lerp to expected position

            // INCREASED RESPONSIVENESS for "Smooth" feel
            modelGroup.current.position.lerp(position, 0.8);

            // Look at camera (only Y axis)
            modelGroup.current.lookAt(camera.position.x, modelGroup.current.position.y, camera.position.z);
        }
    });

    return (
        <>
            <ambientLight intensity={1.5} />
            <directionalLight position={[0, 10, 0]} intensity={2} castShadow />
            <Environment preset="city" />

            {/* Shadow Plane - Smaller to avoid Z-fighting */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
                <planeGeometry args={[2, 2]} />
                <shadowMaterial opacity={0.2} />
            </mesh>

            <group ref={modelGroup}>
                <SneakerModel modelUrl={modelUrl} scale={scale} />
            </group>
        </>
    );
};

export default ARScene;
