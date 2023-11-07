export class FontData {
  name: string;
}

export interface IFontService {
  getFont(name: string): Promise<Buffer | null>;
  getAllFontsData(): Promise<FontData[]>;
}
