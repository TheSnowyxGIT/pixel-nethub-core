import fs = require("fs");
import p = require("path");
import JSZip = require("jszip");

/**
 * The goal of this class if to be able to read a package (pnh package) whatever it's a directory or a zip file.
 */
export abstract class IReader {
  abstract load(path: string): Promise<void>;
  abstract exists(path: string): Promise<boolean>;
  abstract isDirectory(path: string): Promise<boolean>;
  abstract isFile(path: string): Promise<boolean>;
  abstract read(path: string, asString?: true): Promise<string>;
  abstract read(path: string, asString?: false): Promise<Buffer>;
}

export class DirectoryReader extends IReader {
  static async from(path: string): Promise<IReader> {
    const reader = new DirectoryReader();
    await reader.load(path);
    return reader;
  }

  private dirPath: string;
  async load(path: string): Promise<void> {
    this.dirPath = path;
  }

  async exists(path: string): Promise<boolean> {
    return fs.existsSync(p.join(this.dirPath, path));
  }

  async isDirectory(path: string): Promise<boolean> {
    if (!(await this.exists(path))) {
      throw new Error(`Path ${path} not found`);
    }
    return fs.statSync(p.join(this.dirPath, path)).isDirectory();
  }

  async isFile(path: string): Promise<boolean> {
    if (!(await this.exists(path))) {
      throw new Error(`Path ${path} not found`);
    }
    return fs.statSync(p.join(this.dirPath, path)).isFile();
  }

  read(path: string, asString: false): Promise<Buffer>;
  read(path: string, asString: true): Promise<string>;
  async read(path: string, asString: boolean = true): Promise<Buffer | string> {
    asString = asString ?? true;
    return fs.readFileSync(
      p.join(this.dirPath, path),
      asString ? "utf8" : undefined
    );
  }
}

export class ZipReader extends IReader {
  static async from(path: string): Promise<IReader> {
    const reader = new ZipReader();
    await reader.load(path);
    return reader;
  }

  private zip: JSZip;
  async load(path: string): Promise<void> {
    this.zip = await JSZip.loadAsync(fs.readFileSync(path));
  }

  private get(path: string) {
    const paths = new Set([path, path + "/"]);
    for (const p of paths) {
      const obj = this.zip.files[p];
      if (obj) {
        return obj;
      }
    }
  }

  async exists(path: string): Promise<boolean> {
    return this.get(path) !== undefined;
  }

  async isDirectory(path: string): Promise<boolean> {
    if (!(await this.exists(path))) {
      throw new Error(`Path ${path} not found`);
    }
    const obj = this.get(path);
    return obj.dir;
  }

  async isFile(path: string): Promise<boolean> {
    if (!(await this.exists(path))) {
      throw new Error(`Path ${path} not found`);
    }
    const obj = this.get(path);
    return !obj.dir;
  }

  read(path: string, asString: false): Promise<Buffer>;
  read(path: string, asString: true): Promise<string>;
  async read(path: string, asString: boolean = true): Promise<Buffer | string> {
    asString = asString ?? true;
    const obj = this.get(path);
    if (!obj) {
      throw new Error(`Path ${path} not found`);
    }
    return obj.async(asString ? "text" : "nodebuffer");
  }
}

export async function getReader(path: string): Promise<IReader> {
  if (!fs.existsSync(path)) {
    throw new Error(`Path ${path} not found`);
  }
  const stat = fs.statSync(path);
  if (stat.isDirectory()) {
    return await DirectoryReader.from(path);
  } else if (stat.isFile()) {
    try {
      return await ZipReader.from(path);
    } catch (e) {
      throw new Error(`Path ${path} is not a valid zip file`);
    }
  } else {
    throw new Error(`Path ${path} is not a file or a directory`);
  }
}
