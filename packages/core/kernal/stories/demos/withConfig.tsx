import React, { useRef, useEffect } from 'react';
import { mountApp } from '../../src';
import { appManifest } from './constants';

const WithConfig: React.FC<{}> = () => {
  const appRef = useRef();
  useEffect(() => {
    mountApp({
      id: appManifest.name,
      manifest: appManifest,
      dom: appRef.current
    });
  })
  return <div ref={appRef}/>
}

export default WithConfig;
