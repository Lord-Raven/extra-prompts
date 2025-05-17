

export enum CellType {
  Solid,
  Exterior,
  Interior,
}

export class Cell {
    constructor(public id: number, public type: CellType, public textureIndex: number) {}
    render(x: number, z: number) {
        switch (this.type) {
            case CellType.Solid:
              return (
                <mesh key={`${x}-${z}`} position={[x, 1, -z]}>
                  <boxGeometry args={[1, 2, 1]} />
                  <meshStandardMaterial color="gray" />
                </mesh>
              );
            case CellType.Exterior:
              return (
                <mesh key={`${x}-${z}`} position={[x, 0, -z]} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[1, 1]} />
                  <meshStandardMaterial color="green" />
                </mesh>
              );
            case CellType.Interior:
              return (
                <>
                  {/* Floor */}
                  <mesh key={`floor-${x}-${z}`} position={[x, 0, -z]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[1, 1]} />
                    <meshStandardMaterial color="beige" />
                  </mesh>
                  {/* Ceiling */}
                  <mesh key={`ceiling-${x}-${z}`} position={[x, 2, -z]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[1, 1]} />
                    <meshStandardMaterial color="white" />
                  </mesh>
                </>
              );
        }
        return null;
    }
}