import React from 'react';
import { History } from 'history';
import { createEventBus } from '@alicloud/console-os-kernal';
import omit from 'lodash/omit';

import { IProps } from './index';

const eventBus = createEventBus();

interface IRouterProps {
  path?: string;
  history?: History;
  formatNextPath?: (id: string, location: Location) => string;
  externalRouterHandler: (href: string) => void;
}

const normalizeName = (name: string) => {
  return name.replace(/@/g, '').replace(/\//g, '-');
};

export const withRouter = (App: React.Component<{}, IProps>) => {
  return (props: IProps & IRouterProps) => {
    const { id, history, formatNextPath } = props;

    const name = normalizeName(id);

    React.useEffect(() => {
      const historyChangeHandle = (appLocation: Location) => {
        // 判断当前 location 的状态是不是一致的，如果是一致的就不要二次 replace
        // 防止出现多次渲染的情况，甚至触发无限渲染
        const nextPath = formatNextPath ? formatNextPath(name, appLocation) : `${appLocation.pathname}${appLocation.search}`;
        if (nextPath !== `${window.location.pathname}${window.location.search}`) {
          // 这里由于要和 React-Router 的 history 保持一致
          // history replace 会触发宿主自顶向下的渲染，同时也会导致 react-router 的变化
          // 从而可以变更一些依赖路由状态的组件，比如侧边栏的高亮，比如依赖 path 的面包屑的计算
          history?.replace?.(nextPath);
        }
      };

      const externalRouterHandler = (href: string) => {
        props.externalRouterHandler ? props.externalRouterHandler(href) : history?.push?.(href);
      };

      eventBus.on(`${name}:history-change`, historyChangeHandle);
      eventBus.on(`${name}:external-router`, externalRouterHandler);

      return () => {
        eventBus.removeListener(`${name}:history-change`, historyChangeHandle);
        eventBus.removeListener(`${name}:external-router`, externalRouterHandler);
      };
    }, [formatNextPath, name, history]);

    // @ts-ignore
    return <App __enableInitialHistoryAction {...omit(props, ['history', 'formatNextPath', 'externalRouterHandler'])} />;
  };
};
