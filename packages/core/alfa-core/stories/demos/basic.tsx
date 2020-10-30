import React, { useRef, useEffect } from 'react';
import createMicroApp from '../../src';
import { appManifest } from './constants';

const Basic: React.FC<{}> = () => {
  const appRef = useRef();
  useEffect(() => {
    (async () => {
      const app = await createMicroApp({
        container: appRef.current,
        ...appManifest
      }, {})
      await app.load()
      //@ts-ignore
      await app.mount();
    })()
  })
  return <div ref={appRef}/>
}

export default Basic;
