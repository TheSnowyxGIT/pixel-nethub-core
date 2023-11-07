export abstract class Validator<T> {
  abstract validate(targetPath: string): Promise<T>;
}
