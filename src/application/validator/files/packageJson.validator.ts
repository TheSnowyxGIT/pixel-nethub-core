import { boolean, object, string } from "yup";
import semver = require("semver");
import { ValidationError } from "../../errors/AppCheckerError";
import JsonValidator from "../json-validator.class";

export interface PackageJson {
  name: string;
  version: string;
  server: boolean;
}

export class PackageJsonValidator extends JsonValidator<PackageJson> {
  filePath = "package.json";
  schema = object({
    name: string().required(),
    version: string().required(),
    server: boolean().default(false),
  });
  async customValidate(content: PackageJson): Promise<PackageJson> {
    content.version = semver.clean(content.version);
    if (!content.version) {
      throw new ValidationError("Invalid version format");
    }
    return content;
  }
}
