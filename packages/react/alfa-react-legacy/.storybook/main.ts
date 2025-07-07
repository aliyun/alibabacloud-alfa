import { NodePackageImporter } from 'sass';
import { mergeConfig } from 'vite';
import type { StorybookConfig } from '@storybook/react-vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills'


const config: StorybookConfig = {
  stories: ['../stories/*.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {

    },
  },
  typescript: {
    // Enables the `react-docgen-typescript` parser.
    // See https://storybook.js.org/docs/api/main-config/main-config-typescript for more information about this option.
    reactDocgen: 'react-docgen-typescript',
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      // Add dependencies to pre-optimization
      resolve: {
        alias: {}
      },
      define: {
        'process.env': JSON.stringify({}),
      },
      plugins: [nodePolyfills()],
      css: {
        preprocessorOptions: {
          scss: {
            api: "modern-compiler",
            importers: [new NodePackageImporter()],
          }
        }
      }
    });
  },
};

export default config;
