import * as postcss from 'postcss';
import { join  } from 'path';
import { existsSync, readFileSync, writeFileSync, readdirSync } from 'fs';
import { PluginOptions } from '@alicloud/console-toolkit-core';
import { postcssWrap } from './postcssWrap';

export const sandBoxCss = async (dirPath: string, root: string, opts: PluginOptions) => {
  if (!existsSync(dirPath)) {
    return;
  }

  const files = readdirSync(dirPath);

  files.forEach(async (file) => {
    if (!file.endsWith('.css') || file.endsWith('.os.css')) {
      return;
    }
    const srcPath = join(dirPath, file);
    const destPath = `${join(dirPath, file).replace('.css', '')}${ !opts.disableOsCssExtends ? '.os' : ''}.css`
    const cssContent = readFileSync(srcPath, 'UTF-8');

    const result = await postcss([
      postcssWrap({ stackableRoot: root, repeat: 1, overrideIds: false })
    ])
      .process(cssContent, { from: dirPath, to: destPath })

    writeFileSync(destPath, result.css, 'UTF-8');
  });
}