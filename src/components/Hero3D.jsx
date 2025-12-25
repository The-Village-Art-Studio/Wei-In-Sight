import React, { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment } from '@react-three/drei';
import { TextureLoader } from 'three';
import iridescentTexture from '../assets/iridescent.jpg';
import pinkStudio from '../assets/pink_studio.png';

const SciFiObject = ({ orientationRef }) => {
    const meshRef = useRef();
    const texture = useLoader(TextureLoader, iridescentTexture);
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const baseRotX = t * 0.2;
        const baseRotY = t * 0.3;

        if (meshRef.current) {
            meshRef.current.rotation.x = baseRotX + orientationRef.current.x * 0.5;
            meshRef.current.rotation.y = baseRotY + orientationRef.current.y * 0.5;
        }
    });

    // Much smaller sphere on mobile
    const sphereSize = isMobile ? 0.25 : 1;

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={meshRef} scale={isMobile ? 0.6 : 1}>
                <sphereGeometry args={[sphereSize, 64, 64]} />
                <MeshDistortMaterial
                    map={texture}
                    color="FFC0CB"
                    distort={0.4}
                    speed={2}
                    roughness={0}
                    metalness={1}
                    envMapIntensity={3}
                />
            </mesh>
        </Float>
    );
};

const Hero3D = () => {
    const [needsPermission, setNeedsPermission] = React.useState(false);
    const [debugInfo, setDebugInfo] = React.useState({ beta: 0, gamma: 0, active: false });
    const orientationRef = useRef({ x: 0, y: 0 });

    React.useEffect(() => {
        const handleOrientation = (event) => {
            const x = event.beta ? event.beta * (Math.PI / 180) : 0;
            const y = event.gamma ? event.gamma * (Math.PI / 180) : 0;
            orientationRef.current = { x, y };

            setDebugInfo({
                beta: event.beta ? event.beta.toFixed(1) : 0,
                gamma: event.gamma ? event.gamma.toFixed(1) : 0,
                active: true
            });
        };

        // Check if permission is needed (iOS 13+)
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            setNeedsPermission(true);
        } else {
            // Non-iOS or older devices: add listener immediately
            window.addEventListener('deviceorientation', handleOrientation);
        }

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    const requestPermission = async () => {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const permission = await DeviceOrientationEvent.requestPermission();
                if (permission === 'granted') {
                    setNeedsPermission(false);
                    // Add listener after permission granted
                    window.addEventListener('deviceorientation', (event) => {
                        const x = event.beta ? event.beta * (Math.PI / 180) : 0;
                        const y = event.gamma ? event.gamma * (Math.PI / 180) : 0;
                        orientationRef.current = { x, y };

                        setDebugInfo({
                            beta: event.beta ? event.beta.toFixed(1) : 0,
                            gamma: event.gamma ? event.gamma.toFixed(1) : 0,
                            active: true
                        });
                    });
                }
            } catch (error) {
                console.log('Permission denied');
            }
        }
    };

    return (
        <div style={{
            width: '100%',
            height: window.innerWidth <= 768 ? '30vh' : '60vh',
            position: 'relative'
        }}>
            {/* Debug Overlay */}
            <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '12px',
                zIndex: 100,
                fontFamily: 'monospace'
            }}>
                <div>Gyro: {debugInfo.active ? '✓' : '✗'}</div>
                <div>Beta: {debugInfo.beta}°</div>
                <div>Gamma: {debugInfo.gamma}°</div>
            </div>

            {needsPermission && (
                <button
                    onClick={requestPermission}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10,
                        padding: '1rem 2rem',
                        background: 'var(--primary-color)',
                        color: '#000',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-heading)'
                    }}
                >
                    Enable Tilt Control
                </button>
            )}
            <Canvas camera={{ position: [0, 0, window.innerWidth <= 768 ? 6 : 4] }}>
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#808080" />
                <Environment files={pinkStudio} />
                <SciFiObject orientationRef={orientationRef} />
            </Canvas>
        </div>
    );
};

export default Hero3D;
