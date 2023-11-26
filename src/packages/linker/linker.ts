import Logger from "../../utils/logger";
import { PackageMetadata } from "../package-metadata";
import {
  Service,
  FontsService,
  ScreensService,
  ServerService,
} from "../../services";

const logger = new Logger("Linker");

export type Services = {
  fontsService: Service;
  screenService: Service;
  serverService: Service;
};

async function loadService(
  service: new (...args: any[]) => Service,
  ...args: any[]
) {
  const serviceInstance = new service(...args);
  await serviceInstance.load();
  return serviceInstance;
}

export async function getServices(
  config: unknown,
  packageMetaData: PackageMetadata
): Promise<Partial<Services>> {
  let services: Partial<Services> = {};
  if (packageMetaData.type !== "app") {
    throw new Error("Only apps can be run for now");
  }

  logger.log(`Loading services for package type [${packageMetaData.type}]`);
  services.screenService = await loadService(
    ScreensService,
    packageMetaData,
    config
  );
  services.fontsService = await loadService(
    FontsService,
    packageMetaData,
    config
  );
  services.serverService =
    packageMetaData.data.server &&
    (await loadService(ServerService, packageMetaData, config));

  return services;
}
