import { BlockType, Cell, RenderedCell, CellType } from "./Cell";

export const cells: Map<number, Cell> = new Map();

// Populate the cell registry
cells.set(0, new Cell(0, CellType.Exterior,
  {Floor: 1}));
cells.set(1, new Cell(1, CellType.Interior,
  {Floor: 1, Ceiling: 2, UpperNorthWall: 0, UpperEastWall: 0, UpperSouthWall: 0, UpperWestWall: 0}));
cells.set(2, new Cell(2, CellType.Solid,
  {NorthWall: 0, EastWall: 0, SouthWall: 0, WestWall: 0, UpperNorthWall: 0, UpperEastWall: 0, UpperSouthWall: 0, UpperWestWall: 0}));

export const map = [
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 2],
  [2, 1, 2, 1, 2, 1, 2, 0, 0, 0, 0, 2],
  [2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 2],
  [2, 2, 1, 1, 1, 2, 2, 0, 0, 0, 0, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
];

export function Level() {
  return (
    <>
      {map.map((row, z) =>
        row.map((cellId, x) => {
          const cell = cells.get(cellId);
          return cell ? <RenderedCell cell={cell} x={x} z={map.length - z} /> : null;
        })
      )}
    </>
  );
}