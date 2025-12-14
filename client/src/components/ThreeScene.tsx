import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Image, ScrollControls, Scroll, useScroll, Float, Environment, Text, Line, Trail, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import samuraiImg from '@assets/generated_images/samurai_warrior_portrait.png';
import bgTexture from '@assets/generated_images/dark_textured_background.png';
import Interface from '@/components/Interface';
import IntroOverlay from '@/components/IntroOverlay';
import CustomCursor from '@/components/CustomCursor';
import smokeTexture from '@assets/generated_images/volumetric_smoke_texture.png'; // Assuming this exists now

// --- 3D Components ---

function Katana({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
      if(group.current) {
          // Vibrating power effect
          const t = state.clock.getElapsedTime();
          group.current.position.y = position[1] + Math.sin(t) * 0.05 + (Math.random() * 0.002); // Subtle vibration
          group.current.rotation.z = rotation[2] + Math.sin(t * 5) * 0.005; // Tense shaking
      }
  })

  return (
    <group ref={group} position={position} rotation={rotation}>
      {/* Blade - Enhanced Material */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.08, 3, 0.015]} />
        <meshStandardMaterial 
            color="#e0e0e0" 
            metalness={1} 
            roughness={0.1} 
            envMapIntensity={2}
        />
      </mesh>
      {/* Edge glow - Red Pulse */}
      <mesh position={[0.045, 1.5, 0]}>
          <boxGeometry args={[0.005, 3, 0.016]} />
          <meshBasicMaterial color="#ff0000" toneMapped={false} />
      </mesh>
      
      {/* Guard (Tsuba) */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.6} />
      </mesh>
      
      {/* Handle (Tsuka) */}
      <mesh position={[0, -0.75, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 1.5, 8]} />
        <meshStandardMaterial color="#050505" metalness={0.5} roughness={0.9} />
      </mesh>
      
      {/* Trail Effect for motion */}
      {/* Note: Trail requires a mesh to follow. Using a simple invisible mesh tip */}
      {/* <Trail width={5} length={8} color={'#8b0000'} attenuation={(t) => t * t}>
         <mesh position={[0, 3, 0]}>
             <sphereGeometry args={[0.01]} />
             <meshBasicMaterial visible={false} />
         </mesh>
      </Trail> */}
    </group>
  );
}

function ToriiGate({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Pillars with wood texture feel */}
      <mesh position={[-2, 2.5, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 5, 16]} />
        <meshStandardMaterial color="#5a0a0a" roughness={0.7} metalness={0.2} />
      </mesh>
      <mesh position={[2, 2.5, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 5, 16]} />
        <meshStandardMaterial color="#5a0a0a" roughness={0.7} metalness={0.2} />
      </mesh>
      
      {/* Top Bar (Kasagi) - Curved */}
      <group position={[0, 4.8, 0]}>
        <mesh>
            <boxGeometry args={[6, 0.4, 0.6]} />
            <meshStandardMaterial color="#5a0a0a" roughness={0.7} />
        </mesh>
        <mesh position={[-3.1, 0.15, 0]} rotation={[0, 0, 0.25]}>
            <boxGeometry args={[1.2, 0.4, 0.6]} />
            <meshStandardMaterial color="#5a0a0a" />
        </mesh>
        <mesh position={[3.1, 0.15, 0]} rotation={[0, 0, -0.25]}>
            <boxGeometry args={[1.2, 0.4, 0.6]} />
            <meshStandardMaterial color="#5a0a0a" />
        </mesh>
      </group>

      {/* Lower Bar (Nuki) */}
      <mesh position={[0, 3.8, 0]}>
        <boxGeometry args={[5.5, 0.3, 0.4]} />
        <meshStandardMaterial color="#5a0a0a" roughness={0.7} />
      </mesh>
      
      {/* Gold Plaque */}
      <mesh position={[0, 4.3, 0.22]}>
         <planeGeometry args={[0.3, 0.6]} />
         <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Lantern({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
     if(group.current) {
         // Chaotic wind swaying
         const t = state.clock.getElapsedTime();
         group.current.rotation.z = Math.sin(t * 1.5 + position[0]) * 0.1 + Math.sin(t * 3) * 0.05;
         group.current.rotation.x = Math.cos(t * 1.2 + position[2]) * 0.05;
         group.current.position.y = position[1] + Math.sin(t + position[1]) * 0.1;
     }
  });

  return (
    <group ref={group} position={position}>
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 0.8, 16]} />
        <meshStandardMaterial color="#ff2a2a" emissive="#ff0000" emissiveIntensity={2} toneMapped={false} transparent opacity={0.9} />
      </mesh>
      <pointLight intensity={2} distance={5} color="#ff3300" decay={2} />
      
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 16]} />
        <meshStandardMaterial color="#050505" />
      </mesh>
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 16]} />
        <meshStandardMaterial color="#050505" />
      </mesh>
    </group>
  );
}

function VolumetricFog() {
    // A simple fog plane near the bottom
    return (
        <mesh position={[0, -4, -5]} rotation={[-Math.PI/2, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <meshBasicMaterial color="#050505" transparent opacity={0.8} />
        </mesh>
    )
}

function FireSparks() {
    return (
        <Sparkles 
            count={50}
            scale={4}
            size={4}
            speed={0.4}
            opacity={0.8}
            color="#ffaa00"
            position={[2, -1, 0]} // Near the sword
        />
    )
}

function SceneContent() {
  const scroll = useScroll();
  const samuraiGroup = useRef<THREE.Group>(null);
  const toriiGroup = useRef<THREE.Group>(null);
  const lanternGroup = useRef<THREE.Group>(null);
  const { viewport, mouse } = useThree();
  
  useFrame((state) => {
    // Parallax & Mouse Interaction
    const mouseX = (state.mouse.x * viewport.width) / 2;
    const mouseY = (state.mouse.y * viewport.height) / 2;

    const r1 = scroll.range(0, 0.33); 
    
    // --- Section 1: Samurai Hero ---
    if (samuraiGroup.current) {
        // Dramatic fade out - Move UP and Back
        samuraiGroup.current.position.y = r1 * 8; 
        samuraiGroup.current.position.z = -2 - (r1 * 10);
        
        // Mouse Look (Lerp for smooth follow)
        samuraiGroup.current.rotation.y = THREE.MathUtils.lerp(samuraiGroup.current.rotation.y, state.mouse.x * 0.1, 0.05);
        samuraiGroup.current.rotation.x = THREE.MathUtils.lerp(samuraiGroup.current.rotation.x, -state.mouse.y * 0.05, 0.05);
    }

    // --- Section 2: Torii Gate ---
    if (toriiGroup.current) {
        // Gates rush towards camera
        const zPos = 15 - (scroll.offset * 35); 
        toriiGroup.current.position.z = zPos;
    }

    // --- Section 3: Lanterns ---
    if (lanternGroup.current) {
       // Lanterns descend and sway
       lanternGroup.current.position.y = 12 - (scroll.offset * 20);
    }
  });

  return (
    <>
      {/* Static Background Plane with slight texture movement if possible */}
      <mesh position={[0, 0, -10]} scale={[40, 25, 1]}>
            <planeGeometry />
            <meshBasicMaterial color="#000000" />
            <Image url={bgTexture} transparent opacity={0.4} scale={[40, 25]} position={[0,0,0.1]} />
      </mesh>

      {/* Global Particles (Sakura) */}
      <Sparkles 
        count={300}
        scale={[20, 20, 10]}
        size={2}
        speed={0.5}
        opacity={0.6}
        color="#ffb7b2"
      />

      <VolumetricFog />

      {/* Hero Group */}
      <group ref={samuraiGroup}>
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
            {/* Samurai - Using Image as Billboard for visual fidelity over low-poly model */}
            <Image 
                url={samuraiImg} 
                scale={[6, 8]} 
                position={[0, 0, -2]} 
                transparent
                opacity={1}
                grayscale={0.3} // Moodier
                toneMapped={false}
            />
            {/* 3D Sword Prop */}
            <Katana position={[2.2, -1, 0]} rotation={[0, 0, -Math.PI/4]} />
            <FireSparks />
          </Float>
          
          {/* Rim Light simulated behind samurai */}
          <pointLight position={[0, 0, -3]} intensity={5} color="#8b0000" distance={10} />
      </group>

      {/* Torii Gate Sequence */}
      <group ref={toriiGroup}>
          <ToriiGate position={[0, -2, -5]} scale={1.8} />
          <ToriiGate position={[0, -2, -18]} scale={1.8} />
          <ToriiGate position={[0, -2, -31]} scale={1.8} />
      </group>

      {/* Lanterns for Menu Section */}
      <group ref={lanternGroup} position={[0, 10, -3]}>
           <Lantern position={[-4, 0, 0]} />
           <Lantern position={[4, 1.5, -2]} />
           <Lantern position={[-2.5, -3, -1]} />
           <Lantern position={[3, -2, 1]} />
      </group>

      <SceneLights />
    </>
  );
}


function SceneLights() {
    return (
        <>
            <ambientLight intensity={0.1} />
            {/* Gold Key Light */}
            <spotLight position={[8, 10, 8]} angle={0.3} penumbra={1} intensity={3} color="#d4af37" castShadow />
            {/* Red Fill Light */}
            <pointLight position={[-8, 0, 0]} intensity={1.5} color="#8b0000" />
            {/* Blue Moon Rim */}
            <directionalLight position={[0, 5, -5]} intensity={0.5} color="#1a2b3c" />
            
            <fog attach="fog" args={['#000000', 5, 25]} />
        </>
    )
}

export default function ThreeScene() {
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <div className="absolute inset-0 h-screen w-full bg-black">
      <IntroOverlay onComplete={() => setIntroFinished(true)} />
      
      {/* Cinematic Enhancement Layers */}
      <div className="film-grain" />
      <div className="vignette" />
      <div className="fog-layer" />
      <div className="ink-overlay" />

      {/* Custom Cursor */}
      <CustomCursor />

      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.2 }}>
        <color attach="background" args={['#000000']} />
        
        <ScrollControls pages={4} damping={0.15}> {/* Tighter damping for "heavy" cinematic feel */}
            <SceneContent />
            <Scroll html style={{ width: '100%', height: '100%' }}>
                {introFinished && <Interface />}
            </Scroll>
        </ScrollControls>
        
        <Environment preset="city" environmentIntensity={0.5} />
      </Canvas>
    </div>
  );
}
