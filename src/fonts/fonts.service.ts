import path = require("path");
import { AppMetadata, Font, IFontService } from "../application";
import Logger from "../logger";
import { existsSync, readdirSync } from "fs";
import { load } from "opentype.js";
import { AppError } from "../application/errors/AppError";

export default class FontService implements IFontService {
  private readonly logger = new Logger(FontService.name);
  private fonts: Map<string, Font[]> = new Map();
  constructor(private readonly appMetadata: AppMetadata) {}

  getFont(fontFamily: string | string[], fontSubFamily?: string): Font {
    if (typeof fontFamily === "string") {
      return this.getFont([fontFamily], fontSubFamily);
    }
    for (const family of fontFamily) {
      const fonts = this.fonts.get(family);
      if (fonts) {
        const specific = fonts.find(
          (font) => font.fontSubfamily === (fontSubFamily || "Regular")
        );
        if (specific) {
          return specific;
        }
        const regular = fonts.find((font) => font.fontSubfamily === "Regular");
        if (regular) {
          return regular;
        }
        if (!fontSubFamily) {
          return fonts[0];
        }
      }
    }
    throw new AppError(`Font family ${fontFamily} not found`);
  }

  private async loadFont(input: string) {
    const font = await load(input);
    const fontFamily = font.names.fontFamily.en;
    const fontSubfamily = font.names.fontSubfamily.en;
    const fontFullName = font.names.fullName.en;
    this.fonts.set(fontFamily, [
      ...(this.fonts.get(fontFamily) || []),
      {
        fontFamily,
        fontSubfamily,
        sizeMult: 1,
        font,
      },
    ]);
    this.logger.log(
      `Font ${fontFullName} loaded. Family: ${fontFamily}, Subfamily: ${fontSubfamily}`
    );
  }

  private async loadAppFonts() {
    const appFontsDir = path.join(this.appMetadata.appPath, "assets", "fonts");
    if (existsSync(appFontsDir)) {
      const fontFiles = readdirSync(appFontsDir);
      for (const fontFile of fontFiles) {
        const fontPath = path.join(appFontsDir, fontFile);
        try {
          await this.loadFont(fontPath);
        } catch (e) {
          this.logger.warn(`Failed to load font ${fontPath}`);
          continue;
        }
      }
    }
  }

  async getLoadedFonts(): Promise<Font[]> {
    return Array.from(this.fonts.values()).flat();
  }
}
