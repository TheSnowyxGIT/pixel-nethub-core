import * as openType from "opentype.js";

export interface Font {
  fontFamily: string;
  fontSubfamily: string;
  sizeMult: number;
  font: openType.Font;
}

export interface IFontService {
  getLoadedFonts(): Promise<Font[]>;
  getFont(fontFamily: string | string[], fontSubFamily?: string): Font;
}
