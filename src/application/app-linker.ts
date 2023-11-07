import ScreenService from "../screens/screen.service";
import { ServerService } from "../server/server.service";
import { AppMetadata } from "./app-metadata";

export function linkApp(appMetaData: AppMetadata, config: unknown) {
  const screenService = new ScreenService(config);

  let serverService: ServerService | undefined;
  if (appMetaData.metadata.server) {
    serverService = new ServerService(appMetaData, config);
  }

  return {
    screenService,
    serverService,
  };
}
