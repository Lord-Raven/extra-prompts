import * as THREE from "three";
import { useKeyboardControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export default function Player() {
  const { camera } = useThree();
  const playerRef = useRef<THREE.Mesh>(null);

  // Access keyboard state
  const forward = useKeyboardControls((state) => state.forward);
  const backward = useKeyboardControls((state) => state.backward);
  const left = useKeyboardControls((state) => state.left);
  const right = useKeyboardControls((state) => state.right);
  const jump = useKeyboardControls((state) => state.jump);

  // Player position
  useEffect(() => {
    if (playerRef.current) {
      camera.position.set(
        playerRef.current.position.x,
        playerRef.current.position.y + 1,
        playerRef.current.position.z
      );
    }
  }, []);

  // Update movement each frame
  useFrame(() => {
    if (playerRef.current) {
      const speed = 0.1;
      if (forward) playerRef.current.position.z -= speed;
      if (backward) playerRef.current.position.z += speed;
      if (left) playerRef.current.position.x -= speed;
      if (right) playerRef.current.position.x += speed;
      if (jump) playerRef.current.position.y += speed; // Basic jumping
    }
  });

  return (
    <mesh ref={playerRef} position={[0, 1, 0]}>
      <sphereGeometry args={[0.5]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}