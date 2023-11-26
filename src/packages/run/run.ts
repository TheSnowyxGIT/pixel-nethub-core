import { getServices } from "../linker/linker";
import { PackageBase, PackageStartParams } from "../package-base";
import { PackageMetadata } from "../package-metadata";
import * as path from "path";

async function importConstructor(packageMetaData: PackageMetadata) {
  let importedObj: any;
  try {
    importedObj = await import(path.resolve(packageMetaData.appPath));
  } catch (e) {
    throw new Error("Error loading package");
  }
  if (importedObj && importedObj.default) {
    importedObj = importedObj.default;
  }
  return importedObj as new () => PackageBase;
}

export async function runPackage(
  packageMetaData: PackageMetadata,
  options: any,
  config: unknown
) {
  if (packageMetaData.type !== "app") {
    throw new Error("Only apps can be run for now");
  }
  if (packageMetaData.from !== "directory") {
    throw new Error("Only decompressed packages can be run");
  }

  const constructor = await importConstructor(packageMetaData);
  const packageBaseInstance = new constructor();
  if (typeof packageBaseInstance._setup !== "function") {
    throw new Error("Invalid package");
  }

  const services = await getServices(config, packageMetaData);
  Object.assign(packageBaseInstance, {
    options,
    ...services,
  });

  await packageBaseInstance._setup();
}
