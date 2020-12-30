import React, { useRef, useEffect } from 'react';
import { mountApp, prefetch } from '../../src';
import { appInfo } from './constants';

const Basic: React.FC<{}> = () => {
  const appRef = useRef();
  useEffect(() => {
    prefetch([ appInfo ]);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      mountApp({
        ...appInfo,
        dom: appRef.current
      });
    }, 4000)
  })
  return React.createElement(appInfo.name, { ref: appRef })
}

export default Basic;
