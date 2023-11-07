import { PackageJson } from "./validator/files/packageJson.validator";
import { validateApp, ValidateResult } from "./validator/validator.service";

export class AppMetadata {
    static async load(appPath: string) {
      const data = await validateApp(appPath);
      const metadata = new AppMetadata(appPath, data);
      return metadata;
    }
  
    public readonly metadata: PackageJson;
    public get name() {
      return this.metadata.name;
    }
    public get version() {
      return this.metadata.version;
    }
  
    private constructor(public readonly appPath: string, data: ValidateResult) {
      this.metadata = data['package.json'];
    }
  }
