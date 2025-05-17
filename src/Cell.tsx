

export enum CellType {
  Solid,
  Exterior,
  Interior,
}

const blockScale = 2;

export class Cell {
    constructor(public id: number, public type: CellType, public textureIndex: number) {}
    render(x: number, z: number) {
        switch (this.type) {
            case CellType.Solid:
              return (
                <mesh key={`${x}-${z}`} position={[x * blockScale, 0, -z * blockScale]}>
                  <boxGeometry args={[blockScale, blockScale, blockScale]} />
                  <meshStandardMaterial color="gray" />
                </mesh>
              );
            case CellType.Exterior:
              return (
                <mesh key={`${x}-${z}`} position={[x * blockScale, 0, -z * blockScale]} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[blockScale, blockScale]} />
                  <meshStandardMaterial color="green" />
                </mesh>
              );
            case CellType.Interior:
              return (
                <>
                  {/* Floor */}
                  <mesh key={`floor-${x}-${z}`} position={[x * blockScale, 0, -z * blockScale]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[blockScale, blockScale]} />
                    <meshStandardMaterial color="beige" />
                  </mesh>
                  {/* Ceiling */}
                  <mesh key={`ceiling-${x}-${z}`} position={[x * blockScale, blockScale, -z * blockScale]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[blockScale, blockScale]} />
                    <meshStandardMaterial color="white" />
                  </mesh>
                </>
              );
        }
        return null;
    }
}