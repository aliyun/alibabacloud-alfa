import React, { useRef, useEffect } from 'react';
import { mountApp } from '../../src';
import { appManifest } from './constants';

const WithConfig: React.FC<{}> = () => {
  const appRef = useRef();
  useEffect(() => {
    mountApp({
      name: appManifest.name,
      manifest: appManifest,
      dom: appRef.current
    });
  })
  return React.createElement(appManifest.name, { ref: appRef })
}

export default WithConfig;
