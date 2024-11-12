import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface StarlinkGlobeProps {
  satellites: Array<{
    id: string;
    latitude: number;
    longitude: number;
    altitude: number;
  }>;
  selectedId?: string;
}

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshPhongMaterial
        map={new THREE.TextureLoader().load('/earth_texture.jpg')}
        bumpMap={new THREE.TextureLoader().load('/earth_bump.jpg')}
        bumpScale={0.05}
        specularMap={new THREE.TextureLoader().load('/earth_specular.jpg')}
        specular={new THREE.Color('grey')}
      />
    </mesh>
  );
}

function Satellites({ satellites, selectedId }: StarlinkGlobeProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      satellites.forEach((sat, index) => {
        const child = groupRef.current!.children[index];
        if (child) {
          // Update satellite positions
          const phi = (90 - sat.latitude) * (Math.PI / 180);
          const theta = (sat.longitude + 180) * (Math.PI / 180);
          const radius = 1 + (sat.altitude / 6371); // Earth radius is 6371km

          child.position.setFromSpherical(
            new THREE.Spherical(radius, phi, theta)
          );
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {satellites.map((sat) => (
        <mesh key={sat.id} position={[0, 0, 0]}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshBasicMaterial
            color={sat.id === selectedId ? '#00ff00' : '#ffffff'}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

export function StarlinkGlobe({ satellites, selectedId }: StarlinkGlobeProps) {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.1} />
        <pointLight position={[100, 100, 100]} intensity={2.5} />
        <Stars radius={300} depth={60} count={20000} factor={7} />
        <Earth />
        <Satellites satellites={satellites} selectedId={selectedId} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
}