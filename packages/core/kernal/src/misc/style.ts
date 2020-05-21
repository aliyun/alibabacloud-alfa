import { formatUrl } from './util';

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