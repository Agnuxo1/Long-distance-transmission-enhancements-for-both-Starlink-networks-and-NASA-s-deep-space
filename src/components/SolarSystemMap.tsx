import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface SpaceProbe {
  id: string;
  name: string;
  distance: number; // In AU
  angle: number; // Orbital angle in radians
}

interface SolarSystemMapProps {
  probes: SpaceProbe[];
  selectedId?: string;
}

function Sun() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshBasicMaterial color="#ffff00" />
    </mesh>
  );
}

function OrbitPath({ radius }: { radius: number }) {
  const points = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    points.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    ));
  }

  return (
    <line>
      <bufferGeometry
        attach="geometry"
        attributes={{
          position: new THREE.Float32BufferAttribute(
            points.flatMap(p => [p.x, p.y, p.z]),
            3
          )
        }}
      />
      <lineBasicMaterial attach="material" color="#666666" opacity={0.3} transparent />
    </line>
  );
}

function Probes({ probes, selectedId }: SolarSystemMapProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      probes.forEach((probe, index) => {
        const child = groupRef.current!.children[index];
        if (child) {
          const angle = probe.angle + clock.getElapsedTime() * 0.1;
          child.position.x = Math.cos(angle) * probe.distance;
          child.position.z = Math.sin(angle) * probe.distance;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {probes.map((probe) => (
        <mesh key={probe.id} position={[probe.distance, 0, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial
            color={probe.id === selectedId ? '#00ff00' : '#ffffff'}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

export function SolarSystemMap({ probes, selectedId }: SolarSystemMapProps) {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 15, 15], fov: 45 }}>
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 0, 0]} intensity={2.5} />
        <Stars radius={300} depth={60} count={20000} factor={7} />
        <Sun />
        {/* Draw orbit paths */}
        {probes.map((probe) => (
          <OrbitPath key={`orbit-${probe.id}`} radius={probe.distance} />
        ))}
        <Probes probes={probes} selectedId={selectedId} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minDistance={5}
          maxDistance={50}
        />
      </Canvas>
    </div>
  );
}