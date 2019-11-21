import { createContext } from 'react';
import { IContextProps } from './types';

export const Context = createContext<IContextProps>({
  inOsSandBox: false
});

