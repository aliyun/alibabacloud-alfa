import React, { useRef, useEffect } from 'react';
import { mountApp } from '../../src';
import { appInfo } from './constants';

const Basic: React.FC<{}> = () => {
  const appRef = useRef();
  useEffect(() => {
    mountApp({
      // name: 'os-example',
      manifest: 'https://dev.g.alicdn.com/home-microapp/home-scene-resources/0.1.1/ali-alfa-cloud-home-app-scene-resource.manifest.json',
      dom: appRef.current,
      sharingKernel: true,
    });
  })
  return React.createElement(appInfo.name, { ref: appRef })
}

export default Basic;
