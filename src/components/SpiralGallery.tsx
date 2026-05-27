import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Image, useScroll, ScrollControls } from '@react-three/drei';
import * as THREE from 'three';

import bgDarkSouls from '@/assets/bg-darksouls.png';
import bgLofi from '@/assets/bg-lofi.png';
import bgFire from '@/assets/bg-fire.png';
import bgRain from '@/assets/bg-rain.jpg';

const images = [bgDarkSouls, bgLofi, bgFire, bgRain];

function Spiral({ radius = 3.5, height = 8 }) {
  const group = useRef<THREE.Group>(null);
  const scroll = useScroll();
  const { viewport } = useThree();

  // Create a continuous sequence of images
  const totalItems = 24;
  const items = useMemo(() => {
    return Array.from({ length: totalItems }).map((_, i) => {
      const angle = (i / totalItems) * Math.PI * 4; // Two full turns
      const y = (i / totalItems) * height - height / 2;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      return {
        position: [x, y, z] as [number, number, number],
        rotation: [0, angle, 0] as [number, number, number],
        url: images[i % images.length],
      };
    });
  }, [radius, height]);

  const baseRotation = useRef(0);

  useFrame((state, delta) => {
    if (!group.current) return;
    
    // Smooth, slow continuous base rotation
    baseRotation.current += delta * 0.05;

    // Scroll-based position and rotation (static addition, not velocity)
    const scrollOffset = scroll.offset;
    group.current.position.y = scrollOffset * height * 0.5;
    group.current.rotation.y = baseRotation.current + (scrollOffset * Math.PI * 0.5);

    // Subtle pointer interaction (parallax)
    const targetX = (state.pointer.x * viewport.width) / 20;
    const targetY = (state.pointer.y * viewport.height) / 20;
    group.current.rotation.x += 0.05 * (targetY - group.current.rotation.x);
    group.current.rotation.z += 0.05 * (targetX - group.current.rotation.z);
  });

  return (
    <group ref={group}>
      {items.map((item, i) => (
        <Image
          key={i}
          position={item.position}
          rotation={item.rotation}
          url={item.url}
          scale={[1.5, 1.5]}
          transparent
          opacity={0.9}
        />
      ))}
    </group>
  );
}

export function SpiralGallery() {
  return (
    <ScrollControls pages={1.8} damping={0.2}>
      <Spiral />
    </ScrollControls>
  );
}
