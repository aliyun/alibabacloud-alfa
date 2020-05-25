import postcss from 'postcss';
import { join  } from 'path';
import { existsSync, readFileSync, writeFileSync, readdirSync } from 'fs';
import { postcssWrap } from './postcssWrap';

export interface IWrapCssOption {
  ext: string;
  disableOsCssExtends: boolean;
}

const getExtends = (ext?: string) => {
  return ext ? ext : '.os.css';
}

export const wrapCss = async (dirPath: string, root: string, opts: IWrapCssOption) => {
  if (!existsSync(dirPath)) {
    return;
  }

  const files = readdirSync(dirPath);
  const ext = getExtends(opts.ext);

  files.forEach(async (file) => {
    if (!file.endsWith('.css') || file.endsWith(ext)) {
      return;
    }
    const srcPath = join(dirPath, file);
    const destPath = `${join(dirPath, file).replace('.css', '')}${ !opts.disableOsCssExtends ? ext : '.css' }`
    const cssContent = readFileSync(srcPath, 'utf-8');

    const result = await postcss([
      postcssWrap({ stackableRoot: root, repeat: 1, overrideIds: false })
    ])
      .process(cssContent, { from: dirPath, to: destPath })

    writeFileSync(destPath, result.css, 'utf-8');
  });
}