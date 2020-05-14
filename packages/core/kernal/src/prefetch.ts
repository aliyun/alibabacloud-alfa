import { BasicModule } from "./type";
import { createApplication } from './application/createApp';

export const prefetch = (apps: BasicModule[]) => {
  apps.forEach(async (appInfo) => {
    const app = await createApplication(appInfo, {});
    app.load();
  });
}