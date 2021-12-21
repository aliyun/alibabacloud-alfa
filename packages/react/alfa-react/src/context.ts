import { createContext } from 'react';
import { IIsomorphicEnvironment } from '@alicloud/alfa-core';

/**
 * 用来提供 ssr 状态下的获取 服务端 manifest & bundle 的实现
 */
const EnvContext = createContext<Partial<IIsomorphicEnvironment>>({});

export default EnvContext;