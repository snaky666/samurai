import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Image, Sparkles, Float, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';
import samuraiImg from '@assets/generated_images/samurai_warrior_portrait.png';
import bgTexture from '@assets/generated_images/dark_textured_background.png';

function ParticleSystem() {
  const count = 200;
  const mesh = useRef<THREE.InstancedMesh>(null);
  
  // Create sakura petal shape
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() * 0.05;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      
      // Falling motion
      particle.my -= speed * 0.1;
      if (particle.my < -10) particle.my = 10; // Reset height
      
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos(t/10) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin(t/10) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos(t/10) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[0.08, 0]} />
      <meshStandardMaterial color="#ffb7b2" emissive="#ffb7b2" emissiveIntensity={0.5} transparent opacity={0.8} />
    </instancedMesh>
  );
}

function SamuraiHero() {
  const group = useRef<THREE.Group>(null);
  const imageRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!group.current) return;
    
    // Subtle breathing/floating
    const t = state.clock.getElapsedTime();
    group.current.position.y = Math.sin(t * 0.5) * 0.1;
    
    // Mouse follow effect
    const mouseX = state.mouse.x * 0.2;
    const mouseY = state.mouse.y * 0.2;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mouseX, 0.1);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -mouseY, 0.1);
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* Main Samurai Image - "Billboard" style */}
        <Image 
          ref={imageRef}
          url={samuraiImg} 
          scale={[5, 7]} 
          position={[0, 0, 0]} 
          transparent
          opacity={1}
          grayscale={0.2} // Desaturate slightly for mood
          toneMapped={false}
        />
      </Float>
      
      {/* Back glow */}
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[8, 8]} />
        <meshBasicMaterial color="#8b0000" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function BackgroundPlane() {
    return (
        <mesh position={[0, 0, -5]} scale={[20, 12, 1]}>
            <planeGeometry />
            <meshBasicMaterial color="#050505" />
            <Image url={bgTexture} transparent opacity={0.4} scale={[20, 12]} position={[0,0,0.1]} />
        </mesh>
    )
}

function SceneLights() {
    return (
        <>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#d4af37" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#8b0000" />
            <rectAreaLight width={5} height={5} color="#8b0000" intensity={5} position={[0, 0, 2]} lookAt={[0,0,0]} />
        </>
    )
}


export default function ThreeScene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <SceneLights />
        <ParticleSystem />
        <BackgroundPlane />
        <SamuraiHero />
        
        {/* Fog for atmosphere */}
        <fog attach="fog" args={['#050505', 5, 15]} />
        
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
