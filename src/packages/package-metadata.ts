import { validatePackage } from "./validate/validate";
import colors = require("colors");

export type PackageTypes = "app";
export const packageTypes: PackageTypes[] = ["app"];

export interface PackageData {
  name: string;
  version: string;
  pnhType: PackageTypes;
  server: boolean;
}

export class PackageMetadata {
  static async load(packagePath: string) {
    const { data, from } = await validatePackage(packagePath);
    const metadata = new PackageMetadata(packagePath, data, { from });
    return metadata;
  }

  public readonly from: "directory" | "zip";

  public get name() {
    return this.data.name;
  }
  public get version() {
    return this.data.version;
  }
  public get type() {
    return this.data.pnhType;
  }
  public readonly publicPath = "public";

  private constructor(
    public readonly appPath: string,
    public readonly data: PackageData,
    otherData: any
  ) {
    this.from = otherData.from;
  }
}

export function showMetadata(metadata: PackageMetadata) {
  console.log(`Package ${colors.white(metadata.name)}:`);
  console.log(`  Version: ${colors.white(metadata.version)}`);
  console.log(`  Type: ${colors.white(metadata.type)}`);
  console.log(
    `  Provide Server: ${colors.white(metadata.data.server ? "yes" : "no")}`
  );
  console.log(`  From: ${colors.white(metadata.from)}`);
  console.log(`  Path: ${colors.white(metadata.appPath)}`);
}
