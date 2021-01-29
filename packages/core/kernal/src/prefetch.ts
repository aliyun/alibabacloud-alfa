import { BasicModule } from "./type";
import { createApplication } from './application/createApp';
import { globalOptions } from './mount';

export const prefetch = (apps: BasicModule[]) => {
  apps.forEach(async (appInfo) => {
    if (!appInfo.deps) {
      appInfo.deps = globalOptions.deps || {};
    }
    const app = await createApplication({
      ...appInfo
    }, {
      ...globalOptions.sandbox
    });
    await app.load();
  });
}
