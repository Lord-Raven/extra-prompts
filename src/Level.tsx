import { Cell, CellType } from "./Cell";

const cells: Map<number, Cell> = new Map();

// Populate the cell registry
cells.set(0, new Cell(0, CellType.Exterior, 2));
cells.set(1, new Cell(1, CellType.Interior, 2));
cells.set(2, new Cell(2, CellType.Solid, 2));

const map = [
  [2, 2, 2, 2, 2, 2, 2],
  [2, 0, 0, 0, 0, 0, 2],
  [2, 1, 2, 1, 2, 1, 2],
  [2, 0, 0, 0, 0, 0, 2],
  [2, 2, 2, 2, 2, 2, 2],
];

export function Level() {
  return (
    <>
      {map.map((row, z) =>
        row.map((cell, x) =>
          cells.get(cell)?.render(x, z) ?? null
        )
      )}
    </>
  );
}