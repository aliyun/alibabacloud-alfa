import React, { HTMLAttributes } from 'react';
import { IAppConfig, IOptions } from '@alicloud/alfa-core';

// 从 alfa-core 继承而来
interface IProps<T = any> extends HTMLAttributes<Element>, IAppConfig, IOptions {

}

// todo
// export * from '@alicloud/alfa-core';
