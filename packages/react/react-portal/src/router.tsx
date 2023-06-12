import React, { useEffect, useContext, useRef } from 'react';
import { BrowserRouter, BrowserRouterProps, useHistory } from 'react-router-dom';
import { History } from 'history';

import { Context } from './Context';
import { getPathNameWithQueryAndSearch, removeHash } from './utils';

let isFirstEnter = false;

const updateHistory = (history: History, path: string) => {
  if (!history) {
    return;
  }

  if (path && path !== getPathNameWithQueryAndSearch()) {
    // 移除 hash 前缀，避免 react-router history 无法识别
    const realPath = removeHash(path);

    // 防止第一次渲染发生 redirect 时修改 path 导致再次进入重定向逻辑, <Redirect /> 只在 onmount 时才会修改路由
    // 故而重复渲染 <Redirect /> 是无效的
    if (isFirstEnter && history.action === 'REPLACE') {
      setTimeout(() => {
        history.push(realPath);
      }, 0);
    } else {
      history.push(realPath);
    }
  }
};

function Routes(props: BrowserRouterProps) {
  const history = useHistory();
  const { path } = useContext(Context).appProps || {};

  // 上一次同步的 path
  const prevSyncPath = useRef('');

  useEffect(() => {
    /**
     * 开启路由同步时，强制更新 history，避免微应用内部路由改变后，主应用再次跳转初始路径时不生效
     */
    if (prevSyncPath.current === path) return;

    prevSyncPath.current = path;
    updateHistory(history, path);
    isFirstEnter = false;
  });

  useEffect(() => {
    return () => {
      // reset isFirstEnter when unmount
      isFirstEnter = true;
    };
  });

  return (
    <>
      {props.children}
    </>
  );
}

export default function AlfaBrowserRouter(props: BrowserRouterProps) {
  return (
    <BrowserRouter>
      <Routes {...props}>
        {props.children}
      </Routes>
    </BrowserRouter>
  );
}
