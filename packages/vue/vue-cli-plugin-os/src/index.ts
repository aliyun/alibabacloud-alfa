import path from 'path';
import { chainOsWebpack } from '@alicloud/console-toolkit-plugin-os';
import { getEnv, BuildType } from '@alicloud/console-toolkit-shared-utils';

import { generateCdnPath } from './generateCdnPath';

const plugin = (api, options) => {
  const env = getEnv();
  const { buildType } = env;
  const cdnPath = generateCdnPath(env);

  api.chainWebpack((webpackConfig) => {
    webpackConfig
      .devServer
      .headers({
        'Access-Control-Allow-Origin': '*',
      })
      .set('disableHostCheck', true);

    webpackConfig.plugins.delete('prefetch');
    webpackConfig.plugins.delete('preload');
    webpackConfig.optimization.delete('splitChunks');

    if (cdnPath && buildType === BuildType.Prod_Cloud) {
      webpackConfig.output.publicPath(cdnPath);
    }

    const buildDestDir = process.env.BUILD_DEST_DIR || process.env.BUILD_DEST || 'dist';
    const dist = path.resolve(process.cwd(), buildDestDir, 'css');

    chainOsWebpack(
      {
        disableOsCssExtends: true,
        cssBuildDir: dist,
        ...((options.pluginOptions && options.pluginOptions.consoleOs) || {}),
      },
    )(webpackConfig);
  });
};

export = plugin;
