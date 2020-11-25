import React, { useRef, useEffect } from 'react';
import { mountApp } from '../../src';
import { appInfo } from './constants';

const Basic: React.FC<{}> = () => {
  const appRef = useRef();
  useEffect(() => {
    mountApp({
      ...appInfo,
      dom: appRef.current
    });
  })
  return React.createElement(appInfo.name, { ref: appRef })
}

export default Basic;
