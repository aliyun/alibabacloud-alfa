import React, { useRef, useEffect } from 'react';
import { mountApp } from '../../src';
import { appInfo } from './constants';

const Basic: React.FC<{}> = () => {
  const appRef = useRef();
  useEffect(() => {
    mountApp({
      // name: 'os-example',
      manifest: 'http://dev.g.alicdn.com/ConsoleOS/OSExample/0.0.7/os-example.manifest.json',
      dom: appRef.current,
      sharingKernel: true,
    });
  })
  return React.createElement(appInfo.name, { ref: appRef })
}

export default Basic;
