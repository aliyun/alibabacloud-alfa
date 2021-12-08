import { createContext } from 'react';
import { IContextProps } from './types';

/**
 * 为了兼容 React 15 可能没有 createContext 的 API
 */
export const Context = createContext ? createContext<IContextProps>({
  inOsSandBox: false,
}) : null;

