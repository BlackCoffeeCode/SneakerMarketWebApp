import React, { useRef } from 'react';
import { useGLTF, Center } from '@react-three/drei';

const SneakerModel = ({ modelUrl, scale = 1, rotation = [0, 0, 0] }) => {
    // Default to the placeholder if no URL is provided
    const { scene } = useGLTF(modelUrl || '/models/shoe.glb');
    const modelRef = useRef();

    return (
        <Center top>
            <primitive
                ref={modelRef}
                object={scene}
                scale={[scale, scale, scale]}
                rotation={rotation}
                castShadow
                receiveShadow
            />
        </Center>
    );
};

export default SneakerModel;
