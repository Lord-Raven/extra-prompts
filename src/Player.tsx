import * as THREE from "three";
import { useKeyboardControls } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { BLOCK_SIZE, CellType } from "./Cell";
import { cells, Level, map } from "./Level";

enum Direction {
  NORTH = 0,
  EAST = 1,
  SOUTH = 2,
  WEST = 3
}

const directionVectors = [
  { x: 0, z: 1 }, // NORTH
  { x: 1, z: 0 },  // EAST
  { x: 0, z: -1 },  // SOUTH
  { x: -1, z: 0 }, // WEST
];

const directionAngles = [
  Math.PI / 2,    // NORTH (positive Z)
  0,              // EAST  (positive X)
  -Math.PI / 2,   // SOUTH (negative Z)
  Math.PI,        // WEST  (negative X)
];

const CAMERA_HEIGHT = 5;
const CAMERA_OFFSET_DISTANCE = 0.7; // Block distance behind center of Cell
const MOVE_VELOCITY = 8; // Blocks per second
const TURN_VELOCITY = Math.PI * 2; // Radians per second

export default function Player() {
  const { camera } = useThree();
  const [position, setPosition] = useState({ x: 3, z: 3 });
  const [dir, setDir] = useState(Direction.NORTH);
  const [isMoving, setIsMoving] = useState(false);
  
  const forward = useKeyboardControls((state) => state.forward);
  const faceBackward = useKeyboardControls((state) => state.backward);
  const faceLeft = useKeyboardControls((state) => state.left);
  const faceRight = useKeyboardControls((state) => state.right);
  const [keyPressed, setKeyPressed] = useState(false);

  // useFrame will update the camera based on deltaTime--change in time.
  useFrame((state, deltaTime) => {
    const targetAngle = directionAngles[dir];
    const camDir = camera.getWorldDirection(new THREE.Vector3());
    let currentAngle = Math.atan2(-camDir.z, camDir.x);
    const cameraOffset = {x: -Math.cos(currentAngle) * CAMERA_OFFSET_DISTANCE, 
      z: Math.sin(currentAngle) * CAMERA_OFFSET_DISTANCE};
    const targetX = (position.x + cameraOffset.x) * BLOCK_SIZE;
    const targetZ = (-position.z + cameraOffset.z) * BLOCK_SIZE;

    // If the Player is not moving, check input for a new move/direction.
    if (!isMoving) {
      if (forward) {
        if (!keyPressed) {
          const vec = directionVectors[dir];
          if (position.x + vec.x >= 0 && position.z + vec.z >= 0 && 
            position.z + vec.z < map.length && position.x + vec.x < map[map.length - (position.z + vec.z)].length &&
            (cells.get(map[map.length - (position.z + vec.z)][position.x + vec.x] ?? 0)?.type ?? CellType.Solid) !== CellType.Solid) {
              setPosition({ x: position.x + vec.x, z: position.z + vec.z });
              setIsMoving(true);
          }
          setKeyPressed(true);
        }
      } else if (faceBackward) {
        if (!keyPressed) {
          setDir((dir + 2) % 4);
          setIsMoving(true);
          setKeyPressed(true);
        }
      } else if (faceLeft) {
        if (!keyPressed) {
          setDir((dir + 3) % 4);
          setIsMoving(true);
          setKeyPressed(true);
        }
      } else if (faceRight) {
        if (!keyPressed) {
          setDir((dir + 1) % 4);
          setIsMoving(true);
          setKeyPressed(true);
        }
      } else {
        setKeyPressed(false);
      }

      camera.position.set(targetX, CAMERA_HEIGHT, targetZ);
      const lookX2 = targetX + Math.cos(targetAngle) * BLOCK_SIZE;
      const lookZ2 = targetZ - Math.sin(targetAngle) * BLOCK_SIZE;
      camera.lookAt(lookX2, BLOCK_SIZE / 2, lookZ2);
    } else {
      // --- Smoothly rotate camera ---
      // Get current Y rotation (in world space)
      // Normalize angles to [-PI, PI]
      let deltaAngle = targetAngle - currentAngle;
      if (deltaAngle > Math.PI) deltaAngle -= Math.PI * 2;
      if (deltaAngle < -Math.PI) deltaAngle += Math.PI * 2;
      const maxTurn = TURN_VELOCITY * deltaTime;
      if (Math.abs(deltaAngle) > maxTurn) {
        currentAngle += Math.sign(deltaAngle) * maxTurn;
      } else {
        currentAngle = targetAngle;
      }

      // --- Smoothly move camera position using MOVE_VELOCITY ---
      const camPos = {x: isNaN(camera.position.x) ? targetX : camera.position.x,
                      z: isNaN(camera.position.x) ? targetZ : camera.position.z};
      const dx = targetX - camPos.x;
      const dz = targetZ - camPos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      let newX = camPos.x;
      let newZ = camPos.z;

      if (dist > 0) {
        const moveStep = Math.min(MOVE_VELOCITY * BLOCK_SIZE * deltaTime, dist);
        newX += (dx / dist) * moveStep;
        newZ += (dz / dist) * moveStep;
      } else {
        newX = targetX;
        newZ = targetZ;
      }
      camera.position.set(newX, CAMERA_HEIGHT, newZ);

      // Camera look-at (one block ahead)
      const lookX = newX + Math.cos(currentAngle) * BLOCK_SIZE;
      const lookZ = newZ - Math.sin(currentAngle) * BLOCK_SIZE;
      camera.lookAt(lookX, BLOCK_SIZE / 2, lookZ);

      // --- Check if camera is close enough to target ---
      const posClose = Math.abs(newX - targetX) < 0.5 && Math.abs(newZ - targetZ) < 0.5;
      const angleClose = Math.abs(currentAngle - targetAngle) < 0.05;

      if (posClose && angleClose) {
        setIsMoving(false);
      }
    }

  });

  return null; // No mesh needed
}