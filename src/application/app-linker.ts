import FontService from "../fonts/fonts.service";
import ScreenService from "../screens/screen.service";
import { ServerService } from "../server/server.service";
import { AppMetadata } from "./app-metadata";

export async function linkApp(appMetaData: AppMetadata, config: unknown) {
  const screenService = new ScreenService(config);
  const fontsService = await FontService.load(appMetaData);

  let serverService: ServerService | undefined;
  if (appMetaData.metadata.server) {
    serverService = new ServerService(appMetaData, config);
  }

  return {
    screenService,
    serverService,
    fontsService,
  };
}
