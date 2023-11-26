/**
 * Option type for the function {@link IScreenService#setMatrix}.
 */
export type SetMatrixOption = {
  /**
   * The x-coordinate of the matrix position.
   */
  xOffset?: number;
  /**
   * The y-coordinate of the matrix position.
   * @default 0
   */
  yOffset?: number;
};

/**
 * Represents a point in a two-dimensional plane.
 *
 * @description
 * This type can be used to represent points in a two-dimensional plane.
 * It is used by the {@link IScreenService} interface to represent coordinates.
 *
 * @example
 * const point: Point = { x: 0, y: 0 };
 */
export interface Point {
  /**
   * The x-coordinate of the point.
   */
  x: number;

  /**
   * The y-coordinate of the point.
   */
  y: number;
}

/**
 * Represents a color in various formats.
 *
 * @description
 * This type can be used to represent colors in different formats:
 * - A 32-bit unsigned integer (uint32).
 * - An array of numbers representing [red, green, blue] or [red, green, blue, alpha] values.
 * - A string in hexadecimal format like "#ff0000".
 *
 * @example
 * // As a 32-bit unsigned integer (uint32)
 * const uintColor = 0xff0000; // Red color
 *
 * // As an array of [r, g, b] values
 * const rgbColor = [255, 0, 0]; // Red color
 *
 * // As an array of [r, g, b, a] values
 * const rgbaColor = [255, 0, 0, 0.5]; // Semi-transparent red color
 *
 * // As a hexadecimal string
 * const hexColor = "#ff0000"; // Red color
 *
 */
export type Color = number | number[] | string;

export interface IScreenService {
  /**
   * The resolution of the screen, represented as a {@link Point} with `x` and `y` coordinates.
   */
  get resolution(): Point;

  /**
   * Clears the screen.
   *
   * @param {boolean} [refresh=false] - Set to `true` to refresh the screen after clearing.
   */
  clear(refresh?: boolean): void;

  /**
   * Fills the entire screen with the specified color.
   *
   * @param {Color} color - The color to fill the screen with.
   * @param {boolean} [refresh=false] - Set to `true` to refresh the screen after filling.
   */
  fill(color: Color, refresh?: boolean): void;

  /**
   * Sets the color of a pixel at the specified {@link Point} coordinates.
   *
   * @param {Point} point - The coordinates of the pixel to set.
   * @param {Color} color - The color to set for the pixel.
   * @param {boolean} [refresh=false] - Set to `true` to refresh the screen after setting the pixel color.
   */
  setPixel(point: Point, color: Color, refresh?: boolean): void;

  /**
   * Sets a matrix of grayscale values with the specified color, position offset, and refresh option.
   *
   * @param {number[][]} grayScale - A matrix of grayscale values.
   * @param {Color} color - The color to apply to the grayscale values.
   * @param {SetMatrixOption} [option] - Options for setting the matrix position.
   * @param {boolean} [refresh=false] - Set to `true` to refresh the screen after setting the matrix.
   */
  setMatrix(
    grayScale: number[][],
    color: Color,
    option?: SetMatrixOption,
    refresh?: boolean
  ): void;

  /**
   * Refreshes the screen if a certain condition is met.
   *
   * @param {boolean} [condition=true] - The condition that triggers the screen refresh.
   */
  refresh(condition?: boolean): void;
}
