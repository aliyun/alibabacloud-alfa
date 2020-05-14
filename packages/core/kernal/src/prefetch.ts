import { BasicModule } from "./type";

export const prefetch = (apps: BasicModule[]) => {
  apps.forEach(async (app) =>  {
    await prefetchManifest(app.manifest);

    await prefetchSc(app.manifest);
  });
}