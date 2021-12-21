import React from 'react';
import Skeleton from './Skeleton';

const initialPath = window.location.pathname;

interface IProps {
  loading?: boolean | React.ReactChild;
  microAppContainer?: string
}

export default function getLoading({loading, microAppContainer }: IProps) {
  // 第一次如果是 ssr 出来的内容直接拿 ssr 的内容作为骨架做展示
  // 防止出现首屏抖动
  if (microAppContainer) {
    const node = document.querySelector(microAppContainer);
    //@ts-ignore
    if (initialPath === window.location.pathname && window.__isSSR) {
      return React.createElement(microAppContainer, {
        children: <div dangerouslySetInnerHTML={{ __html: node ? node.innerHTML : '' }} />
      })
    }
  }

  if (loading === false) {
    return null;
  } else if (loading && React.isValidElement(loading)) {
    return loading;
  }

  return <Skeleton active />;
}