import React, { HTMLAttributes } from 'react';
import { IAppConfig, IOptions } from '@alicloud/alfa-core';

export interface IProps<T = any> extends HTMLAttributes<Element>, IAppConfig, IOptions {
  /*
   * 主要的属性从 alfa-core 继承而来，
   * 并且 config 和 option 部分平坦化地混到一起
   */

  /*
   * React 应用所需的特定属性
   */

  loading?: boolean | React.ReactChild;
  consoleConfig?: any;
}

export default class MicroAppBase<T> extends React.Component<Partial<IProps<T>>> {

  // todo: 组合消费 generateEntry 和 createMicroApp
}
