import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { useXR } from '@react-three/xr';
import { Vector3 } from 'three';
import SneakerModel from './components/SneakerModel';

const ARScene = ({ isPlaced, scale, modelUrl }) => {
    const modelGroup = useRef();
    const { camera } = useThree();
    const { isPresenting } = useXR();

    // Float logic: If not placed AND in AR mode, update position to be in front of camera
    useFrame(() => {
        if (isPresenting && !isPlaced && modelGroup.current) {
            // Get camera direction
            const direction = new Vector3();
            camera.getWorldDirection(direction);

            // Set position 1.5 meters in front of camera
            const position = new Vector3();
            position.copy(camera.position).add(direction.multiplyScalar(1.5));

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

            {/* Enable OrbitControls when NOT in AR mode (Desktop/Preview) */}
            {!isPresenting && <OrbitControls autoRotate autoRotateSpeed={4} />}
        </>
    );
};

export default ARScene;
