import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Image, ScrollControls, Scroll, useScroll, Float, Environment, Text, Line, Trail, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import bgTexture from '@assets/generated_images/dark_textured_background.png';
import Interface from '@/components/Interface';

// --- 3D Components ---

function Katana({ position, rotation }: { position?: [number, number, number], rotation?: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  
  // Removed internal floating animation so it can be controlled by parent (Samurai hand)
  
  return (
    <group ref={group} position={position} rotation={rotation}>
      {/* Blade - Curvature approximation */}
      <group position={[0, 1.5, 0]}>
         <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.08, 3, 0.02]} />
            <meshStandardMaterial color="#e0e0e0" metalness={0.9} roughness={0.1} />
         </mesh>
         {/* Tip */}
         <mesh position={[0, 1.6, 0]} rotation={[0, 0, Math.PI/4]}>
            <boxGeometry args={[0.06, 0.2, 0.02]} />
            <meshStandardMaterial color="#e0e0e0" metalness={0.9} roughness={0.1} />
         </mesh>
      </group>

      {/* Edge glow */}
      <mesh position={[0.04, 1.5, 0]}>
          <boxGeometry args={[0.005, 3, 0.025]} />
          <meshBasicMaterial color="#a0a0a0" />
      </mesh>
      
      {/* Guard (Tsuba) */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
         <torusGeometry args={[0.15, 0.02, 16, 32]} />
         <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} emissive="#d4af37" emissiveIntensity={0.2} />
      </mesh>

      {/* Handle (Tsuka) */}
      <mesh position={[0, -0.75, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 1.5, 8]} />
        <meshStandardMaterial color="#111" metalness={0.2} roughness={0.9} />
      </mesh>
      {/* Handle Wrapping Pattern */}
      <mesh position={[0, -0.75, 0]}>
         <cylinderGeometry args={[0.065, 0.075, 1.4, 8]} />
         <meshStandardMaterial color="#333" wireframe />
      </mesh>
    </group>
  );
}

function ArmorPlate({ position, args, color = "#111" }: { position: [number, number, number], args: [number, number, number], color?: string }) {
    return (
        <mesh position={position}>
            <boxGeometry args={args} />
            <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
            {/* Gold Trim */}
            <mesh position={[0, -args[1]/2 + 0.02, args[2]/2 + 0.001]}>
                <boxGeometry args={[args[0], 0.04, 0.01]} />
                <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} />
            </mesh>
        </mesh>
    )
}

function GeometricSamurai() {
    const group = useRef<THREE.Group>(null);
    const headRef = useRef<THREE.Group>(null);
    const rightArmRef = useRef<THREE.Group>(null);
    
    useFrame((state) => {
        if(!group.current || !headRef.current || !rightArmRef.current) return;
        
        const t = state.clock.getElapsedTime();
        
        // Idle breathing
        const breathe = Math.sin(t * 1) * 0.05;
        group.current.position.y = breathe;
        
        // Head follow mouse
        const mouseX = state.mouse.x * 0.5;
        const mouseY = state.mouse.y * 0.2;
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, mouseX, 0.1);
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -mouseY, 0.1);

        // Arm Sway with Sword
        rightArmRef.current.rotation.z = -0.5 + Math.sin(t * 1.5) * 0.05;
        rightArmRef.current.rotation.x = 0.5 + Math.cos(t * 1.5) * 0.05;
    })

    return (
        <group ref={group}>
            {/* --- HEAD (Kabuto) --- */}
            <group ref={headRef} position={[0, 1.7, 0]}>
                {/* Helmet Dome */}
                <mesh position={[0, 0.1, 0]}>
                    <sphereGeometry args={[0.35, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.3} />
                </mesh>
                {/* Facemask (Mempo) */}
                <mesh position={[0, -0.15, 0.2]} rotation={[0.2, 0, 0]}>
                    <cylinderGeometry args={[0.25, 0.15, 0.4, 6]} />
                    <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.5} />
                </mesh>
                {/* Gold Crest (Maedate) */}
                <mesh position={[0, 0.3, 0.3]} rotation={[0, 0, 0]}>
                    <cylinderGeometry args={[0.02, 0.1, 0.4, 4]} />
                    <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} />
                </mesh>
                <mesh position={[0, 0.45, 0.3]} rotation={[0, 0, Math.PI/4]}>
                     <boxGeometry args={[0.4, 0.05, 0.02]} />
                     <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} />
                </mesh>
                <mesh position={[0, 0.45, 0.3]} rotation={[0, 0, -Math.PI/4]}>
                     <boxGeometry args={[0.4, 0.05, 0.02]} />
                     <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} />
                </mesh>
                {/* Neck Guard (Shikoro) */}
                <group position={[0, -0.1, -0.1]}>
                     <ArmorPlate position={[0, 0, 0]} args={[0.6, 0.1, 0.4]} />
                     <ArmorPlate position={[0, -0.12, 0.02]} args={[0.65, 0.1, 0.45]} />
                     <ArmorPlate position={[0, -0.24, 0.04]} args={[0.7, 0.1, 0.5]} />
                </group>
            </group>

            {/* --- TORSO (Do) --- */}
            <group position={[0, 0.8, 0]}>
                {/* Chest Plate */}
                <mesh position={[0, 0.2, 0]}>
                    <cylinderGeometry args={[0.45, 0.4, 0.8, 8]} />
                    <meshStandardMaterial color="#111" metalness={0.5} roughness={0.5} />
                </mesh>
                {/* Gold chest emblem */}
                <mesh position={[0, 0.3, 0.41]}>
                    <circleGeometry args={[0.08, 32]} />
                    <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} />
                </mesh>
                
                {/* Shoulder Guards (Sode) */}
                <group position={[-0.6, 0.4, 0]} rotation={[0, 0, 0.5]}>
                     <ArmorPlate position={[0, 0, 0]} args={[0.4, 0.6, 0.1]} />
                </group>
                <group position={[0.6, 0.4, 0]} rotation={[0, 0, -0.5]}>
                     <ArmorPlate position={[0, 0, 0]} args={[0.4, 0.6, 0.1]} />
                </group>

                {/* Waist Armor (Kusazuri) */}
                <group position={[0, -0.4, 0]}>
                    <ArmorPlate position={[0, 0, 0.3]} args={[0.3, 0.5, 0.1]} />
                    <ArmorPlate position={[0.35, 0, 0.2]} args={[0.3, 0.5, 0.1]} />
                    <ArmorPlate position={[-0.35, 0, 0.2]} args={[0.3, 0.5, 0.1]} />
                    <ArmorPlate position={[0, 0, -0.3]} args={[0.3, 0.5, 0.1]} />
                </group>
            </group>

            {/* --- ARMS --- */}
            {/* Left Arm (Static/Resting) */}
            <group position={[-0.6, 1.2, 0]} rotation={[0, 0, 0.2]}>
                 <mesh position={[0, -0.4, 0]}>
                     <cylinderGeometry args={[0.12, 0.1, 0.8, 8]} />
                     <meshStandardMaterial color="#1a1a1a" />
                 </mesh>
            </group>

            {/* Right Arm (Holding Sword) */}
            <group ref={rightArmRef} position={[0.6, 1.2, 0]}>
                 {/* Upper Arm */}
                 <mesh position={[0, -0.3, 0]}>
                     <cylinderGeometry args={[0.12, 0.1, 0.6, 8]} />
                     <meshStandardMaterial color="#1a1a1a" />
                 </mesh>
                 {/* Forearm */}
                 <group position={[0, -0.6, 0]} rotation={[0.5, 0, 0]}>
                      <mesh position={[0, -0.3, 0]}>
                          <cylinderGeometry args={[0.1, 0.08, 0.6, 8]} />
                          <meshStandardMaterial color="#1a1a1a" />
                      </mesh>
                      {/* Hand */}
                      <mesh position={[0, -0.65, 0]}>
                          <sphereGeometry args={[0.12]} />
                          <meshStandardMaterial color="#111" />
                      </mesh>
                      {/* SWORD ATTACHMENT */}
                      <Katana position={[0, -0.65, 0]} rotation={[Math.PI/2, 0, Math.PI/2]} />
                 </group>
            </group>

            {/* --- LEGS --- */}
            <group position={[0, -0.5, 0]}>
                 {/* Left Leg */}
                 <mesh position={[-0.3, -0.8, 0]}>
                     <cylinderGeometry args={[0.18, 0.12, 1.6, 8]} />
                     <meshStandardMaterial color="#0a0a0a" />
                 </mesh>
                 {/* Right Leg */}
                 <mesh position={[0.3, -0.8, 0]}>
                     <cylinderGeometry args={[0.18, 0.12, 1.6, 8]} />
                     <meshStandardMaterial color="#0a0a0a" />
                 </mesh>
            </group>
            
            <ContactShadows opacity={0.5} scale={10} blur={2} far={4} color="#000" />
        </group>
    )
}

function ToriiGate({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Pillars */}
      <mesh position={[-2, 2.5, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 5, 16]} />
        <meshStandardMaterial color="#8b0000" roughness={0.8} />
      </mesh>
      <mesh position={[2, 2.5, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 5, 16]} />
        <meshStandardMaterial color="#8b0000" roughness={0.8} />
      </mesh>
      
      {/* Base Stones */}
      <mesh position={[-2, 0.25, 0]}>
          <cylinderGeometry args={[0.4, 0.5, 0.5, 8]} />
          <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[2, 0.25, 0]}>
          <cylinderGeometry args={[0.4, 0.5, 0.5, 8]} />
          <meshStandardMaterial color="#333" />
      </mesh>

      {/* Top Bar (Kasagi) */}
      <mesh position={[0, 4.8, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[6, 0.4, 0.6]} />
        <meshStandardMaterial color="#8b0000" roughness={0.8} />
      </mesh>
      {/* Curved top ends */}
      <group position={[0, 4.8, 0]}>
           <mesh position={[-3.1, 0.1, 0]} rotation={[0, 0, 0.2]}>
               <boxGeometry args={[1, 0.4, 0.6]} />
               <meshStandardMaterial color="#8b0000" />
           </mesh>
           <mesh position={[3.1, 0.1, 0]} rotation={[0, 0, -0.2]}>
               <boxGeometry args={[1, 0.4, 0.6]} />
               <meshStandardMaterial color="#8b0000" />
           </mesh>
      </group>
      
      {/* Black Top Cap */}
      <mesh position={[0, 5.05, 0]}>
          <boxGeometry args={[6.2, 0.1, 0.7]} />
          <meshStandardMaterial color="#111" />
      </mesh>

      {/* Lower Bar (Nuki) */}
      <mesh position={[0, 3.8, 0]}>
        <boxGeometry args={[5.5, 0.3, 0.4]} />
        <meshStandardMaterial color="#8b0000" roughness={0.8} />
      </mesh>
      
      {/* Center Plaque */}
      <mesh position={[0, 4.3, 0]}>
          <boxGeometry args={[0.5, 0.8, 0.2]} />
          <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0, 4.3, 0.11]}>
         <planeGeometry args={[0.3, 0.6]} />
         <meshBasicMaterial color="#d4af37" />
      </mesh>
    </group>
  );
}

function Lantern({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
     if(group.current) {
         // Gentle swaying
         group.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 2 + position[0]) * 0.05;
         group.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 1.5 + position[2]) * 0.1;
     }
  });

  return (
    <group ref={group} position={position}>
      {/* Main Paper Body */}
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 0.8, 16]} />
        <meshStandardMaterial color="#ff4d4d" emissive="#ff2222" emissiveIntensity={0.5} transparent opacity={0.9} />
      </mesh>
      {/* Light source */}
      <pointLight intensity={1} distance={3} color="#ffaa00" />
      
      {/* Top cap */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Bottom cap */}
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      
      {/* Ribs */}
      <mesh position={[0, 0.2, 0]}>
          <torusGeometry args={[0.3, 0.01, 8, 16]} />
          <meshBasicMaterial color="#111" />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
          <torusGeometry args={[0.3, 0.01, 8, 16]} />
          <meshBasicMaterial color="#111" />
      </mesh>
      
      {/* String */}
      <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 1, 4]} />
          <meshBasicMaterial color="#333" />
      </mesh>
    </group>
  );
}

function SakuraParticles() {
  const count = 300;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 30; // Taller spread for scrolling
      const z = (Math.random() - 0.5) * 10;
      const speed = 0.02 + Math.random() * 0.05;
      const rotationSpeed = (Math.random() - 0.5) * 0.1;
      temp.push({ x, y, z, speed, rotationSpeed, time: Math.random() * 100 });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    
    particles.forEach((p, i) => {
      p.time += 0.01;
      // Fall down
      p.y -= p.speed;
      
      // Reset if too low (relative to camera, but we are scrolling.. simpler to just wrap in a large box)
      if (p.y < -15) p.y = 15;
      
      // Sway
      const xOffset = Math.sin(p.time) * 0.5;
      const zOffset = Math.cos(p.time * 0.8) * 0.5;
      
      dummy.position.set(p.x + xOffset, p.y, p.z + zOffset);
      
      // Rotate
      dummy.rotation.x += p.rotationSpeed;
      dummy.rotation.y += p.rotationSpeed;
      dummy.rotation.z += p.rotationSpeed;
      
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[0.05, 0]} />
      <meshStandardMaterial color="#ffd7d7" emissive="#ffc0cb" emissiveIntensity={0.2} transparent opacity={0.8} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

function SceneContent() {
  const scroll = useScroll();
  const samuraiGroup = useRef<THREE.Group>(null);
  const toriiGroup = useRef<THREE.Group>(null);
  const lanternGroup = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    // Scroll Progress: 0 to 1
    const r1 = scroll.range(0, 0.33); // First section
    const r2 = scroll.range(0.33, 0.33); // Second section
    
    // --- Section 1: Samurai Hero ---
    if (samuraiGroup.current) {
        // Fade out and move up as we scroll down
        samuraiGroup.current.position.y = -1.5 + r1 * 5; 
        samuraiGroup.current.position.z = -2 - r1 * 5;
        samuraiGroup.current.rotation.y = r1 * 0.5;
    }

    // --- Section 2: Torii Gate ---
    if (toriiGroup.current) {
        const zPos = 10 - (scroll.offset * 25); // Move towards camera
        toriiGroup.current.position.z = zPos;
    }

    // --- Section 3: Lanterns ---
    if (lanternGroup.current) {
       // Descend from top
       lanternGroup.current.position.y = 10 - (scroll.offset * 15);
    }
  });

  return (
    <>
      {/* Static Background */}
      <mesh position={[0, 0, -8]} scale={[30, 20, 1]}>
            <planeGeometry />
            <meshBasicMaterial color="#050505" />
            <Image url={bgTexture} transparent opacity={0.3} scale={[30, 20]} position={[0,0,0.1]} />
      </mesh>

      <SakuraParticles />

      {/* Hero Group with GEOMETRIC SAMURAI */}
      <group ref={samuraiGroup} position={[0, -1.5, -2]}>
          <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
              <GeometricSamurai />
          </Float>
      </group>

      {/* Torii Gate Sequence - Passing through */}
      <group ref={toriiGroup}>
          <ToriiGate position={[0, -2, -5]} scale={1.5} />
          <ToriiGate position={[0, -2, -15]} scale={1.5} />
          <ToriiGate position={[0, -2, -25]} scale={1.5} />
      </group>

      {/* Lanterns for Menu Section */}
      <group ref={lanternGroup} position={[0, 10, -3]}>
           <Lantern position={[-3, 0, 0]} />
           <Lantern position={[3, 1, -1]} />
           <Lantern position={[-2, -2, -2]} />
           <Lantern position={[4, -1, 1]} />
      </group>

      <SceneLights />
    </>
  );
}


function SceneLights() {
    return (
        <>
            <ambientLight intensity={0.2} />
            <spotLight position={[5, 10, 5]} angle={0.5} penumbra={1} intensity={2} color="#d4af37" castShadow />
            <pointLight position={[-5, 0, -5]} intensity={1} color="#8b0000" />
            {/* Rim light for the Samurai */}
            <spotLight position={[-5, 5, -2]} intensity={5} color="#8b0000" distance={10} />
            <fog attach="fog" args={['#050505', 5, 20]} />
        </>
    )
}

export default function ThreeScene() {
  return (
    <div className="absolute inset-0 h-screen w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={['#050505']} />
        
        <ScrollControls pages={4} damping={0.2}>
            <SceneContent />
            <Scroll html style={{ width: '100%', height: '100%' }}>
                <Interface />
            </Scroll>
        </ScrollControls>
        
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
