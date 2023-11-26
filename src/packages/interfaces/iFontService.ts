import * as t2m from "text2matrix";

export interface Font {
  fontFamily: string;
  fontSubfamily: string;
  sizeMult: number;
  font: t2m.Font;
}

export interface IFontService {
  getLoadedFonts(): Promise<Font[]>;
  getFont(fontFamily: string | string[], fontSubFamily?: string): Font;
}
