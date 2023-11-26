import { DirectoryReader, getReader } from "../../utils/package-reader";
import { BasicData, BasicValidator } from "./basic.validator";
import Logger from "../../utils/logger";
import colors = require("colors");
import { ValidationError } from "../../utils/errors/ValidationError";

const logger = new Logger("AppValidator");

export async function validatePackage(packagePath: string) {
  logger.log(`Validating package at ${colors.white(packagePath)}`);

  let data: BasicData;
  try {
    const basicValidator = new BasicValidator();
    logger.log(`Validating file ${colors.white(basicValidator.filePath)}`);
    const basicData = await basicValidator.validate(packagePath, logger);
    data = { ...data, ...basicData };
  } catch (e) {
    if (e instanceof ValidationError) {
      logger.error(e.message);
      logger.error(
        `Package ${colors.white(packagePath)} ${colors.red("ERROR")}`
      );
      throw new ValidationError(`Package ${packagePath} is not valid`);
    }
    logger.error(`Package ${colors.white(packagePath)} ${colors.red("ERROR")}`);
    throw e;
  }

  logger.log(
    `Package ${colors.white(data.name)} at ${colors.white(
      packagePath
    )} ${colors.green("OK")}`
  );

  const reader = await getReader(packagePath);
  const isDirectory = reader instanceof DirectoryReader;

  return { data, from: isDirectory ? "directory" : "zip" };
}
