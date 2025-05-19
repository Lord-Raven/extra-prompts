import { useLoader } from "@react-three/fiber";
import { Block } from "@react-three/fiber/dist/declarations/src/core/utils";
import { NearestFilter, RepeatWrapping, Texture, TextureLoader } from "three";


export enum CellType {
  Solid,
  Exterior,
  Interior,
}

export enum BlockType {
  Floor,
  Ceiling,
  NorthWall,
  EastWall,
  SouthWall,
  WestWall,
  UpperNorthWall,
  UpperEastWall,
  UpperSouthWall,
  UpperWestWall
}

export interface Block {
  type: BlockType;
  textureIndex: number;
}

export const BLOCK_SIZE = 8;
const ATLAS_SIZE = 32;

// Texture cache
const textureCache = new Map<number, Texture>();

function getTexture(textureIndex: number) {
  if (textureCache.has(textureIndex)) {
    return textureCache.get(textureIndex)!;
  }

  const texture = useLoader(TextureLoader, "textures/textureAtlas.png").clone();
  const x = textureIndex % ATLAS_SIZE;
  const y = Math.floor(textureIndex / ATLAS_SIZE);
  const size = 1 / ATLAS_SIZE;

  texture.magFilter = NearestFilter;
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(size, size);
  texture.offset.set(x * size, 1 - (y + 1) * size);
  texture.needsUpdate = true;

  textureCache.set(textureIndex, texture);

  return texture;
}

export class Cell {
  public blockMap: Block[]

  constructor(public id: number, public type: CellType, blockProps: Record<string, number>) {
    this.blockMap = Object.entries(blockProps).map(([key, textureIndex]) => ({
        type: (BlockType as any)[key],
        textureIndex,
      }));
  }
}

// Functional component for rendering a cell mesh
export function RenderedCell({ cell, x, z }: { cell: Cell; x: number; z: number }) {

  return (
    <>
      {cell.blockMap.map(block => {
        switch (block.type) {
          case BlockType.NorthWall:
            return (
              <mesh key={`${x}-${z}-north-wall`} position={[x * BLOCK_SIZE, BLOCK_SIZE / 2, -z * BLOCK_SIZE - BLOCK_SIZE / 2]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[BLOCK_SIZE, BLOCK_SIZE]} />
                <meshStandardMaterial map={getTexture(block.textureIndex)} />
              </mesh>
            );
          case BlockType.EastWall:
            return (
              <mesh key={`${x}-${z}-east-wall`} position={[x * BLOCK_SIZE + BLOCK_SIZE / 2, BLOCK_SIZE / 2, -z * BLOCK_SIZE]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[BLOCK_SIZE, BLOCK_SIZE]} />
                <meshStandardMaterial map={getTexture(block.textureIndex)} />
              </mesh>
            );
          case BlockType.SouthWall:
            return (
              <mesh key={`${x}-${z}-south-wall`} position={[x * BLOCK_SIZE, BLOCK_SIZE / 2, -z * BLOCK_SIZE + BLOCK_SIZE / 2]} rotation={[0, 0, 0]}>
                <planeGeometry args={[BLOCK_SIZE, BLOCK_SIZE]} />
                <meshStandardMaterial map={getTexture(block.textureIndex)} />
              </mesh>
            );
          case BlockType.WestWall:
            return (
              <mesh key={`${x}-${z}-west-wall`} position={[x * BLOCK_SIZE - BLOCK_SIZE / 2, BLOCK_SIZE / 2, -z * BLOCK_SIZE]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[BLOCK_SIZE, BLOCK_SIZE]} />
                <meshStandardMaterial map={getTexture(block.textureIndex)} />
              </mesh>
            );
          case BlockType.Floor:
            return (
              <mesh key={`floor-${x}-${z}-floor`} position={[x * BLOCK_SIZE, 0, -z * BLOCK_SIZE]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[BLOCK_SIZE, BLOCK_SIZE]} />
                <meshStandardMaterial map={getTexture(block.textureIndex)} />
              </mesh>
            );
          case BlockType.Ceiling:
            return (
              <mesh key={`ceiling-${x}-${z}-ceiling`} position={[x * BLOCK_SIZE, BLOCK_SIZE, -z * BLOCK_SIZE]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[BLOCK_SIZE, BLOCK_SIZE]} />
                <meshStandardMaterial map={getTexture(block.textureIndex)} />
              </mesh>
            );
          case BlockType.UpperNorthWall:
            return (
              <mesh key={`${x}-${z}-upper-north-wall`} position={[x * BLOCK_SIZE, BLOCK_SIZE + BLOCK_SIZE / 2, -z * BLOCK_SIZE - BLOCK_SIZE / 2]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[BLOCK_SIZE, BLOCK_SIZE]} />
                <meshStandardMaterial map={getTexture(block.textureIndex)} />
              </mesh>
            );
          case BlockType.UpperEastWall:
            return (
              <mesh key={`${x}-${z}-upper-east-wall`} position={[x * BLOCK_SIZE + BLOCK_SIZE / 2, BLOCK_SIZE + BLOCK_SIZE / 2, -z * BLOCK_SIZE]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[BLOCK_SIZE, BLOCK_SIZE]} />
                <meshStandardMaterial map={getTexture(block.textureIndex)} />
              </mesh>
            );
          case BlockType.UpperSouthWall:
            return (
              <mesh key={`${x}-${z}-upper-south-wall`} position={[x * BLOCK_SIZE, BLOCK_SIZE + BLOCK_SIZE / 2, -z * BLOCK_SIZE + BLOCK_SIZE / 2]} rotation={[0, 0, 0]}>
                <planeGeometry args={[BLOCK_SIZE, BLOCK_SIZE]} />
                <meshStandardMaterial map={getTexture(block.textureIndex)} />
              </mesh>
            );
          case BlockType.UpperWestWall:
            return (
              <mesh key={`${x}-${z}-upper-west-wall`} position={[x * BLOCK_SIZE - BLOCK_SIZE / 2, BLOCK_SIZE + BLOCK_SIZE / 2, -z * BLOCK_SIZE]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[BLOCK_SIZE, BLOCK_SIZE]} />
                <meshStandardMaterial map={getTexture(block.textureIndex)} />
              </mesh>
            );
          default:
            return (
              <></>
            );
        }
      })}
    </>
  );
}
