interface IWin {
  __ALFA_DEVTOOLS_HOOK__: any;
}

export function getHookFromWindow() {
  if (typeof window === 'undefined') return;

  return (window as IWin).__ALFA_DEVTOOLS_HOOK__;
}

export class GlobalHook {
  static instance: GlobalHook;

  static getInstance() {
    if (!GlobalHook.instance) {
      GlobalHook.instance = new GlobalHook();
    }

    return GlobalHook.instance;
  }

  constructor() {
    this.instance = 1;
  }
}

export const globalHook = GlobalHook.getInstance();
