import { Font, IFontService } from "../../packages/interfaces";
import { Service } from "../IService";
import path = require("path");
import { existsSync, readdirSync } from "fs";
import { PackageMetadata } from "../../packages/package-metadata";
import colors = require("colors");
import * as t2m from "text2matrix";
import { AppError } from "../../utils/errors/AppError";

export class FontsService extends Service implements IFontService {
  constructor(packageMetaData: PackageMetadata, config: unknown) {
    super(packageMetaData, config, FontsService.name, colors.magenta);
  }

  private fonts: Map<string, Font[]> = new Map();

  private async loadFont(input: string) {
    const font = await t2m.Font.fromPath(input);
    const fontFamily = font.font.names.fontFamily.en;
    const fontSubfamily = font.font.names.fontSubfamily.en;
    const fontFullName = font.font.names.fullName.en;
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
      `Font ${colors.white(fontFullName)} loaded. Family: ${colors.white(
        fontFamily
      )}, Subfamily: ${colors.white(fontSubfamily)}`
    );
  }

  async load(): Promise<void> {
    const appFontsDir = path.join(
      this.packageMetaData.appPath,
      "assets",
      "fonts"
    );
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
    if (this.fonts.size === 0) {
      this.logger.log("No fonts loaded");
    }
  }

  async getLoadedFonts(): Promise<Font[]> {
    return Array.from(this.fonts.values()).flat();
  }

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
    throw new AppError(`no Fonts found for ${fontFamily} ${fontSubFamily}`);
  }
}
