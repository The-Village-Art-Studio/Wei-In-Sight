import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

const LiquidSphere = () => {
    const sphereRef = useRef();
    const materialRef = useRef();
    const mouse = useRef({ x: 0, y: 0 });
    const targetDistort = useRef(0.3);

    useEffect(() => {
        const handleMouseMove = (event) => {
            // Normalize mouse position
            const x = (event.clientX / window.innerWidth) * 2 - 1;
            const y = -(event.clientY / window.innerHeight) * 2 + 1;
            mouse.current = { x, y };

            // Increase distortion on movement
            targetDistort.current = 0.6;

            // Reset distortion after delay
            clearTimeout(window.hoverTimer);
            window.hoverTimer = setTimeout(() => {
                targetDistort.current = 0.3;
            }, 200);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame((state) => {
        if (sphereRef.current) {
            // Constant slow rotation
            sphereRef.current.rotation.x += 0.002;
            sphereRef.current.rotation.y += 0.002;

            // Gentle tilt towards mouse
            const targetRotX = mouse.current.y * 0.5;
            const targetRotY = mouse.current.x * 0.5;
            sphereRef.current.rotation.x += (targetRotX - sphereRef.current.rotation.x) * 0.05;
            sphereRef.current.rotation.y += (targetRotY - sphereRef.current.rotation.y) * 0.05;
        }

        if (materialRef.current) {
            // Smoothly interpolate distortion
            materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, targetDistort.current, 0.05);
        }
    });

    return (
        <Sphere ref={sphereRef} args={[1.8, 128, 128]} position={[0, 0, 0]}>
            <MeshDistortMaterial
                ref={materialRef}
                color="#ffffff"
                attach="material"
                distort={0.3}
                speed={2}
                roughness={0}
                metalness={0.1}
                transmission={1}
                ior={1.5}
                thickness={1.5}
                clearcoat={1}
                clearcoatRoughness={0}
            />
        </Sphere>
    );
};

const CanvasWrapper = () => {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: -1, background: '#000000' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.1} />

                {/* Colorful Lighting for Iridescence */}
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ffff" /> {/* Cyan */}
                <pointLight position={[-10, -10, 10]} intensity={1.5} color="#ff00ff" /> {/* Magenta */}
                <pointLight position={[0, 10, -10]} intensity={1} color="#ffff00" /> {/* Yellow */}
                <pointLight position={[0, -5, 5]} intensity={0.5} color="#ffffff" /> {/* Fill */}

                <Environment preset="warehouse" />
                <LiquidSphere />
            </Canvas>
        </div>
    );
};

export default CanvasWrapper;
