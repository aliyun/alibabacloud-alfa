import { AppInfo, AppOption, GlobalOption } from '../type';
import { Application } from './Application';

const createIsomorphicMicroApp = (appInfo: AppInfo, options: AppOption = {}) => {
  const app = new Application(appInfo);
  return app;
}

export default createIsomorphicMicroApp;
