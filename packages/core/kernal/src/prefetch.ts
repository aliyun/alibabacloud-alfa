import { BasicModule } from "./type";
import { createApplication } from './application/createApp';
import { globalOptions } from './mount';

export const prefetch = (apps: BasicModule[]) => {
  apps.forEach(async (appInfo) => {
    const app = await createApplication({
      ...appInfo
    }, {
      ...globalOptions.sandbox
    });
    app.load();
  });
}
