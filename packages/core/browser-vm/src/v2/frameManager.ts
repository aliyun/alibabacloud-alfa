class IframeManager {
  baseFrame: HTMLIFrameElement;

  constructor() {
    this.map = new Map();

    this.baseFrame = IframeManager.createIframe();
  }

  // iframe dom 节点被删除时，会丢失上下文
  static createIframe(key?: string, src?: string) {
    const iframe = document.createElement('iframe');

    iframe.setAttribute('src', src || 'about:blank');
    iframe.style.cssText =
      'position: absolute; top: -20000px; width: 1px; height: 1px;';

    document.body.appendChild(iframe);

    return iframe;

    // TODO: 监听 iframe 被删除的 case
  }

  getIframe() {

  }

  remove() {
    if (!key) return false;
  }
}

export default new IframeManager();
