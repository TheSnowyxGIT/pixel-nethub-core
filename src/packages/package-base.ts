export interface PackageStartParams {
  options: any;
}

export abstract class PackageBase implements PackageStartParams {
  options: any;

  abstract setup(): Promise<void> | void;
  async _setup() {
    await this.setup();
  }
}
