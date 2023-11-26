import { ValidationError, boolean, object, string } from "yup";
import JsonValidator from "../../utils/validator/json-validator.class";
import semver = require("semver");
import { PackageTypes, packageTypes } from "../package-metadata";

export interface BasicData {
  name: string;
  version: string;
  pnhType: PackageTypes;
  server: boolean;
}

export class BasicValidator extends JsonValidator<BasicData> {
  filePath = "package.json";
  schema = object({
    name: string().required(),
    version: string().required(),
    pnhType: string().oneOf(packageTypes).default("app"),
    server: boolean().default(false),
  });
  async customValidate(content: BasicData): Promise<BasicData> {
    content.version = semver.clean(content.version);
    if (!content.version) {
      throw new ValidationError("Invalid version format");
    }
    return content;
  }
}
