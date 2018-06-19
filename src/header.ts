import {Flag, flagKeys, keys} from './util';
import {FontWeight} from './vega.schema';

export const HEADER_PROPERTIES_MAP = {
  titleAlign: 'align',
  titleAngle: 'angle',
  titleBaseline: 'baseline',
  titleColor: 'fill',
  titleFont: 'font',
  titleFontSize: 'fontSize',
  titleFontWeight: 'fontWeight',
  titleLimit: 'limit',
  titleX: 'x',
  titleY: 'y',
};

export const HEADER_PROPERTIES = Object.keys(HEADER_PROPERTIES_MAP);

export interface HeaderConfig {
  // ---------- Title ----------
  /**
   * Horizontal text alignment of headers.
   */
  titleAlign?: string;

  /**
   * Angle in degrees of headers.
   */
  titleAngle?: number;
  /**
   * Vertical text baseline for headers.
   */
  titleBaseline?: string;
  /**
   * Color of the header, can be in hex color code or regular color name.
   */
  titleColor?: string;

  /**
   * Font of the header. (e.g., `"Helvetica Neue"`).
   */
  titleFont?: string;

  /**
   * Font size of the header.
   *
   * @minimum 0
   */
  titleFontSize?: number;

  /**
   * Font weight of the header.
   * This can be either a string (e.g `"bold"`, `"normal"`) or a number (`100`, `200`, `300`, ..., `900` where `"normal"` = `400` and `"bold"` = `700`).
   */
  titleFontWeight?: FontWeight;

  /**
   * Maximum allowed pixel width of headers.
   */
  titleLimit?: number;

  /**
   * X-coordinate of the header relative to the axis group.
   */
  titleX?: number;

  /**
   * Y-coordinate of the header relative to the axis group.
   */
  titleY?: number;
}
