import { formatUrl } from './util';
import axios from 'axios';
import postcss from 'postcss'
import { postcssWrap } from './postcssWrap';
/**
 * 
 * @param urls 
 * @param manifest 
 */
export const addStyles = (urls: string[], manifest: string) => {
  urls.forEach((url) => {
    const styleSheet = document.createElement('link');
    styleSheet.rel = 'stylesheet';
    styleSheet.href = formatUrl(url, manifest);
    document.head.appendChild(styleSheet);
  });
}

export const addScopedStyles = (urls: string[], id: string) => {
  urls.forEach(async (url) => {
    const resp = await axios.get(url);
    return postcss([postcssWrap({ stackableRoot: id, repeat: 1, overrideIds: false })]).process(resp.data).then((result) => {
      const style = document.createElement('style');
      style.innerHTML = result.css;
      document.head.appendChild(style);
    })
  });
}