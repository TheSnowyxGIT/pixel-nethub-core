import Logger from "../logger";

export abstract class Validator<T> {
  abstract validate(targetPath: string, logger: Logger): Promise<T>;
}
