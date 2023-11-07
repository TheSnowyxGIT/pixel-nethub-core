import fs = require('fs');
import {
  PackageJson,
  PackageJsonValidator,
} from './files/packageJson.validator';
import Logger from '../../logger';
import colors = require('colors');
import { ValidationError } from '../errors/AppCheckerError';
import { Validator } from './validator.class';

const logger = new Logger('AppValidator');

export type ValidateResult = {
  'package.json': PackageJson;
};
export type AppFiles = keyof ValidateResult;
const filesToCheck: Record<AppFiles, Validator<any>> = {
  'package.json': new PackageJsonValidator(),
};
export async function validateApp(appPath: string): Promise<ValidateResult> {
  logger.log(`Validating app at ${colors.white(appPath)}`);
  if (!fs.existsSync(appPath))
    throw new ValidationError('No such file or directory');

  const result: ValidateResult = {} as ValidateResult;
  let success = true;
  for (const [key, validateObj] of Object.entries(filesToCheck)) {
    try {
      result[key] = await validateObj.validate(appPath);
      logger.log(`File ${colors.white(key)} ${colors.green('OK')}`);
    } catch (e) {
      success = false;
      logger.error(`File ${key} ${colors.red('ERROR')}`);
      if (e instanceof ValidationError) {
        logger.error(`Error: ${e.message}`);
      } else {
        throw e;
      }
    }
  }
  if (!success) {
    throw new ValidationError(`App at ${appPath} is not valid`);
  }
  logger.log(
    `App ${colors.white(result['package.json'].name)} at ${colors.white(
      appPath,
    )} ${colors.green('OK')}`,
  );
  return result;
}
