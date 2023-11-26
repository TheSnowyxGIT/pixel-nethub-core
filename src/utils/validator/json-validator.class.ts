import { JSZipObject } from "jszip";
import fs = require("fs");
import JSZip = require("jszip");
import * as yup from "yup";
import path = require("path");
import { ValidationError } from "../../utils/errors/ValidationError";
import { Validator } from "./validator.class";
import { IReader, getReader } from "../package-reader";
import { CoreError } from "../errors/CoreError";
import Logger from "../logger";
import colors = require("colors");

export default abstract class JsonValidator<T> extends Validator<T> {
  abstract filePath: string;
  abstract schema: yup.Schema<any>;

  abstract customValidate(content: T): Promise<T>;

  async validate(targetPath: string, logger: Logger): Promise<T> {
    let reader: IReader;
    try {
      reader = await getReader(targetPath);
    } catch (e) {
      throw new ValidationError(e.message);
    }

    if (!(await reader.exists(this.filePath))) {
      throw new ValidationError(`File ${this.filePath} not found`);
    }

    const content = await reader.read(this.filePath);
    let jsonContent;
    try {
      jsonContent = JSON.parse(content);
    } catch (e) {
      throw new ValidationError(`File ${this.filePath} is not valid JSON`);
    }
    try {
      const data = await this.schema.validate(jsonContent);
      await this.customValidate(data);
      return data;
    } catch (e) {
      if (e instanceof CoreError) {
        throw e;
      } else if (e instanceof yup.ValidationError) {
        throw new ValidationError(e.message);
      }
      throw e;
    }
  }
}
