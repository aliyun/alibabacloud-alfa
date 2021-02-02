import React, { useRef, useEffect } from 'react';
import { mountApp } from '../../src';
import { appInfo } from './constants';

const Basic: React.FC<{}> = () => {
  const appRef = useRef();
  useEffect(() => {
    mountApp({
      // name: 'os-example',
      manifest: 'http://g.alicdn.com/ConsoleOS/OSExample/0.0.6/os-example.manifest.json',
      dom: appRef.current,
      sharingKernel: true,
    });
  })
  return React.createElement(appInfo.name, { ref: appRef })
}

export default Basic;
