import * as THREE from "three";
import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export default function Player() {
  const { camera } = useThree();
  const playerRef = useRef<THREE.Mesh>(null);
  const [position, setPosition] = useState<[x:number, y: number, z: number]>([0, 1, 0]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setPosition(([x, y, z]) => {
        switch (event.key) {
          case "w":
            return [x, y, z - 0.2]; // Move forward
          case "s":
            return [x, y, z + 0.2]; // Move backward
          case "a":
            return [x - 0.2, y, z]; // Move left
          case "d":
            return [x + 0.2, y, z]; // Move right
          default:
            return [x, y, z];
        }
      });
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Sync camera position with player
  useFrame(() => {
    if (playerRef.current) {
      camera.position.set(position[0], position[1], position[2]);
    }
  });

  return (
    <mesh ref={playerRef} position={position}>
      <sphereGeometry args={[0.5]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}
