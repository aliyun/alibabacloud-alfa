import postcss from 'postcss';
import glob from 'glob';
import { join, dirname, basename } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { postcssWrap } from './postcssWrap';

export interface IWrapCssOption {
  ext: string;
  disableOsCssExtends: boolean;
}

const getExtends = (ext?: string) => {
  return ext || '.os.css';
};

export const wrapCss = async (dirPath: string, root: string, opts: IWrapCssOption) => {
  if (!existsSync(dirPath)) {
    return;
  }

  const ext = getExtends(opts.ext);

  glob('**/*.css', {
    cwd: dirPath,
  }, (error, files) => {
    files.forEach(async (file) => {
      if (!file.endsWith('.css') || file.endsWith(ext)) {
        return;
      }
      const srcPath = join(dirPath, file);
      const destPath = `${join(dirPath, dirname(file), basename(file)).replace('.css', '')}${ !opts.disableOsCssExtends ? ext : '.css' }`;
      const cssContent = readFileSync(srcPath, 'utf-8');

      const result = await postcss([
        postcssWrap({ stackableRoot: root, repeat: 1, overrideIds: false }),
      ])
        .process(cssContent, { from: dirname(file), to: destPath });

      writeFileSync(destPath, result.css, 'utf-8');
    });
  });
};
