import { useState, useEffect, useCallback } from 'react';
import { useXR } from '@react-three/xr';

export const useWebXR = () => {
    const [isSupported, setIsSupported] = useState(false);
    const [isArSessionActive, setIsArSessionActive] = useState(false);

    useEffect(() => {
        if ('xr' in navigator) {
            navigator.xr.isSessionSupported('immersive-ar')
                .then((supported) => setIsSupported(supported))
                .catch(() => setIsSupported(false));
        } else {
            setIsSupported(false);
        }
    }, []);

    // We will control session via the ARModal/Canvas, primarily using this hook to expose support status
    // and potentially wrap session start logic if we weren't using @react-three/xr's built-in enterAR.
    // However, @react-three/xr v6 provides useXR() only INSIDE the Canvas.
    // For the UI *outside* the canvas (to show the "Start AR" button), we primarily need the 'isSupported' check.

    return {
        isSupported,
        isArSessionActive
    };
};
