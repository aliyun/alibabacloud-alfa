import React, { useRef, useEffect } from 'react';
import { createMicroApp } from '../../src';
import { appManifest } from './constants';

const Basic: React.FC<{}> = () => {
  const appRef = useRef();

  useEffect(() => {
    (async () => {

      const app = await createMicroApp({
        ...appManifest
      }, {})

      await app.load()
  
      await app.mount({
        dom: appRef.current
      });

      return () => {
        app.unmount();
      };
    })()
  });

  return <div ref={appRef}/>
}

export default Basic;
