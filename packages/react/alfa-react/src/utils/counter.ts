let lastApp: string | undefined;
let lastTime = 0;

const min = 1000;

/**
 * 计算初始化次数，并提示重复加载的应用
 * @param appId string
 */
export const countRegister = (appId: string) => {
  const nowTime = Date.now();

  if (lastApp === appId && lastTime && nowTime - lastTime < min) {
    console.warn(`[@alicloud/alfa-react] ${appId} 重复加载，请检查你的代码。请在函数组件中使用 useAlfaApp 或 useAlfaWidget 方法。`);
  }

  lastApp = appId;
  lastTime = nowTime;
};
