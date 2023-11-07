export type SetMatrixOption = {
  xOffset?: number;
};

export interface Point {
  x: number;
  y: number;
}

export type Color = number | number[] | string;

export interface IScreenService {
  get resolution(): Point;

  clear(refresh?: boolean): void;
  fill(color: Color, refresh?: boolean): void;
  setPixel(point: Point, color: Color, refresh?: boolean): void;
  setMatrix(
    grayScale: number[][],
    color: Color,
    option?: SetMatrixOption,
    refresh?: boolean,
  ): void;
  refresh(condition?: boolean): void;
}
