import { createContext } from 'react';
import { IContextProps } from './types';

export const Context = createContext ? createContext<IContextProps>({
  inOsSandBox: false
}) : null;

