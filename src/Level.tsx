import { Cell, CellType } from "./Cell";

const cells: Map<number, Cell> = new Map();

// Populate the cell registry
cells.set(1, new Cell(1, CellType.Solid, 3));
cells.set(2, new Cell(2, CellType.Exterior, 5));
cells.set(3, new Cell(3, CellType.Interior, 7));

const map = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
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