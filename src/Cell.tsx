import { useLoader, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { NearestFilter, RepeatWrapping, TextureLoader } from "three";


export enum CellType {
  Solid,
  Exterior,
  Interior,
}

const blockScale = 8;
const ATLAS_SIZE = 32;
function getUVOffset(textureIndex: number) {
  const x = textureIndex % ATLAS_SIZE;
  const y = Math.floor(textureIndex / ATLAS_SIZE);
  const size = 1 / ATLAS_SIZE;
  return { offset: [x * size, 1 - (y + 1) * size], repeat: [size, size] };
}

export class Cell {
    constructor(public id: number, public type: CellType, public textureIndex: number) {}
    render(x: number, z: number) {

        const texture = useLoader(TextureLoader, "textures/textureAtlas.png");
        const { offset, repeat } = useMemo(() => getUVOffset(this.textureIndex), [this.textureIndex]);

        // Set up texture repeat and offset
        useMemo(() => {
            if (texture) {
            texture.magFilter = NearestFilter;
            texture.wrapS = texture.wrapT = RepeatWrapping;
            texture.repeat.set(repeat[0], repeat[1]);
            texture.offset.set(offset[0], offset[1]);
            texture.needsUpdate = true;
            }
        }, [texture, offset, repeat]);

        switch (this.type) {
            case CellType.Solid:
              return (
                <mesh key={`${x}-${z}`} position={[x * blockScale, 0, -z * blockScale]}>
                  <boxGeometry args={[blockScale, blockScale, blockScale]} />
                  <meshStandardMaterial map={texture} />
                </mesh>
              );
            case CellType.Exterior:
              return (
                <mesh key={`${x}-${z}`} position={[x * blockScale, 0, -z * blockScale]} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[blockScale, blockScale]} />
                  <meshStandardMaterial map={texture} />
                </mesh>
              );
            case CellType.Interior:
              return (
                <>
                  {/* Floor */}
                  <mesh key={`floor-${x}-${z}`} position={[x * blockScale, 0, -z * blockScale]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[blockScale, blockScale]} />
                    <meshStandardMaterial map={texture} />
                  </mesh>
                  {/* Ceiling */}
                  <mesh key={`ceiling-${x}-${z}`} position={[x * blockScale, blockScale / 2, -z * blockScale]} rotation={[Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[blockScale, blockScale]} />
                    <meshStandardMaterial map={texture} />
                  </mesh>
                </>
              );
        }
        return null;
    }
}