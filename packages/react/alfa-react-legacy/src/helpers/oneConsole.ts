interface IWin {
  ALIYUN_CONSOLE_CONFIG?: {
    portalType?: string;
  };
}

/**
 * 是否是 oneConsole 环境
 * @returns
 */
export function isOneConsole() {
  return (window as IWin).ALIYUN_CONSOLE_CONFIG?.portalType === 'one';
}
