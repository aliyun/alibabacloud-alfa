import * as postcss from 'postcss';
import { join  } from 'path';
import { existsSync, readFileSync, writeFileSync, readdirSync } from 'fs';

import { postcssWrap } from './postcssWrap';

export const sandBoxCss = async (dirPath: string, root: string) => {
  if (!existsSync(dirPath)) {
    return;
  }

  const files = readdirSync(dirPath);

  files.forEach(async (file) => {
    if (!file.endsWith('.css')) {
      return;
    }
    const srcPath = join(dirPath, file);
    const destPath = `${join(dirPath, file).replace('.css', '')}.os.css`
    const cssContent = readFileSync(srcPath, 'UTF-8');

    const result = await postcss([
      postcssWrap({ stackableRoot: root, repeat: 1, overrideIds: false })
    ])
      .process(cssContent, { from: dirPath, to: destPath })

    writeFileSync(destPath, result.css, 'UTF-8');
  })

}