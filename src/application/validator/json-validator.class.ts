import { JSZipObject } from 'jszip';
import fs = require('fs');
import JSZip = require('jszip');
import { Schema } from 'yup';
import path = require('path');
import { ValidationError } from '../errors/AppCheckerError';
import { Validator } from './validator.class';

export default abstract class JsonValidator<T> extends Validator<T> {
  abstract filePath: string;
  abstract schema: Schema<any>;

  abstract customValidate(content: T): Promise<T>;
  async validate(targetPath: string): Promise<T> {
    const stats = fs.statSync(targetPath);
    let filePath;
    let zip: JSZip | null = null;
    if (stats.isDirectory()) {
      filePath = path.join(targetPath, this.filePath);
    } else if (stats.isFile()) {
      try {
        zip = await JSZip.loadAsync(fs.readFileSync(targetPath));
      } catch (e) {
        throw new ValidationError(`File ${targetPath} is not valid zip`);
      }
    } else {
      throw new ValidationError(`File or Directory ${targetPath} not found`);
    }
    let zipObj: JSZipObject | null = null;
    if (zip) {
      zipObj = zip.file(this.filePath);
      if (!zipObj) {
        throw new ValidationError(`File ${this.filePath} not found in zip`);
      }
    } else {
      if (!fs.existsSync(filePath)) {
        throw new ValidationError(`File ${this.filePath} not found`);
      }
    }
    const content = zipObj
      ? await zipObj.async('string')
      : fs.readFileSync(filePath, 'utf-8');
    let jsonContent;
    try {
      jsonContent = JSON.parse(content);
    } catch (e) {
      throw new ValidationError(`File ${this.filePath} is not valid JSON`);
    }
    const data = await this.schema.validate(jsonContent);
    await this.customValidate(data);
    return data;
  }
}
